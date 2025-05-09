import {
  BackdropBlur,
  Blur,
  Canvas,
  Circle,
  Fill,
  Group,
  LinearGradient,
  Paint,
  vec,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const c = vec(width / 2, height / 2)
const r = c.x - 32

const rect = { x: 0, y: c.y, width, height: c.y }

export default function Glassmorphism() {
  return (
    <Canvas style={{ flex: 1 }}>
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
        </Group>
        <BackdropBlur blur={20} clip={rect} />
      </Paint>
    </Canvas>
  )
}
