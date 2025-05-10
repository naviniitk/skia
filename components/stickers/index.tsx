import {
  Canvas,
  Image,
  Matrix4,
  useCanvasRef,
  useImage,
} from '@shopify/react-native-skia'

import { useSticker } from '@/providers/sticker-provider'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Dimensions, Pressable, Share, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import StickerGesture from './sticker-gesture'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
const { width, height } = Dimensions.get('window')

export default function Stickers() {
  const router = useRouter()
  const safeAreaInsets = useSafeAreaInsets()
  const { undoSticker } = useSticker()
  const ref = useCanvasRef()
  const { stickers } = useSticker()
  const image = useImage(require('@/assets/images/food.png'))

  if (!image) return null

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={() => router.push('/sticker-modal')}
        style={{
          position: 'absolute',
          top: 20 + safeAreaInsets.top,
          left: 20,
          zIndex: 1000,
          padding: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 10,
        }}
      >
        <MaterialCommunityIcons name="sticker-emoji" size={24} color="white" />
      </Pressable>
      <Pressable
        onPress={undoSticker}
        style={{
          position: 'absolute',
          top: 20 + safeAreaInsets.top,
          right: 20,
          zIndex: 1000,
          padding: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 10,
        }}
      >
        <Ionicons name="arrow-undo" size={24} color="white" />
      </Pressable>
      <Canvas ref={ref} style={{ flex: 1 }}>
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
        {stickers.map(({ Sticker, matrix }, index) => (
          <Sticker key={index} matrix={matrix} />
        ))}
      </Canvas>
      {stickers.map(({ matrix, size }, index) => (
        <StickerGesture
          key={index}
          matrix={matrix as SharedValue<Matrix4>}
          size={size}
        />
      ))}
      <Pressable
        onPress={async () => {
          const img = await ref.current?.makeImageSnapshotAsync()
          if (!img) return
          const base64 = img.encodeToBase64()
          Share.share({
            url: `data:image/png;base64,${base64}`,
          })
        }}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 30,
          zIndex: 1000,
          padding: 10,
        }}
      >
        <Ionicons name="share" size={24} color="white" />
      </Pressable>
    </View>
  )
}
