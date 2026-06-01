import { useEffect, useMemo, useState } from "react"
import {
  Alert,
  Animated,
  Linking,
  Platform,
  StyleSheet,
  View,
  type TextStyle,
  type ViewStyle,
} from "react-native"
import { CameraView, type BarcodeScanningResult, useCameraPermissions } from "expo-camera"
import MaterialIcons from "@expo/vector-icons/MaterialIcons"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { Button } from "@/components/Button"
import { Text } from "@/components/Text"
import { useAppTheme } from "@/theme/context"
import type { ThemedStyle } from "@/theme/types"

export type QRCodeScanResult = Pick<BarcodeScanningResult, "data" | "type">

type ContentAction = {
  label: string
  icon: React.ComponentProps<typeof MaterialIcons>["name"]
  url: string
}

type QRCodeScannerProps = {
  active?: boolean
  onClose?: () => void
  onScanned?: (result: QRCodeScanResult) => void
  title?: string
}

const SCANNER_SIZE = 260

const getContentAction = (data: string): ContentAction | null => {
  if (isUrl(data)) return { label: "Open URL", icon: "open-in-new", url: data }
  if (isEmail(data)) return { label: "Send Email", icon: "email", url: `mailto:${data}` }
  if (isPhone(data)) return { label: "Call", icon: "call", url: `tel:${data}` }

  return null
}

const isUrl = (text: string) => {
  try {
    const url = new URL(text)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

const isEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)

const isPhone = (text: string) => /^[\d\s()+-]+$/.test(text) && text.replace(/\D/g, "").length >= 10

export function QRCodeScanner({
  active = true,
  onClose,
  onScanned,
  title = "Scan QR Code",
}: QRCodeScannerProps) {
  const { themed, theme } = useAppTheme()
  const insets = useSafeAreaInsets()
  const [permission, requestPermission] = useCameraPermissions()
  const [scannedResult, setScannedResult] = useState<QRCodeScanResult | null>(null)
  const [cameraError, setCameraError] = useState<string | null>(null)

  const scanning = active && !scannedResult && permission?.granted
  const contentAction = useMemo(
    () => (scannedResult ? getContentAction(scannedResult.data) : null),
    [scannedResult],
  )

  useEffect(() => {
    if (!permission) {
      requestPermission()
    }
  }, [permission, requestPermission])

  const requestCameraPermission = async () => {
    const result = await requestPermission()

    if (!result.granted) {
      Alert.alert("Camera Permission Required", "Camera access is needed to scan QR codes.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Open Settings",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:")
            } else {
              Linking.openSettings()
            }
          },
        },
      ])
    }
  }

  const handleBarcodeScanned = ({ data, type }: BarcodeScanningResult) => {
    if (scannedResult) return

    const result = { data, type }
    setScannedResult(result)
    onScanned?.(result)
  }

  const scanAgain = () => {
    setCameraError(null)
    setScannedResult(null)
  }

  const openScannedContent = async () => {
    if (!contentAction) return

    const supported = await Linking.canOpenURL(contentAction.url)
    if (supported) {
      await Linking.openURL(contentAction.url)
    }
  }

  if (!permission) {
    return (
      <View style={themed($stateContainer)}>
        <MaterialIcons name="camera-alt" size={64} color={theme.colors.primary} />
        <Text style={themed($stateTitle)}>{title}</Text>
        <Text style={themed($stateMessage)}>Requesting camera access...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={themed($stateContainer)}>
        <MaterialIcons name="camera-enhance" size={72} color={theme.colors.error} />
        <Text style={themed($stateTitle)}>Camera Access Needed</Text>
        <Text style={themed($stateMessage)}>Allow camera access to scan a QR code.</Text>
        <Button
          text="Grant Access"
          preset="reversed"
          onPress={requestCameraPermission}
          style={themed($stateButton)}
        />
        {onClose ? <Button text="Close" onPress={onClose} style={themed($stateButton)} /> : null}
      </View>
    )
  }

  return (
    <View style={themed($container)}>
      <CameraView
        active={active}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        facing="back"
        onBarcodeScanned={scanning ? handleBarcodeScanned : undefined}
        onMountError={(event) => setCameraError(event.message)}
        style={StyleSheet.absoluteFill}
      />

      <View pointerEvents="none" style={themed($scrim)}>
        <View style={themed($scannerFrame)}>
          {scanning ? <ScanLine /> : null}
          <View style={[themed($corner), themed($cornerTopLeft)]} />
          <View style={[themed($corner), themed($cornerTopRight)]} />
          <View style={[themed($corner), themed($cornerBottomLeft)]} />
          <View style={[themed($corner), themed($cornerBottomRight)]} />
        </View>
      </View>

      <View style={[themed($topBar), { paddingTop: insets.top + 12 }]}>
        {onClose ? (
          <Button
            accessibilityLabel="Close QR scanner"
            LeftAccessory={({ style }) => (
              <MaterialIcons
                color={theme.colors.palette.neutral100}
                name="close"
                size={22}
                style={style}
              />
            )}
            onPress={onClose}
            preset="reversed"
            style={themed($iconButton)}
            text=""
          />
        ) : null}
        <View style={themed($titleBlock)}>
          <Text style={themed($cameraTitle)}>{title}</Text>
          <Text style={themed($cameraSubtitle)}>Place the code inside the frame.</Text>
        </View>
      </View>

      {cameraError ? (
        <View style={[themed($errorPill), { bottom: insets.bottom + 28 }]}>
          <Text style={themed($errorText)}>{cameraError}</Text>
        </View>
      ) : null}

      {scannedResult ? (
        <ScannedDataCard
          action={contentAction}
          bottomInset={insets.bottom}
          data={scannedResult.data}
          onActionPress={openScannedContent}
          onScanAgain={scanAgain}
          type={scannedResult.type}
        />
      ) : null}
    </View>
  )
}

