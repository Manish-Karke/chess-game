import React, { useEffect } from "react";
import {
    ActivityIndicator,
    FlatList,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { openBrowserAsync } from "expo-web-browser";
import { StyleSheet } from "react-native";

import { useLibraryViewModel } from "@/features/store/presentation/viewModels/useLibraryViewModel";
import { downloadProductPdfUseCase } from "@/features/store/di/storeFactory";

const COLORS = {
    background: "#050A12",
    card: "#111823",
    cardBorder: "#343B47",
    gold: "#D9A441",
    goldLight: "#F4D18A",
    white: "#FFFFFF",
    muted: "#B7BBC5",
};

export default function LibraryScreen() {
    const { entitlements, loading, error, refresh } = useLibraryViewModel();
    const [downloading, setDownloading] = React.useState<string | null>(null);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const handleDownload = async (productId: string) => {
        setDownloading(productId);
        try {
            const url = await downloadProductPdfUseCase.execute(productId);
            await openBrowserAsync(url);
        } catch (err) {
            console.error("PDF download failed:", err);
        } finally {
            setDownloading(null);
        }
    };

    const renderItem = ({ item }: { item: { product?: unknown } }) => {
        const entitlement = item as {
            id: string;
            grantedAt: string;
            product?: {
                id: string;
                title: string;
                type: "PDF" | "COURSE";
                priceMinor: number;
                currency: string;
            } | null;
        };
        const product = entitlement.product;
        return (
            <Pressable
                style={styles.row}
                onPress={() => product && router.push(`/store/${product.id}`)}
                hitSlop={10}
            >
                <View style={styles.iconBox}>
                    <Ionicons
                        name={
                            product?.type === "PDF"
                                ? "document-text-outline"
                                : "school-outline"
                        }
                        size={26}
                        color={COLORS.goldLight}
                    />
                </View>
                <View style={styles.body}>
                    <Text style={styles.itemTitle}>
                        {product?.title ?? "Purchased item"}
                    </Text>
                    <Text style={styles.meta}>
                        {product
                            ? `${product.currency} ${(product.priceMinor / 100).toFixed(2)}`
                            : ""}{" "}
                        · {new Date(entitlement.grantedAt).toLocaleDateString()}
                    </Text>
                </View>
                <Pressable
                    onPress={(event) => {
                        event.stopPropagation();
                        if (product?.id) {
                            handleDownload(product.id);
                        }
                    }}
                    style={styles.downloadButton}
                    hitSlop={10}
                >
                    {downloading === product?.id ? (
                        <ActivityIndicator size={16} color="#17110A" />
                    ) : (
                        <Text style={styles.downloadText}>Download PDF</Text>
                    )}
                </Pressable>
            </Pressable>
        );
    };

    if (loading && entitlements.length === 0) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={COLORS.background}
                />
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={COLORS.gold} />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle="light-content"
                backgroundColor={COLORS.background}
            />

            <FlatList
                data={entitlements}
                keyExtractor={(item) => (item as { id: string }).id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={
                    <>
                        <View style={styles.header}>
                            <Ionicons
                                name="book-outline"
                                size={26}
                                color={COLORS.goldLight}
                            />
                            <Text style={styles.title}>My Library</Text>
                        </View>

                        {error && (
                            <View style={styles.errorBox}>
                                <Text style={styles.errorText}>{error}</Text>
                                <Pressable
                                    onPress={refresh}
                                    style={styles.retryButton}
                                >
                                    <Text style={styles.retryText}>
                                        Try again
                                    </Text>
                                </Pressable>
                            </View>
                        )}
                        {!loading && !error && entitlements.length === 0 && (
                            <View style={styles.empty}>
                                <Ionicons
                                    name="book-outline"
                                    size={48}
                                    color={COLORS.muted}
                                />

                                <Text style={styles.emptyTitle}>
                                    Your library is empty
                                </Text>

                                <Text style={styles.emptySubtitle}>
                                    Purchased PDFs and courses appear here after
                                    payment.
                                </Text>
                            </View>
                        )}
                    </>
                }
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scroll: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        gap: 14,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    title: {
        color: COLORS.white,
        fontSize: 22,
        fontWeight: "800",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 14,
        borderRadius: 16,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
    },
    iconBox: {
        width: 56,
        height: 56,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        backgroundColor: "rgba(217, 164, 65, 0.12)",
        borderWidth: 1,
        borderColor: "rgba(217, 164, 65, 0.30)",
    },
    body: {
        flex: 1,
        minWidth: 0,
    },
    itemTitle: {
        color: COLORS.white,
        fontSize: 15,
        fontWeight: "800",
    },
    meta: {
        marginTop: 4,
        color: COLORS.muted,
        fontSize: 12,
    },
    downloadButton: {
        minHeight: 40,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.gold,
        backgroundColor: "transparent",
        alignItems: "center",
        justifyContent: "center",
    },
    downloadText: {
        color: COLORS.goldLight,
        fontSize: 12,
        fontWeight: "800",
    },
    loading: {
        paddingVertical: 40,
        alignItems: "center",
    },
    errorBox: {
        padding: 18,
        alignItems: "center",
        borderRadius: 14,
        backgroundColor: "rgba(75, 25, 32, 0.88)",
        borderWidth: 1,
        borderColor: "rgba(255, 150, 150, 0.20)",
    },
    errorText: {
        color: "#FFD2CE",
        fontSize: 13,
        textAlign: "center",
        marginBottom: 10,
    },
    retryButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 10,
        backgroundColor: "#3E2723",
    },
    retryText: {
        color: "#FFB4A2",
        fontSize: 13,
        fontWeight: "700",
    },
    empty: {
        paddingVertical: 60,
        alignItems: "center",
    },
    emptyTitle: {
        marginTop: 12,
        color: COLORS.white,
        fontSize: 17,
        fontWeight: "800",
    },
    emptySubtitle: {
        marginTop: 6,
        color: COLORS.muted,
        fontSize: 14,
        textAlign: "center",
    },
    listContent: {
        gap: 10,
        paddingBottom: 24,
    },
});
