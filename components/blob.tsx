import { Canvas, center, Group, Path, Skia } from '@shopify/react-native-skia'
import { useEffect } from 'react'
import { Dimensions } from 'react-native'
import {
  interpolateColor,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

const { width, height } = Dimensions.get('window')

const path1 =
  'M182.9 -184.9C224.4 -141.4 236.7 -70.7 224.7 -12C212.7 46.7 176.3 93.3 134.8 123.2C93.3 153 46.7 166 -10.3 176.3C-67.2 186.5 -134.4 194 -170.2 164.2C-206 134.4 -210.5 67.2 -194.6 15.9C-178.7 -35.4 -142.4 -70.7 -106.5 -114.2C-70.7 -157.7 -35.4 -209.4 17.7 -227C70.7 -244.7 141.4 -228.4 182.9 -184.9'

const path2 =
  'M132.2 -141.7C162.5 -101.8 172.2 -50.9 167.5 -4.7C162.8 41.5 143.6 83 113.3 120.5C83 158 41.5 191.5 -7.7 199.1C-56.8 206.8 -113.6 188.6 -163.6 151.1C-213.6 113.6 -256.8 56.8 -246.1 10.7C-235.4 -35.4 -170.7 -70.7 -120.7 -110.5C-70.7 -150.4 -35.4 -194.7 7.8 -202.5C50.9 -210.2 101.8 -181.5 132.2 -141.7'

const path3 =
  'M157.2 -148.5C190.8 -123.5 196.4 -61.8 200.3 3.9C204.2 69.5 206.4 139.1 172.7 180.4C139.1 221.7 69.5 234.9 6.4 228.5C-56.8 222.1 -113.6 196.3 -144.8 154.9C-175.9 113.6 -181.5 56.8 -188.4 -7C-195.4 -70.7 -203.8 -141.4 -172.6 -166.4C-141.4 -191.4 -70.7 -170.7 -4.5 -166.2C61.8 -161.8 123.5 -173.5 157.2 -148.5'

const path4 =
  'M184.4 -163.7C234.4 -134.4 267.2 -67.2 253.6 -13.6C240.1 40.1 180.1 80.1 130.1 116.5C80.1 152.8 40.1 185.4 2.4 183C-35.4 180.7 -70.7 143.4 -98.5 107C-126.4 70.7 -146.7 35.4 -156.9 -10.3C-167.2 -55.9 -167.4 -111.7 -139.6 -141.1C-111.7 -170.4 -55.9 -173.2 5.7 -178.9C67.2 -184.5 134.4 -193 184.4 -163.7'

const blob1 = Skia.Path.MakeFromSVGString(path1)!
const blob2 = Skia.Path.MakeFromSVGString(path2)!
const blob3 = Skia.Path.MakeFromSVGString(path3)!
const blob4 = Skia.Path.MakeFromSVGString(path4)!

const src = blob1.computeTightBounds()

export default function Blob() {
  const progress = useSharedValue(0)

  const animatedPath = useDerivedValue(() => {
    const path = Skia.Path.Make()
    path.addPath(blob1)
    // path.addPath(blob2)
    // path.addPath(blob3)
    // path.addPath(blob4)

    return path.interpolate(blob4, progress.value)!
  }, [progress])

  const color = useDerivedValue(() => {
    return interpolateColor(progress.value, [0, 1], ['#FA7268', '#F5A623'])
  }, [progress])

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1000 }), -1, true)
  }, [progress])

  return (
    <Canvas style={{ flex: 1 }}>
      <Path
        path={animatedPath}
        color={color}
        transform={[{ translate: [width / 2, height / 2] }, { scale: 0.5 }]}
      />
      {/* <Path path={path2} color="#F5A623" />
        <Path path={path3} color="#F8E71C" />
        <Path path={path4} color="#90EE90" /> */}
    </Canvas>
  )
}
