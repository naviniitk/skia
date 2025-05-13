import {
  BlurMask,
  Canvas,
  center,
  Fill,
  rect,
  RoundedRect,
  rrect,
  SweepGradient,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { inflate } from '../utils/geometry'
const { width, height } = Dimensions.get('window')

const rct = rrect(rect(40, height / 2 - 100, width - 80, 200), 20, 20)
const sf = 1 / 300 // scale factor

const springConfig = (velocity: number) => {
  'worklet'
  return {
    mass: 1,
    damping: 4,
    stiffness: 200,
    overshootClamping: false,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 2,
    velocity,
  }
}

export default function FrostedCard() {
  const rotateX = useSharedValue(0)
  const rotateY = useSharedValue(0)

  const panGesture = Gesture.Pan()
    .onChange((e) => {
      rotateX.value -= e.changeY * sf
      rotateY.value += e.changeX * sf
    })
    .onEnd((e) => {
      rotateX.value = withSpring(0, springConfig(e.velocityY * sf))
      rotateY.value = withSpring(0, springConfig(e.velocityX * sf))
    })

  const cardCenter = center(rct.rect)

  const transform = useDerivedValue(() => {
    return [
      { translate: [cardCenter.x, cardCenter.y] },
      { perspective: 400 },
      { rotateX: rotateX.value },
      { rotateY: rotateY.value },
      { translate: [-cardCenter.x, -cardCenter.y] },
    ]
  })

  return (
    <GestureDetector gesture={panGesture}>
      <Canvas style={{ flex: 1 }}>
        <Fill />
        <RoundedRect rect={rrect(inflate(rct.rect, 2), 20, 20)}>
          <SweepGradient
            c={cardCenter}
            colors={['cyan', 'magenta', 'yellow', 'cyan']}
          />
          <BlurMask blur={10} style="solid" />
        </RoundedRect>
        <RoundedRect rect={rct} transform={transform} />
      </Canvas>
    </GestureDetector>
  )
}
