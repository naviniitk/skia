import {
  convertToAffineMatrix,
  convertToColumnMajor,
  Matrix4,
  multiply4,
  rotateZ,
  scale,
  SkSize,
  translate,
} from '@shopify/react-native-skia'
import { Platform } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated'

const multiply = (...matrices: Matrix4[]) => {
  'worklet'
  return matrices.reduce((acc, matrix) => multiply4(acc, matrix), Matrix4())
}

type StickerGestureProps = {
  matrix: SharedValue<Matrix4>
  size: SkSize
}

export default function StickerGesture({ matrix, size }: StickerGestureProps) {
  const origin = useSharedValue({ x: 0, y: 0 })
  const offset = useSharedValue(Matrix4())
  const prevTranslationX = useSharedValue(0)
  const prevTranslationY = useSharedValue(0)

  const pan = Gesture.Pan().onUpdate((event) => {
    matrix.value = multiply4(
      translate(
        event.translationX - prevTranslationX.value,
        event.translationY - prevTranslationY.value
      ),
      matrix.value
    )
    prevTranslationX.value = event.translationX
    prevTranslationY.value = event.translationY
  })

  const pinch = Gesture.Pinch()
    .onBegin((e) => {
      origin.value = { x: e.focalX, y: e.focalY }
      offset.value = matrix.value
    })
    .onChange((e) => {
      matrix.value = multiply4(
        offset.value,
        scale(e.scale, e.scale, 1, origin.value)
      )
    })

  const rotate = Gesture.Rotation()
    .onBegin((e) => {
      origin.value = { x: e.anchorX, y: e.anchorY }
      offset.value = matrix.value
    })
    .onChange((e) => {
      matrix.value = multiply4(offset.value, rotateZ(e.rotation, origin.value))
    })

  const gesture = Gesture.Race(pan, Gesture.Simultaneous(pinch, rotate))

  const animatedStyle = useAnimatedStyle(() => {
    const m = multiply(
      translate(-size.width / 2, -size.height / 2),
      matrix.value,
      translate(size.width / 2, size.height / 2)
    )
    const m4 = convertToColumnMajor(m)
    return {
      position: 'absolute',
      width: size.width,
      height: size.height,
      top: 0,
      left: 0,
      transform: [
        {
          matrix:
            Platform.OS === 'web'
              ? convertToAffineMatrix(m4)
              : (m4 as unknown as number[]),
        },
      ],
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[animatedStyle]}></Animated.View>
    </GestureDetector>
  )
}
