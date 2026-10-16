import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
    loginSchema,
    type LoginFormValues,
} from "../../domain/schemas/loginSchema";
import { loginUserUseCase } from "../../di/authFactory";
type LoginViewModelParams = {
    onLoggedIn: () => void;
};

export function useLoginViewModel({ onLoggedIn }: LoginViewModelParams) {
    const [serverError, setServerError] = useState<string | null>(null);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const submit = form.handleSubmit(async (values) => {
        setServerError(null);

        try {
            await loginUserUseCase.execute({
                email: values.email.trim().toLowerCase(),
                password: values.password,
            });

            onLoggedIn();
        } catch (error) {
            setServerError(
                error instanceof Error
                    ? error.message
                    : "Unable to log in. Please try again.",
            );
        }
    });

    return {
        form,
        submit,
        serverError,
        isSubmitting: form.formState.isSubmitting,
    };
}
