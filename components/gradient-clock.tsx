import { Canvas, Rect, SweepGradient, vec } from '@shopify/react-native-skia'
import { useEffect } from 'react'
import { Dimensions } from 'react-native'
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

export default function GradientClock() {
  const time = useSharedValue(0)

  const transform = useDerivedValue(() => {
    return [
      { translateX: width / 2 },
      { translateY: height / 2 },
      { rotate: time.value },
      { translateX: -width / 2 },
      { translateY: -height / 2 },
    ]
  }, [time])

  useEffect(() => {
    time.value = withRepeat(
      withTiming(2 * Math.PI, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    )
  }, [time])

  return (
    <Canvas style={{ flex: 1 }}>
      <Rect x={0} y={0} width={width} height={height}>
        <SweepGradient
          colors={['#000000', '#FFFFFF']}
          c={vec(width / 2, height / 2)}
          start={0}
          end={360}
          transform={transform}
        />
      </Rect>
    </Canvas>
  )
}
