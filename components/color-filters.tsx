import {
  BlendColor,
  Canvas,
  Circle,
  ColorMatrix,
  Group,
  Image,
  Lerp,
  SRGBToLinearGamma,
  useImage,
  vec,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const { width, height } = Dimensions.get('window')
const c = vec(width / 2, height / 2)
const r = 100

export default function ColorFilters() {
  const image = useImage(require('../assets/images/food.png'))

  const blackAndWhite = [
    0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0,
  ]
  const purple = [
    1, -0.2, 0, 0, 0, 0, 1, 0, -0.1, 0, 0, 1.2, 1, 0.1, 0, 0, 0, 1.7, 1, 0,
  ]
  return (
    <Canvas style={{ flex: 1 }}>
      <Image x={0} y={0} width={width} height={height} image={image} fit="cover">
        <Lerp t={0.5}>
          <ColorMatrix matrix={purple} />
          <ColorMatrix matrix={blackAndWhite} />
        </Lerp>
      </Image>
      {/* <Group>
        <SRGBToLinearGamma>
          <BlendColor color="lightblue" mode="srcIn" />
        </SRGBToLinearGamma>
        <Circle c={c} r={r} />
      </Group> */}
    </Canvas>
  )
}
