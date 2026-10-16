import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterFormValues,
} from "../../domain/schemas/registerSchema";
import { registerUserUseCase } from "../../di/authFactory";

type RegisterViewModelParams = {
  onRegistered: (email: string) => void;
};

export function useRegisterViewModel(
    {onRegistered}:RegisterViewModelParams
) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      const result = await registerUserUseCase.execute({
        email: values.email.trim(),
        username: values.username.trim(),
        password: values.password,
      });
  onRegistered(result.user.email);
      return result;
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again.",
      );

      return null;
    }
  });

  return {
    form,
    submit,
    serverError,
    isSubmitting: form.formState.isSubmitting,
  };
}