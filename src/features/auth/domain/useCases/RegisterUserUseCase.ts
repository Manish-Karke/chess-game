import type {
  AuthRepository,
  RegisterUserInput,
} from "../repositories/AuthRepository";

export class RegisterUserUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
  ) {}

  execute(input: RegisterUserInput) {
    return this.authRepository.register(input);
  }
}