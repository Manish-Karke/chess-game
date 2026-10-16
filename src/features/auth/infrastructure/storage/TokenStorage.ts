import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "chess_access_token";

export const tokenStorage = {
    async save(token: string): Promise<void> {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
    },

    async get(): Promise<string | null> {
        return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    },

    async clear(): Promise<void> {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    },
};
