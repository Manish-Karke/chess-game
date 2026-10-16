import { AuthRepository } from "../../domain/repositories/AuthRepository";


export class VerifyEmailUseCase {
  constructor(
    private readonly authRepository: AuthRepository
  ) {}

  execute(input: { email: string; code: string }) {
    return this.authRepository.verifyEmail(input);
  }
}
