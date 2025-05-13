import {
  BackdropFilter,
  Blur,
  BlurMask,
  Canvas,
  center,
  convertToColumnMajor,
  Fill,
  Image,
  processTransform3d,
  rect,
  RoundedRect,
  rrect,
  RuntimeShader,
  SweepGradient,
  useImage,
  usePathValue,
  mix,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import {
  useDerivedValue,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated'
import { inflate } from '../utils/geometry'
import { frag } from '../utils/frag'
import { GradientBlurMask } from './gradient-blur-mask'
const { width, height } = Dimensions.get('window')

const rct = rrect(rect(20, height / 2 - 120, width - 40, 240), 20, 20)
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

const source = frag`
uniform shader image;
uniform mat4 matrix;

vec4 main(vec2 fragCoord) {
  vec4 proj = matrix * vec4(fragCoord, 0.0, 1.0);
  float r = 150.0;
  float p = (proj.z + r) / (2.0 * r);
  return mix(vec4(0.0, 1.0, 1.0, 1.0), vec4(1.0, 0.0, 1.0, 1.0), p);
}
`

export default function FrostedCard() {
  const image = useImage(require('@/assets/images/zurich.jpg'))
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

  const clip = usePathValue((path) => {
    'worklet'
    path.addRRect(rct)
    path.transform(
      processTransform3d([
        { translate: [cardCenter.x, cardCenter.y] },
        { perspective: 400 },
        { rotateX: rotateX.value },
        { rotateY: rotateY.value },
        { translate: [-cardCenter.x, -cardCenter.y] },
      ])
    )
  })

  const uniforms = useDerivedValue(() => {
    return {
      matrix: convertToColumnMajor(
        processTransform3d([
          { translate: [cardCenter.x, cardCenter.y] },
          { perspective: 400 },
          { rotateX: rotateX.value },
          { rotateY: rotateY.value },
          { translate: [-cardCenter.x, -cardCenter.y] },
        ])
      ),
    }
  })

  const matrix = useDerivedValue(() => {
    return processTransform3d([
      { translate: [cardCenter.x, cardCenter.y] },
      { perspective: 400 },
      { rotateX: rotateX.value },
      { rotateY: rotateY.value },
      { translate: [-cardCenter.x, -cardCenter.y] },
    ])
  })

  const transform = useDerivedValue(() => {
    return [
      { translate: [cardCenter.x, cardCenter.y] },
      { perspective: 400 },
      { rotateX: rotateX.value },
      { rotateY: rotateY.value },
      { translate: [-cardCenter.x, -cardCenter.y] },
    ]
  })

  if (!image) return null

  return (
    <GestureDetector gesture={panGesture}>
      <Canvas style={{ flex: 1 }}>
        <Image
          image={image}
          x={0}
          y={0}
          width={width}
          height={height}
          fit="cover"
        />
        <BackdropFilter
          filter={<GradientBlurMask matrix={matrix} />}
          clip={clip}
        >
          <Fill color={'rgba(0, 0, 0, 0.1)'} />
        </BackdropFilter>
        {/* <Fill />
        <RoundedRect rect={rrect(inflate(rct.rect, 2), 20, 20)}>
          <SweepGradient
            c={cardCenter}
            colors={['cyan', 'magenta', 'yellow', 'cyan']}
          />
          <BlurMask blur={10} style="solid" />
        </RoundedRect>
        <RoundedRect rect={rct} transform={transform} /> */}
      </Canvas>
    </GestureDetector>
  )
}
