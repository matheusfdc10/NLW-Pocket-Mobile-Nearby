import { Platform, StyleSheet } from "react-native";

export const s  = StyleSheet.create({
    container: {
        maxHeight: 36,
        position: 'absolute',
        zIndex: 1,
        top: Platform.select({
            ios: 64,
            android: 24,
        }),
    },
    content: {
        gap: 8,
        paddingHorizontal: 24,
    }
})