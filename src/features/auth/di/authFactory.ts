import { RegisterUserUseCase } from "../domain/useCases/RegisterUserUseCase";
import { AuthRepositoryImpl } from "../infrastructure/api/AuthRepositoryImpl";
import { VerifyEmailUseCase } from "../infrastructure/api/VerifyEmailUseCase";

const authRepository = new AuthRepositoryImpl();

export const registerUserUseCase = new RegisterUserUseCase(
  authRepository,
);


export const verifyEmailUseCase =
  new VerifyEmailUseCase(authRepository);