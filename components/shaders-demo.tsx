import {
  Canvas,
  Fill,
  ImageShader,
  Paint,
  Shader,
  Skia,
  useImage,
} from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

const source = Skia.RuntimeEffect.Make(`
  uniform shader image;

  vec4 main(vec2 uv) {
    vec4 color = image.eval(uv).rbga;
    return color;
  }
  `)

export default function ShadersDemo() {
  const image = useImage(require('../assets/images/food.png'))

  if (!image) return null

  return (
    <Canvas style={{ flex: 1 }}>
      <Paint>
        <Shader source={source!}>
          <ImageShader
            image={image}
            fit="cover"
            rect={{ x: 0, y: 0, width, height }}
          />
        </Shader>
        <Fill />
      </Paint>
    </Canvas>
  )
}
