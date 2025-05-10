import {
  Canvas,
  Image,
  Matrix4,
  useCanvasRef,
  useImage,
} from '@shopify/react-native-skia'

import { useSticker } from '@/providers/sticker-provider'
import { Ionicons } from '@expo/vector-icons'
import { Dimensions, Pressable, Share, View } from 'react-native'
import { SharedValue } from 'react-native-reanimated'
import StickerGesture from './sticker-gesture'
const { width, height } = Dimensions.get('window')

export default function Stickers() {
  const ref = useCanvasRef()
  const { stickers } = useSticker()
  const image = useImage(require('@/assets/images/food.png'))

  if (!image) return null

  return (
    <View style={{ flex: 1 }}>
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
