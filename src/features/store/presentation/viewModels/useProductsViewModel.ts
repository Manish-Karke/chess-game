import { useCallback, useState } from "react";
import type { Product } from "../../domain/repositories/StoreRepository";
import { getProductsUseCase } from "../../di/storeFactory";

export type ProductPage = {
  products: Product[];
  page: number;
  limit: number;
  total: number;
};

export function useProductsViewModel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(
    async (params?: { page?: number; limit?: number; search?: string }) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getProductsUseCase.execute(params);
        setProducts(result.products);
        setPage(result.page);
        setTotal(result.total);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load products. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    products,
    loading,
    error,
    page,
    total,
    load,
  };
}
