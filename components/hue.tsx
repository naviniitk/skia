import {
  BlurMask,
  Canvas,
  canvas2Polar,
  Circle,
  Fill,
  Paint,
  polar2Canvas,
  Shader,
  Skia,
  vec,
} from '@shopify/react-native-skia'
import { useCallback } from 'react'
import { Dimensions, GestureResponderEvent } from 'react-native'
import { useDerivedValue, useSharedValue } from 'react-native-reanimated'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

const c = { x: width / 2, y: height / 2 }
const r = (width - 32) / 2

const source = Skia.RuntimeEffect.Make(`
//   #define PI  3.141592653589793
// #define TAU 6.283185307179586


 vec2 uv;
 uniform float cx;
 uniform float cy;
 uniform float r;


// https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float quadraticIn(float t) {
  return t * t;
}

float normalizeRad(float angle) {
  return mod(angle + 3.141592653589793, 3.141592653589793 * 2.0) - 3.141592653589793;
}

vec2 canvasToPolar(vec2 uv, vec2 c) {
  return vec2(atan(uv.y - c.y, uv.x - c.x), length(uv - c));
}

half4 main(vec2 uv) {
  float2 c = vec2(cx, cy);
  float mag = distance(uv, c);
  // vec2 pos = vec2(0.5) - uv;
  // float a = atan(pos.y, pos.x);
  // float progress = a * 0.5 / 3.141592653589793 + 0.5;
  float theta = normalizeRad(canvasToPolar(uv, c).x);
  return vec4(hsv2rgb(vec3(theta / 3.141592653589793, quadraticIn(mag / r), 1.0)), 1.0);
}
  `)

function polar2Color(radius: number, angle: number): number {
  // Ensure radius and angle are within valid ranges
  radius = Math.min(Math.max(radius, 0), 1)
  angle = angle % (2 * Math.PI)

  const hue = angle * (360 / (2 * Math.PI))
  const saturation = radius * 100
  const lightness = 50

  // Convert HSL to RGB
  const { r, g, b } = hslToRgb(hue, saturation, lightness)

  // Convert RGB to hexadecimal color string
  const hexColor = rgbToHex(r, g, b)

  return parseInt('0xff' + hexColor.slice(1))
}

function hslToRgb(
  hue: number,
  saturation: number,
  lightness: number
): { r: number; g: number; b: number } {
  // Must be fractions of 1
  saturation /= 100
  lightness /= 100

  const k = (n: number) => (n + hue / 30) % 12
  const a = saturation * Math.min(lightness, 1 - lightness)
  const f = (n: number) =>
    lightness - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))

  return {
    r: Math.round(255 * f(0)),
    g: Math.round(255 * f(8)),
    b: Math.round(255 * f(4)),
  }
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
}

export default function Hue() {
  const progress = useSharedValue(0)

  // useEffect(() => {
  //   progress.value = withRepeat(withTiming(1, { duration: 3000 }), -1, true)
  // }, [])

  const transform = useDerivedValue(() => {
    return [{ rotate: progress.value * 3.141592653589793 * 2 }]
  })

  const translateX = useSharedValue(c.x)
  const translateY = useSharedValue(c.y)
  const color = useSharedValue(0xffff0000)

  const onTouchMove = useCallback(
    (e: GestureResponderEvent) => {
      const polar = canvas2Polar(
        vec(e.nativeEvent.locationX, e.nativeEvent.locationY),
        c
      )
      const { x, y } = polar2Canvas(
        { theta: polar.theta, radius: Math.min(polar.radius, r) },
        c
      )
      translateX.value = x
      translateY.value = y
      color.value = polar2Color(polar.radius, polar.theta)
    },
    [translateX, translateY, color]
  )

  const center = useDerivedValue(() => {
    return vec(translateX.value, translateY.value)
  })

  return (
    <Canvas style={{ flex: 1 }} onTouchMove={onTouchMove}>
      <Fill color={color} />
      <Paint>
        <BlurMask blur={10} style="solid" />
        <Shader source={source!} uniforms={{ cx: c.x, cy: c.y, r: r }} />
        <Circle c={c} r={r} transform={transform} origin={c} />
        <Circle c={center} r={20} color="red" />
      </Paint>
    </Canvas>
  )
}
