
import type {
  AuthRepository,
  LoginUserInput,
  LoginUserResult,
  RegisterUserInput,
  RegisterUserResult,
} from "../../domain/repositories/AuthRepository";

import { tokenStorage } from "../storage/TokenStorage";

import {
  loginRequest,
  registerRequest,
  verifyEmailRequest,
} from "./authApi";

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

  async login(input: LoginUserInput): Promise<LoginUserResult> {
    const result = await loginRequest(input);

    await tokenStorage.saveSession({
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      accessTokenExpiresAt:
        Date.now() + result.expiresIn * 1000,
    });

    return result;
  }
}
