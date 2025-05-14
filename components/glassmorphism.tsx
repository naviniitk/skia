import {
  BackdropBlur,
  BackdropFilter,
  Blur,
  Canvas,
  Circle,
  ColorMatrix,
  DisplacementMap,
  Fill,
  Group,
  LinearGradient,
  Paint,
  Turbulence,
  vec,
} from '@shopify/react-native-skia'
import { Dimensions, GestureResponderEvent } from 'react-native'
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
const { width, height } = Dimensions.get('window')

const c = vec(width / 2, height / 2)
const r = c.x - 32

const rect = { x: 0, y: c.y, width, height: c.y }

const BLACK_AND_WHITE = [
  0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
]

const GRAYSCALE = [
  0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0, 0, 0.299, 0.587, 0.114, 0,
  0, 0, 0, 0, 1, 0,
]

const NEGATIVE = [
  -1, 0, 0, 0, 1, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 1, 0,
]

const SEPIA = [
  0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131, 0,
  0, 0, 0, 0, 1, 0,
]

const SHARPEN = [
  1.2, 0, 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 0, 1.2, 0, 0, 0, 0, 0, 1, 0,
]

const springConfig = (velocity: number) => {
  'worklet'
  return {
    mass: 1,
    damping: 4,
    stiffness: 200,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
    velocity,
  }
}

export default function Glassmorphism() {
  const translateY = useSharedValue(c.y)
  let lastY = 0

  const onTouchStart = (e: GestureResponderEvent) => {
    lastY = e.nativeEvent.locationY
  }

  const onTouchMove = (e: GestureResponderEvent) => {
    translateY.value += e.nativeEvent.locationY - lastY
    lastY = e.nativeEvent.locationY
  }

  const onTouchEnd = () => {
    translateY.value = withSpring(c.y, springConfig(6))
    lastY = 0
  }

  const animatedRect = useDerivedValue(() => {
    return {
      x: 0,
      y: translateY.value,
      width,
      height: height,
    }
  }, [translateY])

  return (
    <Canvas
      style={{ flex: 1 }}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Fill color="black" />
      <Paint>
        <Group>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: width, y: 1 }}
            colors={['#FFF723', '#E70696']}
          />
          <Circle c={c} r={r} />
          {/* <Blur blur={10} /> */}
          {/* <Turbulence seed={10} freqX={0.001} freqY={0.001} octaves={4} /> */}
        </Group>
        <BackdropBlur blur={20} clip={animatedRect} />
        {/* <BackdropFilter
          filter={<ColorMatrix matrix={SHARPEN} />}
          clip={animatedRect}
        /> */}
        <BackdropFilter
          filter={
            <DisplacementMap channelX="a" channelY="r" scale={50}>
              <Turbulence freqX={0.005} freqY={0.09} octaves={2} />
            </DisplacementMap>
          }
          clip={animatedRect}
        />
      </Paint>
    </Canvas>
  )
}
