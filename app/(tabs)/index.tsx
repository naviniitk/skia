import ImagePath from '@/components/image-path'
import { Pressable, Text, View } from 'react-native'
import Shapes from '@/components/shapes'
import ShadersDemo from '@/components/shaders-demo'
import AnimatedShapes from '../../components/animated-shapes'
import Hue from '../../components/hue'
import Glassmorphism from '../../components/glassmorphism'
import Neuromorphism from '../../components/neuromorphism'
import ColorFilters from '../../components/color-filters'
import Stickers from '../../components/stickers'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useSticker } from '@/providers/sticker-provider'
import AnimatedRings from '../../components/animated-ring'
import BlurGradientWrapper from '../../components/blur-gradient'
import Heartbeat from '../../components/heartbeat'
import FrostedCard from '../../components/frosted-card'
import MusicBottomSheet from '../../components/music-bottom-sheet'
import GradientClock from '../../components/gradient-clock'

export default function HomeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <GradientClock />
    </View>
  )
}