function ScanLine() {
  const [animation] = useState(() => new Animated.Value(0))

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: 1,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ]),
    )

    loop.start()
    return () => loop.stop()
  }, [animation])

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [12, SCANNER_SIZE - 16],
  })

  return <Animated.View style={[$scanLine, { transform: [{ translateY }] }]} />
}

type ScannedDataCardProps = {
  action: ContentAction | null
  bottomInset: number
  data: string
  onActionPress: () => void
  onScanAgain: () => void
  type: string
}

function ScannedDataCard({
  action,
  bottomInset,
  data,
  onActionPress,
  onScanAgain,
  type,
}: ScannedDataCardProps) {
  const { themed, theme } = useAppTheme()
  const [slideAnimation] = useState(() => new Animated.Value(80))
  const [fadeAnimation] = useState(() => new Animated.Value(0))

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start()
  }, [fadeAnimation, slideAnimation])

  return (
    <Animated.View
      style={[
        themed($resultCard),
        {
          bottom: bottomInset + 18,
          opacity: fadeAnimation,
          transform: [{ translateY: slideAnimation }],
        },
      ]}
    >
      <View style={themed($resultHeader)}>
        <MaterialIcons color={theme.colors.primary} name="qr-code-scanner" size={24} />
        <Text style={themed($resultTitle)}>QR Code Scanned</Text>
      </View>

      <Text style={themed($resultType)}>{type}</Text>
      <Text numberOfLines={4} selectable style={themed($resultData)}>
        {data}
      </Text>

      <View style={themed($resultActions)}>
        {action ? (
          <Button
            LeftAccessory={({ style }) => (
              <MaterialIcons
                color={theme.colors.palette.neutral100}
                name={action.icon}
                size={20}
                style={style}
              />
            )}
            onPress={onActionPress}
            preset="reversed"
            style={themed($resultButton)}
            text={action.label}
          />
        ) : null}
        <Button onPress={onScanAgain} style={themed($resultButton)} text="Scan Again" />
      </View>
    </Animated.View>
  )
}

const $container: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  backgroundColor: "#050505",
})

const $stateContainer: ThemedStyle<ViewStyle> = (theme) => ({
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing.md,
  padding: theme.spacing.lg,
  backgroundColor: theme.colors.background,
})

