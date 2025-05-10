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

export default function HomeScreen() {
  const router = useRouter()
  const safeAreaInsets = useSafeAreaInsets()
  const { undoSticker } = useSticker()

  return (
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={() => router.push('/sticker-modal')}
        style={{
          position: 'absolute',
          top: 20 + safeAreaInsets.top,
          left: 20,
          zIndex: 1000,
          padding: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 10,
        }}
      >
        <MaterialCommunityIcons name="sticker-emoji" size={24} color="white" />
      </Pressable>
      <Pressable
        onPress={undoSticker}
        style={{
          position: 'absolute',
          top: 20 + safeAreaInsets.top,
          right: 20,
          zIndex: 1000,
          padding: 10,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: 10,
        }}
      >
        <Ionicons name="arrow-undo" size={24} color="white" />
      </Pressable>
      <Stickers />
    </View>
  )
}
