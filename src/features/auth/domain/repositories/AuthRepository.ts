
export type RegisterUserInput = {
  email: string;
  username: string;
  password: string;
};

export type RegisterUserResult = {
  user: {
    email: string;
    username: string;
  };
  verification: unknown;
};

export type VerifyEmailInput = {
  email: string;
  code: string;
};

export type VerifyEmailResult = {
  message: string;
};

export interface AuthRepository {
  register(
    input: RegisterUserInput,
  ): Promise<RegisterUserResult>;

  verifyEmail(
    input: VerifyEmailInput,
  ): Promise<VerifyEmailResult>;
}
