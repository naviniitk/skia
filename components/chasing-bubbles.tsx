import {
  Canvas,
  Circle,
  Group,
  mix,
  RadialGradient,
  vec,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  SharedValue,
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

const bubblesForHeight = Math.round(height / 30)
const row = 16
const bubbles = Array.from(Array(row * bubblesForHeight).keys())

export default function ChasingBubbles() {
  const cx = useSharedValue(-100)
  const cy = useSharedValue(-100)

  const panGesture = Gesture.Pan()
    .onEnd(() => {
      cx.value = -100
      cy.value = -100
    })
    .onBegin((event) => {
      cx.value = event.x
      cy.value = event.y
    })
    .onChange((event) => {
      cx.value = event.x
      cy.value = event.y
    })

  return (
    <GestureDetector gesture={panGesture}>
      <Canvas style={{ flex: 1 }}>
        <Group>
          {bubbles.map((index) => (
            <Bubble key={index} index={index} cx={cx} cy={cy} />
          ))}
          <RadialGradient
            c={vec(width / 2, height / 2)}
            r={height / 2}
            colors={['#FF0B55', '#FFDEDE', '#C5172E']}
          />
        </Group>
      </Canvas>
    </GestureDetector>
  )
}

type BubbleProps = {
  index: number
  cx: SharedValue<number>
  cy: SharedValue<number>
}

function Bubble({ index, cx, cy }: BubbleProps) {
  const currentRow = Math.floor(index / row) * bubblesForHeight
  const currentColumn = Math.floor(index % row) * bubblesForHeight + 30

  const radius = useDerivedValue(() => {
    const hypotenuse = Math.hypot(
      cx.value - currentColumn,
      cy.value - currentRow
    )
    // if (hypotenuse < 55 && cx.value !== -1) {
    //   return withSpring(12, { overshootClamping: true })
    // }

    return withSpring(mix(55 / (hypotenuse + 10), 4, 12), {
      overshootClamping: true,
    })
  }, [cx, cy])

  return <Circle cx={currentColumn} cy={currentRow} r={radius} />
}
