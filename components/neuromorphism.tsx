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
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')

const PADDING = 32
const SIZE = width - PADDING * 2
const x = PADDING
const y = 75

export default function Neuromorphism() {
  return (
    <Canvas style={{ flex: 1 }}>
      <Fill color="#F0F0F3" />
      <NeuroButton x={x} y={y} size={SIZE} />
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
}

function NeuroButton({ x, y, size }: NeuroButtonProps) {
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
        <BoxShadow
          blur={1}
          dx={-1}
          dy={-1}
          color="rgba(255, 255, 255, 0.7)"
          inner
        />
        <BoxShadow
          blur={3}
          dx={1.5}
          dy={1.5}
          color="rgba(174, 174, 192, 0.2)"
          inner
        />
      </Box>
    </FitBox>
  )
}
