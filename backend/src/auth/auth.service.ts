import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
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

export interface RegisterInput {
  name: string;
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

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

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
    // email is the real guard against that race. If the constraint fires here,
    // surface the same friendly 409 instead of leaking Prisma's raw error.
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
}