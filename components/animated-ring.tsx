import { frag } from '@/utils/frag'
import {
  Canvas,
  Circle,
  Fill,
  Group,
  Path,
  PathOp,
  Shader,
  Shadow,
  Skia,
  SweepGradient,
  Vector
} from '@shopify/react-native-skia'
import { useEffect, useMemo } from 'react'
import { Dimensions } from 'react-native'
import {
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')
const center = { x: width / 2, y: height / 2 }

const source = frag`
  uniform shader image;
  uniform vec2 head;
  uniform float progress;
  uniform vec4 color;
  uniform float r;

  vec2 rotate(in vec2 coord, in float angle, vec2 origin) {
    vec2 coord1 = coord - origin;
    vec2 rotated = coord1 * mat2( cos(angle), -sin(angle),
                        sin(angle),  cos(angle));
    return rotated + origin;
  }

  vec4 main(vec2 xy) {
    float d = distance(xy, head);
    vec2 rotated = rotate(xy, ${-Math.PI} - progress * ${2 * Math.PI}, head);
    if (rotated.y > head.y) {
      return vec4(0, 0, 0, 0);
    }
    if (d > r) {
      return vec4(0, 0, 0, smoothstep(35, 0, d));
    }
    if (progress > 1) {
      return color;
    }
    return image.eval(head);
  }
`

export default function AnimatedRings() {
  const totalProgress = 2.3
  return (
    <Canvas style={{ flex: 1 }}>
      <Ring
        totalProgress={totalProgress}
        c={center}
        r={width / 2 - 32}
        strokeWidth={40}
        colors={['#FF69B4', '#FFB6C1']}
        backgroundColor="#1A0109"
      />
      <Ring
        totalProgress={0.7}
        c={center}
        r={width / 2 - 72}
        strokeWidth={40}
        colors={['#FF91A0', '#FF1C42']}
        backgroundColor="#2D0614"
      />
      <Ring
        totalProgress={1.4}
        c={center}
        r={width / 2 - 112}
        strokeWidth={40}
        colors={['#722F37', '#C1272D']}
        backgroundColor="#222831"
      />
    </Canvas>
  )
}

type RingProps = {
  totalProgress: number
  c: Vector
  r: number
  strokeWidth: number
  colors: string[]
  backgroundColor: string
}

function fromCircle(c: Vector, r: number) {
  'worklet'
  return Skia.XYWHRect(c.x - r, c.y - r, r * 2, r * 2)
}

function Ring({
  totalProgress,
  c,
  r,
  strokeWidth,
  colors,
  backgroundColor,
}: RingProps) {
  const trim = useSharedValue(0)

  const clip = useMemo(() => {
    const outerCircle = Skia.Path.Make()
    outerCircle.addCircle(c.x, c.y, r + strokeWidth / 2)

    const innerCircle = Skia.Path.Make()
    innerCircle.addCircle(c.x, c.y, r - strokeWidth / 2)

    return Skia.Path.MakeFromOp(outerCircle, innerCircle, PathOp.Difference)!
  }, [c, r, strokeWidth])

  const fullPath = useMemo(() => {
    const path = Skia.Path.Make()
    const fullRevolutions = Math.floor(totalProgress)

    for (let i = 0; i < fullRevolutions; i++) {
      path.addCircle(c.x, c.y, r)
    }

    path.addArc(fromCircle(c, r), 0, 360 * (totalProgress % 1))

    return path
  }, [c, r, totalProgress])

  const animatedPath = useDerivedValue(() => {
    if (trim.value < 1) {
      return fullPath.copy().trim(0, trim.value, false)!
    }
    return fullPath
  }, [trim, fullPath])

  const endPoint = useDerivedValue(() => {
    return animatedPath.value.getLastPt()
  }, [animatedPath])

  const endPointClip = useDerivedValue(() => {
    const lastPoint = animatedPath.value.getLastPt()
    const path = Skia.Path.Make()
    path.addRect(
      Skia.XYWHRect(
        lastPoint.x - strokeWidth,
        lastPoint.y,
        strokeWidth * 2,
        strokeWidth * 2
      )
    )
    const m = Skia.Matrix()
    const progress = trim.value * totalProgress
    const angle = (progress % 1) * Math.PI * 2

    m.translate(lastPoint.x, lastPoint.y)
    m.rotate(angle)
    m.translate(-lastPoint.x, -lastPoint.y)
    return path.transform(m)
  }, [c, r, strokeWidth, trim, totalProgress])

  const matrix = useDerivedValue(() => {
    const m = Skia.Matrix()
    const progress = trim.value * totalProgress
    const angle = progress < 1 ? 0 : (progress % 1) * Math.PI * 2

    if (angle > 0) {
      m.translate(c.x, c.y)
      m.rotate(angle)
      m.translate(-c.x, -c.y)
    }
    return m
  }, [trim, totalProgress])

  const uniforms = useDerivedValue(() => {
    const head = animatedPath.value.getLastPt()
    return {
      head,
      r: strokeWidth / 2,
      progress: trim.value * totalProgress,
      color: [...Skia.Color(colors[1])],
    }
  })

  useEffect(() => {
    trim.value = withTiming(1, { duration: 3000 })
  }, [totalProgress, trim])

  return (
    <Group transform={[{ rotate: -Math.PI / 2 }]} origin={c}>
      <Group clip={clip}>
        <Fill color={backgroundColor} />
        <Circle
          c={fullPath.getPoint(0)}
          r={strokeWidth / 2}
          color={colors[0]}
        />

        <Path
          path={animatedPath}
          strokeWidth={strokeWidth}
          style="stroke"
          color={colors[1]}
        >
          <SweepGradient c={c} colors={colors} matrix={matrix} />
        </Path>
        <Circle
          c={endPoint}
          r={strokeWidth / 2}
          color={colors[1]}
          clip={endPointClip}
        >
          <Shader source={source} uniforms={uniforms}>
            <SweepGradient c={c} colors={colors} matrix={matrix} />
          </Shader>
          <Shadow color="#000" blur={10} dx={0} dy={0} />
        </Circle>
      </Group>
    </Group>
  )
}
