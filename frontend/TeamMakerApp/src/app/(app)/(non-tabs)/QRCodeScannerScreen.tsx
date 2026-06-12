import { useRouter } from "expo-router"

import { QRCodeScanner } from "@/components/ui/QRCodeScanner"

export default function QRCodeScannerScreen() {
  const router = useRouter()

  return <QRCodeScanner onClose={() => router.back()} />
}
