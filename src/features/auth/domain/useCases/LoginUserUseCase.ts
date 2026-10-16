
import type {
  AuthRepository,
  LoginUserInput,
} from "../repositories/AuthRepository";

export class LoginUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  execute(input: LoginUserInput) {
    return this.authRepository.login(input);
  }
}
