import {
  BlurMask,
  Canvas,
  Circle,
  DiscretePathEffect,
  Group,
  Oval,
  Paint,
  RadialGradient,
  SweepGradient,
  vec,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

const center = { x: width / 2, y: height / 2 }
const rct = {
  x: 25,
  y: height / 2 - width / 6,
  width: width - 50,
  height: width / 3,
}

export default function Shapes() {
  return (
    <Canvas style={{ flex: 1 }}>
      <Paint>
        <BlurMask blur={20} style="inner" />
        <Circle c={center} r={25} color="skyblue">
          <RadialGradient
            c={vec(center.x + 25, center.y)}
            r={50}
            colors={['blue', 'red', 'blue']}
          />
        </Circle>
      </Paint>

      <Paint>
        <BlurMask blur={20} style="inner" />
        <DiscretePathEffect deviation={5} length={10} />
        {/* <DashPathEffect intervals={[10, 10]} /> */}
        <Group color="skyblue" style="stroke" strokeWidth={18}>
          <Oval rect={rct} />
          <Group
            transform={[{ rotate: Math.PI / 3 }, { scale: -1 }]}
            origin={center}
          >
            <Oval rect={rct} />
          </Group>
          <Group
            transform={[{ rotate: -Math.PI / 3 }, { scale: -1 }]}
            origin={center}
          >
            <Oval rect={rct} />
          </Group>
          <SweepGradient c={center} colors={['blue', 'red', 'blue']} />
        </Group>
      </Paint>
    </Canvas>
  )
}
