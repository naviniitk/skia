import {
  Blur,
  Canvas,
  center,
  Fill,
  fitbox,
  Group,
  mix,
  Path,
  rect,
  Skia,
} from '@shopify/react-native-skia'
import { useEffect, useRef } from 'react'
import { Dimensions } from 'react-native'
import {
  Easing,
  SharedValue,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated'
import { useLoop, useSharedValues } from '../utils/animations'

const heart = Skia.Path.MakeFromSVGString(
  'M 32 60 C -29.2 19.6 13.2 -12 31.2 4.4 C 31.6 4.8 31.6 5.2 32 5.2 A 12.4 12.4 90 0 1 32.8 4.4 C 50.8 -12 93.2 19.6 32 60 Z'
)!
const { width, height } = Dimensions.get('window')
const c = { x: width / 2, y: height / 2 }
const src = heart.computeTightBounds()
const pad = 64
const dst = rect(pad, pad, width - 2 * pad, height - pad * 2)

const c1 = '#D52327'
const c2 = '#3F0A0B'
const bpm = 44
const duration = (60 * 1000) / bpm

const beatEasing = (x: number): number => {
  'worklet'
  const c4 = (2 * Math.PI) / 3
  if (x === 0) {
    return 0
  }
  if (x === 1) {
    return 1
  }
  return -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4)
}

export default function Heartbeat() {
  const count = useRef(0)
  const progress = useLoop({ duration: duration / 2 })
  const values = useSharedValues(1, 1, 1)
  const valueCount = values.length

  const transform = useDerivedValue(() => {
    return [
      {
        scale: mix(beatEasing(progress.value), 1.1, 1),
      },
    ]
  })

  useEffect(() => {
    const it = setInterval(() => {
      const val = values[count.current]
      val.value = 0
      val.value = withTiming(1, {
        duration: duration * 3,
        easing: Easing.linear,
      })
      count.current = (count.current + 1) % valueCount
    }, duration)
    return () => {
      clearInterval(it)
    }
  }, [values])

  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="black" />

      {values.map((value, i) => (
        <Beat key={i} progress={value} i={i} />
      ))}
      <Group transform={transform} origin={c}>
        <Group transform={fitbox('contain', src, dst)}>
          <Path path={heart} color={c1} />
          <Group transform={[{ scale: 0.9 }]} origin={center(src)}>
            <Path path={heart} color={c2} />
            <Blur blur={8} mode="clamp" />
          </Group>
        </Group>
      </Group>
    </Canvas>
  )
}

function Beat({ progress, i }: { progress: SharedValue<number>; i: number }) {
  const transform = useDerivedValue(() => {
    return [
      {
        scale: mix(progress.value, 1, 3),
      },
    ]
  }, [])

  const opacity = useDerivedValue(() => {
    return mix(progress.value, 1, 0)
  }, [])

  const blur = useDerivedValue(() => {
    return mix(progress.value, 1, 8)
  }, [])

  return (
    <Group transform={transform} origin={c} opacity={opacity}>
      <Group transform={fitbox('contain', src, dst)}>
        <Path path={heart} color={c1} style="stroke" strokeWidth={2}>
          <Blur blur={blur} />
        </Path>
      </Group>
    </Group>
  )
}
