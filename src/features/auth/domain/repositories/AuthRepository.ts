
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

export type LoginUserInput = {
  email: string;
  password: string;
};

export type LoginUserResult = {
  accessToken: string;
  tokenType: "Bearer";
  expiresIn: number;
  user: {
    id: string;
    email: string;
    username: string;
  };
};

export interface AuthRepository {
  register(
    input: RegisterUserInput,
  ): Promise<RegisterUserResult>;

  verifyEmail(
    input: VerifyEmailInput,
  ): Promise<VerifyEmailResult>;

  login(
    input: LoginUserInput,
  ): Promise<LoginUserResult>;
}
