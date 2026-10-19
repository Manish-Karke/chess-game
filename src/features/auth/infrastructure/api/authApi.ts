import type {
    LoginUserInput,
    LoginUserResult,
    RegisterUserInput,
    RegisterUserResult,
} from "../../domain/repositories/AuthRepository";

const API_BASE_URL = "https://server-5-5h5o.onrender.com";

export async function registerRequest(
    input: RegisterUserInput,
): Promise<RegisterUserResult> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof body.message === "string"
                ? body.message
                : "Registration failed. Please try again.";

        throw new Error(message);
    }

    if (
        typeof body !== "object" ||
        body === null ||
        !("user" in body) ||
        typeof body.user !== "object" ||
        body.user === null ||
        !("email" in body.user) ||
        typeof body.user.email !== "string" ||
        !("username" in body.user) ||
        typeof body.user.username !== "string" ||
        !("verification" in body)
    ) {
        throw new Error("Unexpected registration response from server.");
    }

    return {
        user: {
            email: body.user.email,
            username: body.user.username,
        },
        verification: body.verification,
    };
}

export async function verifyEmailRequest(input: {
    email: string;
    code: string;
}): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
    });

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            typeof body === "object" &&
            body !== null &&
            "message" in body &&
            typeof body.message === "string"
                ? body.message
                : "Email verification failed. Please try again.";

        throw new Error(message);
    }

    if (
        typeof body !== "object" ||
        body === null ||
        !("message" in body) ||
        typeof body.message !== "string"
    ) {
        throw new Error("Unexpected verification response.");
    }

    return { message: body.message };
}


export class RefreshRejectedError extends Error {
  constructor() {
    super("Your session has expired. Please log in again.");
    this.name = "RefreshRejectedError";
  }
}

export async function loginRequest(
  input: LoginUserInput,
): Promise<LoginUserResult> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: input.email.trim().toLowerCase(),
      password: input.password,
    }),
  });

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : response.status === 403
          ? "Please verify your email before logging in."
          : response.status === 401
            ? "Invalid email or password."
            : "Login failed. Please try again.";

    throw new Error(message);
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("accessToken" in body) ||
    typeof body.accessToken !== "string" ||
    !("refreshToken" in body) ||
    typeof body.refreshToken !== "string" ||
    !("tokenType" in body) ||
    body.tokenType !== "Bearer" ||
    !("expiresIn" in body) ||
    typeof body.expiresIn !== "number" ||
    !("refreshExpiresIn" in body) ||
    typeof body.refreshExpiresIn !== "number" ||
    !("user" in body) ||
    typeof body.user !== "object" ||
    body.user === null ||
    !("id" in body.user) ||
    typeof body.user.id !== "string" ||
    !("email" in body.user) ||
    typeof body.user.email !== "string" ||
    !("username" in body.user) ||
    typeof body.user.username !== "string"
  ) {
    throw new Error("Unexpected login response from server.");
  }

  return {
    accessToken: body.accessToken,
    tokenType: "Bearer",
    expiresIn: body.expiresIn,
    refreshToken: body.refreshToken,
    refreshExpiresIn: body.refreshExpiresIn,
    user: {
      id: body.user.id,
      email: body.user.email,
      username: body.user.username,
    },
  };
}

export type RefreshSessionResult = LoginUserResult;

export async function refreshRequest(
  refreshToken: string,
): Promise<RefreshSessionResult> {
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  const body: unknown = await response.json().catch(() => null);

 
   if (response.status === 401) {
    throw new RefreshRejectedError();
  }

  if (!response.ok) {
    throw new Error(
      `Unable to refresh your session (HTTP ${response.status}).`,
    );
  }


  if (
    typeof body !== "object" ||
    body === null ||
    !("accessToken" in body) ||
    typeof body.accessToken !== "string" ||
    !("refreshToken" in body) ||
    typeof body.refreshToken !== "string" ||
    !("tokenType" in body) ||
    body.tokenType !== "Bearer" ||
    !("expiresIn" in body) ||
    typeof body.expiresIn !== "number" ||
    !("refreshExpiresIn" in body) ||
    typeof body.refreshExpiresIn !== "number" ||
    !("user" in body) ||
    typeof body.user !== "object" ||
    body.user === null ||
    !("id" in body.user) ||
    typeof body.user.id !== "string" ||
    !("email" in body.user) ||
    typeof body.user.email !== "string" ||
    !("username" in body.user) ||
    typeof body.user.username !== "string"
  ) {
    throw new Error("Unexpected refresh response from server.");
  }

  return {
    accessToken: body.accessToken,
    tokenType: "Bearer",
    expiresIn: body.expiresIn,
    refreshToken: body.refreshToken,
    refreshExpiresIn: body.refreshExpiresIn,
    user: {
      id: body.user.id,
      email: body.user.email,
      username: body.user.username,
    },
  };
}

export async function logoutRequest(
  refreshToken: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    throw new Error("Unable to revoke the server session.");
  }
}
