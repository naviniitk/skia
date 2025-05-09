import ImagePath from '@/components/image-path'
import { View } from 'react-native'
import Shapes from '@/components/shapes'
import ShadersDemo from '@/components/shaders-demo'
import AnimatedShapes from '../../components/animated-shapes'
import Hue from '../../components/hue'
import Glassmorphism from '../../components/glassmorphism'
import Neuromorphism from '../../components/neuromorphism'

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <Neuromorphism />
    </View>
  )
}
