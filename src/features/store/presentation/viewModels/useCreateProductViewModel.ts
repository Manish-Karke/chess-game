import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Product } from "../../domain/repositories/StoreRepository";
import {
  createProductSchema,
  type CreateProductFormValues,
} from "../../domain/schemas/productSchema";
import { createProductUseCase } from "../../di/storeFactory";

export function useCreateProductViewModel({
  onCreated,
}: {
  onCreated: (product: Product) => void;
}) {
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      type: "PDF",
      priceMinor: "",
      currency: "NPR",
    },
  });

  const submit = form.handleSubmit(async (values) => {
    setServerError(null);

    try {
      const product = await createProductUseCase.execute({
        title: values.title,
        slug: values.slug,
        description: values.description ?? undefined,
        type: values.type,
        priceMinor: Number(values.priceMinor),
        currency: values.currency,
      });

      onCreated(product);
      return product;
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "Failed to create the product. Please try again.",
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
