import { Canvas, Group, Image, useImage } from '@shopify/react-native-skia'
import { Dimensions } from 'react-native'

const width = Dimensions.get('screen').width
const height = Dimensions.get('screen').height

export default function ImagePath() {
  const image = useImage(require('../assets/images/food.png'))
  return (
    <Canvas style={{ flex: 1 }}>
      <Group
        clip={
          'M200,20 L244,180 L400,180 L272,260 L316,420 L200,320 L84,420 L128,260 L0,180 L156,180 Z'
        }
        invertClip
      >
        {/* <Path path="M 0 0 L 400 0 L 400 300 L 0 300 Z" /> */}
        <Image
          image={image}
          width={width}
          height={height}
          fit="cover"
          x={0}
          y={0}
        />
      </Group>
    </Canvas>
  )
}
