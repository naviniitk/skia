import { Dimensions, Pressable, ScrollView, View } from 'react-native'
import { stickersList } from '@/components/stickers/lib'
import {
  Skia,
  Group,
  Canvas,
  rect,
  fitbox,
  processTransform3d,
  SkSize,
} from '@shopify/react-native-skia'
import { deflate } from '@/utils/geometry'
import { useSticker } from '@/providers/sticker-provider'
import { useRouter } from 'expo-router'
import { useCallback, FC } from 'react'
import { StickerProps } from '@/typings/sticker'
import { makeMutable } from 'react-native-reanimated'

const window = Dimensions.get('window')
const COLS = 2
const tileWidth = window.width / COLS
const tileHeight = 125

export default function StickerModal() {
  const { addSticker } = useSticker()
  const router = useRouter()

  const onPress = useCallback(
    (Sticker: FC<StickerProps>, size: SkSize) => {
      const src = rect(0, 0, size.width, size.height)
      const dst = deflate(rect(0, 0, window.width, window.height), 24)
      const m4 = processTransform3d(fitbox('contain', src, dst))
      const matrix = makeMutable(m4)
      addSticker({
        Sticker,
        size,
        matrix,
      })
      router.back()
    },
    [addSticker, router]
  )

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      collapsable={false}
    >
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {stickersList.map(({ Sticker, size }, index) => {
          const { width, height } = size
          const src = rect(0, 0, width, height)
          const dst = deflate(rect(0, 0, tileWidth, tileHeight), 12)
          const transform = fitbox('contain', src, dst)
          return (
          <Pressable key={index} onPress={onPress.bind(null, Sticker, size)}>
            <Canvas style={{ width: tileWidth, height: tileHeight }}>
              <Group transform={transform}>
                <Sticker matrix={Skia.Matrix()} />
              </Group>
            </Canvas>
            </Pressable>
          )
        })}
        {stickersList.map(({ Sticker, size }, index) => {
          const { width, height } = size
          const src = rect(0, 0, width, height)
          const dst = deflate(rect(0, 0, tileWidth, tileHeight), 12)
          const transform = fitbox('contain', src, dst)
          return (
          <Pressable key={index} onPress={onPress.bind(null, Sticker, size)}>
            <Canvas style={{ width: tileWidth, height: tileHeight }}>
              <Group transform={transform}>
                <Sticker matrix={Skia.Matrix()} />
              </Group>
            </Canvas>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}