const $stateTitle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 24,
  fontWeight: "700",
  textAlign: "center",
})

const $stateMessage: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.textDim,
  fontSize: 16,
  lineHeight: 22,
  textAlign: "center",
})

const $stateButton: ThemedStyle<ViewStyle> = () => ({
  minWidth: 180,
})

const $scrim: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0, 0, 0, 0.38)",
})

const $scannerFrame: ThemedStyle<ViewStyle> = () => ({
  width: SCANNER_SIZE,
  height: SCANNER_SIZE,
  borderRadius: 8,
  overflow: "hidden",
})

const $corner: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  width: 42,
  height: 42,
  borderColor: "#FFFFFF",
})

const $cornerTopLeft: ThemedStyle<ViewStyle> = () => ({
  top: 0,
  left: 0,
  borderTopWidth: 4,
  borderLeftWidth: 4,
})

const $cornerTopRight: ThemedStyle<ViewStyle> = () => ({
  top: 0,
  right: 0,
  borderTopWidth: 4,
  borderRightWidth: 4,
})

const $cornerBottomLeft: ThemedStyle<ViewStyle> = () => ({
  bottom: 0,
  left: 0,
  borderBottomWidth: 4,
  borderLeftWidth: 4,
})

const $cornerBottomRight: ThemedStyle<ViewStyle> = () => ({
  right: 0,
  bottom: 0,
  borderRightWidth: 4,
  borderBottomWidth: 4,
})

const $topBar: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing.sm,
  paddingHorizontal: theme.spacing.md,
})

const $iconButton: ThemedStyle<ViewStyle> = () => ({
  width: 48,
  minHeight: 48,
  borderRadius: 8,
  paddingHorizontal: 0,
})

const $titleBlock: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
})

const $cameraTitle: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  fontSize: 20,
  fontWeight: "700",
})

const $cameraSubtitle: ThemedStyle<TextStyle> = () => ({
  color: "rgba(255, 255, 255, 0.78)",
  fontSize: 14,
  lineHeight: 20,
})

const $errorPill: ThemedStyle<ViewStyle> = () => ({
  position: "absolute",
  left: 16,
  right: 16,
  borderRadius: 8,
  padding: 12,
  backgroundColor: "rgba(192, 52, 3, 0.92)",
})

const $errorText: ThemedStyle<TextStyle> = () => ({
  color: "#FFFFFF",
  fontSize: 14,
  textAlign: "center",
})

const $resultCard: ThemedStyle<ViewStyle> = (theme) => ({
  position: "absolute",
  left: 16,
  right: 16,
  padding: 16,
  borderRadius: 8,
  backgroundColor: theme.colors.surface,
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: theme.colors.border,
})

const $resultHeader: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  alignItems: "center",
  gap: theme.spacing.xs,
})

const $resultTitle: ThemedStyle<TextStyle> = (theme) => ({
  color: theme.colors.text,
  fontSize: 18,
  fontWeight: "700",
})

const $resultType: ThemedStyle<TextStyle> = (theme) => ({
  marginTop: theme.spacing.xs,
  color: theme.colors.textDim,
  fontSize: 12,
  textTransform: "uppercase",
})

const $resultData: ThemedStyle<TextStyle> = (theme) => ({
  marginTop: theme.spacing.xs,
  color: theme.colors.text,
  fontSize: 15,
  lineHeight: 21,
})

const $resultActions: ThemedStyle<ViewStyle> = (theme) => ({
  flexDirection: "row",
  gap: theme.spacing.sm,
  marginTop: theme.spacing.md,
})

const $resultButton: ThemedStyle<ViewStyle> = () => ({
  flex: 1,
  minHeight: 48,
})

const $scanLine: ViewStyle = {
  position: "absolute",
  left: 18,
  right: 18,
  height: 3,
  borderRadius: 2,
  backgroundColor: "#FFFFFF",
  shadowColor: "#FFFFFF",
  shadowOpacity: 0.8,
  shadowRadius: 8,
  elevation: 4,
}
