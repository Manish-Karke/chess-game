import { useCallback, useState } from "react";
import type { Entitlement } from "../../domain/repositories/StoreRepository";
import { getMyEntitlementsUseCase } from "../../di/storeFactory";

export function useLibraryViewModel() {
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getMyEntitlementsUseCase.execute();
      setEntitlements(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load your library. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { entitlements, loading, error, refresh: load };
}
