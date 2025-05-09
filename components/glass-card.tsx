import {
  Canvas,
  LinearGradient,
  Paint,
  rect,
  Rect,
  RoundedRect,
  rrect,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const rct = rrect(rect(0, 0, width - 32, width / 2), 16, 16)

export default function GlassCard() {
  return (
    <Canvas style={{ flex: 1 }}>
      <Paint>
        <LinearGradient
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          colors={['#5DA7D2ee', '#B848D9ee']}
        />
        <RoundedRect rect={rct} color="white" />
      </Paint>
    </Canvas>
  )
}
