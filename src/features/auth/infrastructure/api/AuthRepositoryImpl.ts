import type {
  AuthRepository,
  RegisterUserInput,
  RegisterUserResult,
} from "../../domain/repositories/AuthRepository";

import { registerRequest, verifyEmailRequest } from "./authApi";

export class AuthRepositoryImpl implements AuthRepository {
  async register(
    input: RegisterUserInput,
  ): Promise<RegisterUserResult> {
    return registerRequest(input);
  }

  async verifyEmail(input: {
  email: string;
  code: string;
}): Promise<{ message: string }> {
  return verifyEmailRequest(input);
}
}