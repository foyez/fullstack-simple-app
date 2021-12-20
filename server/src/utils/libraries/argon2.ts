import argon2 from "argon2";

// hash the plain password
export const hashPassword = (password: string): Promise<string> =>
  argon2.hash(password);

// compare the password with hashed password
export const verifyPassword = (hash: string, plain: string) =>
  argon2.verify(hash, plain);
