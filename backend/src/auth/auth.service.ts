import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

/**
 * bcrypt cost factor. Each extra round roughly doubles the work to hash a
 * password and, more importantly, to brute-force one. 12 is the value we
 * chose for THIS project as a deliberate balance between hashing cost and
 * registration response time - it is not a universally-recommended default,
 * so revisit it if our hardware or threat model changes.
 */
const BCRYPT_SALT_ROUNDS = 12;
const MIN_PASSWORD_LENGTH = 8;
/** Lightweight format check; deliberately NOT a full RFC 5322 parser. */
const EMAIL_FORMAT_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Hash of a throwaway value that represents no real user. It is a FIXED
 * cost-12 hash (generated once, committed as a constant) rather than one
 * derived lazily at request time, so an unknown email costs exactly one
 * bcrypt.compare() - the same work as a wrong-password attempt - which helps
 * reduce timing differences between unknown-email and wrong-password
 * attempts. The value is not a secret and must never be reused as an actual
 * credential.
 */
const DUMMY_PASSWORD_HASH =
  '$2b$12$cMl9fcZ7WDlbhKiwG1.RdeYm0Obkhf0.eGPj3QJnCaBPP51NZB9SS';

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

/** Public user returned to clients. Intentionally has no password hash. */
export interface SafeUser {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

/**
 * Claims carried in the JWT. `sub` is the standard registered claim meaning
 * "subject" and holds the authenticated user's id; `email` mirrors the
 * normalized address. NO password, password hash, or other sensitive field
 * ever goes into the token - the token only proves *who* is authenticated,
 * not any secret about them.
 */
export interface JwtPayload {
  sub: number;
  email: string;
}

/**
 * Successful login payload: the same SafeUser shape the client already gets
 * from register, plus the signed access token the client must send back on
 * subsequent authenticated requests.
 */
export interface LoginResult {
  user: SafeUser;
  accessToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    input: RegisterInput,
  ): Promise<SafeUser> {
    // Runtime guard: the TS interface only describes the shape it *expects*,
    // it does not enforce it. A client can send missing keys, null, numbers,
    // or objects, so verify the actual types BEFORE calling .trim() below -
    // otherwise a non-string would crash with a 500 instead of a clean 400.
    if (
      input == null ||
      typeof input.name !== 'string' ||
      typeof input.email !== 'string' ||
      typeof input.password !== 'string'
    ) {
      throw new BadRequestException(
        'name, email, and password are all required',
      );
    }

    const name = input.name.trim();
    // Normalize the email so "  AHMED@EXAMPLE.COM  " and "ahmed@example.com"
    // resolve to the same account instead of silently creating duplicates.
    const email = input.email.trim().toLowerCase();
    const { password } = input;

    if (!name || !email || !password) {
      throw new BadRequestException(
        'name, email, and password are all required',
      );
    }

    if (!EMAIL_FORMAT_PATTERN.test(email)) {
      throw new BadRequestException(
        'email must be a valid address like you@example.com',
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw new BadRequestException(
        `password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      );
    }

    // Pre-check so a duplicate returns a clear 409 instead of Prisma's opaque
    // unique-constraint error. The unique index still guards against a race
    // between this query and the insert below.
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException(
        `A user with email ${email} already exists`,
      );
    }

    // Only the one-way hash is stored, never the plaintext password, so a
    // database leak cannot expose credentials an attacker could reuse.
    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    // The pre-check above is best-effort: two concurrent requests can both
    // pass it before either insert lands, so the database's unique index on
    // email is the real guard against that race. If the constraint fires
    // here, surface the same friendly 409 instead of leaking Prisma's raw
    // error.
    let user: Awaited<ReturnType<typeof this.prisma.user.create>>;
    try {
      user = await this.prisma.user.create({
        data: { name, email, passwordHash },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `A user with email ${email} already exists`,
        );
      }
      throw error;
    }

    // Strip the hash so it can never reach the client.
    const { passwordHash: _passwordHash, ...safeUser } = user;

    return safeUser;
  }

  async login(input: LoginInput): Promise<LoginResult> {
    // Same runtime type guard as register: verify the actual types BEFORE
    // calling .trim() so malformed input is a 400, not a 500.
    if (
      input == null ||
      typeof input.email !== 'string' ||
      typeof input.password !== 'string'
    ) {
      throw new BadRequestException(
        'email and password are both required',
      );
    }

    const email = input.email.trim().toLowerCase();
    const { password } = input;

    if (!email || !password) {
      throw new BadRequestException(
        'email and password are both required',
      );
    }

    // Reuse the same lightweight format check as register so malformed
    // addresses are a clean 400 instead of a pointless (and slower) 401.
    if (!EMAIL_FORMAT_PATTERN.test(email)) {
      throw new BadRequestException(
        'email must be a valid address like you@example.com',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    // Deliberately the SAME message for "unknown email" and "wrong password"
    // so an attacker cannot use the error text to enumerate which addresses
    // are registered. The timing-equalizer below exists for the same reason.
    if (!user) {
      // Unknown email and wrong password are indistinguishable: both do exactly
      // one bcrypt.compare() (unknown email against the fixed dummy hash),
      // which helps reduce timing differences between unknown-email and
      // wrong-password attempts.
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);
      throw new UnauthorizedException('Invalid email or password');
    }

    // bcrypt.compare() re-derives the hash from the candidate password and
    // compares it to the stored hash. Only the one-way hash ever leaves the
    // DB, so the plaintext is compared, never stored or logged.
    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Strip the hash so it can never reach the client.
    const { passwordHash: _passwordHash, ...safeUser } = user;

    // Sign the access token. `sub` (subject) carries the authenticated user's
    // id and email identifies the same user the SafeUser does; NOTHING secret
    // (no password, no hash) goes inside. The token only proves *who* is
    // authenticated.
    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    return { user: safeUser, accessToken };
  }
}
