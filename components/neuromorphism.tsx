import {
  Canvas,
  Fill,
  Paint,
  Blur,
  FitBox,
  rect,
  rrect,
  RoundedRect,
  Group,
  Shadow,
  Box,
  BoxShadow,
  mix,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
import {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  SharedValue,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated'
const { width, height } = Dimensions.get('window')

const PADDING = 32
const SIZE = width - PADDING * 2
const x = PADDING
const y = 75

export default function Neuromorphism() {
  const pressed = useSharedValue(0)

  const onTouchStart = () => {
    pressed.value = withTiming(1, { duration: 150 })
  }

  const onTouchEnd = () => {
    pressed.value = withTiming(0, { duration: 100 })
  }

  return (
    <Canvas
      style={{ flex: 1 }}
      onTouchStart={onTouchStart}
      // onTouchEnd={onTouchEnd}
    >
      <Fill color="#F0F0F3" />
      <NeuroButton x={x} y={y} size={SIZE} pressed={pressed} />
    </Canvas>
  )
}

const src = rect(0, 0, 24, 24)
const border = rrect(src, 5, 5)
const container = rrect(rect(1, 1, 22, 22), 5, 5)

type NeuroButtonProps = {
  x: number
  y: number
  size: number
  pressed: SharedValue<number>
}

function NeuroButton({ x, y, size, pressed }: NeuroButtonProps) {
  const c1 = useDerivedValue(() => {
    return `rgba(255, 255, 255, ${mix(pressed.value, 0, 0.7)})`
  }, [pressed])

  const c2 = useDerivedValue(() => {
    return `rgba(174, 174, 192, ${mix(pressed.value, 0, 0.4)})`
  }, [pressed])

  return (
    <FitBox src={src} dst={rect(x, y, size, size)}>
      {/* <Group>
        <Paint>
          <Shadow blur={3} dx={-1} dy={-1} color="white" />
          <Shadow
            blur={3}
            dx={1}
            dy={1}
            color="rgba(174, 174, 192, 0.4)"
            shadowOnly
          />
        </Paint>
        <RoundedRect rect={border} color="#F0F0F3" />
      </Group> */}
      <Box box={border} color="#F0F0F3">
        <BoxShadow blur={3} dx={-1} dy={-1} color="white" />
        <BoxShadow blur={3} dx={1} dy={1} color="rgba(174, 174, 192, 0.4)" />
      </Box>
      {/* <Group>
        <Paint>
          <Shadow
            blur={1}
            dx={-1}
            dy={-1}
            color="rgba(255, 255, 255, 0.7)"
            inner
            shadowOnly
          />
          <Shadow
            blur={3}
            dx={1.5}
            dy={1.5}
            color="rgba(174, 174, 192, 0.2)"
            inner
            shadowOnly
          />
        </Paint>
        <RoundedRect rect={container} color="#F0F0F3" />
      </Group> */}
      <Box box={container} color="#F0F0F3">
        <BoxShadow blur={1} dx={-1} dy={-1} color={c1} inner />
        <BoxShadow blur={3} dx={1.5} dy={1.5} color={c2} inner />
      </Box>
    </FitBox>
  )
}
