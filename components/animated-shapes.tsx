import {
  BlurMask,
  Canvas,
  Circle,
  Group,
  Paint,
  Path,
  RadialGradient,
  Skia,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia'
import { useEffect } from 'react'
import { Dimensions } from 'react-native'
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

const center = { x: width / 2, y: height / 2 }
const rct = {
  x: 25,
  y: height / 2 - width / 6,
  width: width - 50,
  height: width / 3,
}

const oval = Skia.Path.Make()
oval.addOval(rct)

export default function AnimatedShapes() {
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withTiming(Math.PI / 3, { duration: 3000 })
  }, [])

  const animatedTransform = useDerivedValue(() => [
    { rotate: progress.value },
    { scale: -1 },
  ])

  const animatedTransformNegative = useDerivedValue(() => [
    { rotate: -progress.value },
    { scale: -1 },
  ])

  const animatedPath = useDerivedValue(() => {
    return (progress.value * 3) / Math.PI
  })

  return (
    <Canvas style={{ flex: 1 }}>
      <Paint>
        <BlurMask blur={5} style="inner" />
        <Circle c={center} r={25} color="skyblue">
          <RadialGradient
            c={vec(center.x + 25, center.y)}
            r={50}
            colors={['skyblue', 'lightblue', 'skyblue']}
          />
        </Circle>
      </Paint>

      <Paint>
        <BlurMask blur={5} style="inner" />
        {/* <DiscretePathEffect deviation={5} length={10} /> */}
        {/* <DashPathEffect intervals={[10, 10]} /> */}
        <Group color="skyblue" style="stroke" strokeWidth={18}>
          <Path path={oval} end={animatedPath} />
          <Group transform={animatedTransform} origin={center}>
            <Path path={oval} end={animatedPath} />
          </Group>
          <Group transform={animatedTransformNegative} origin={center}>
            <Path path={oval} end={animatedPath} />
          </Group>
          <SweepGradient
            c={center}
            colors={['skyblue', 'lavender', 'skyblue']}
          />
        </Group>
      </Paint>
    </Canvas>
  )
}
