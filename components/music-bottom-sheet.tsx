import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable, Image } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Entypo, Foundation, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { height, width } = Dimensions.get("window");

const gnx = require('../assets/images/gnx.jpeg');
const icon_1 = require('../assets/images/1.png');
const icon_2 = require('../assets/images/2.png');
const icon_3 = require('../assets/images/3.png');

const PADDING_BOTTOM = 160;
const ANIMATION_CONFIGS_IOS = {
  damping: 500,
  stiffness: 1000,
  mass: 3,
  overshootClamping: true,
  restDisplacementThreshold: 10,
  restSpeedThreshold: 10,
};

export default function MusicBottomSheet() {
  const inset = useSafeAreaInsets();
  const [canPan, setCanPan] = useState(false);

  const bottomSheetPosition = useSharedValue(height);
  const bottomSheetIndex = useSharedValue(0);
  const backgroundColor = useSharedValue("#FFFFFF");

  const imageTranslateX = useSharedValue(8);
  const imageTranslateY = useSharedValue(8);
  const largeOpacity = useSharedValue(0);
  const smallOpacity = useSharedValue(1);

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => [PADDING_BOTTOM, PADDING_BOTTOM, '100%'], []);

  const onBottomSheetAnimate = useCallback((from: number, to: number) => {
    if (from === 2 && (to === 1 || to === 0)) {
      imageTranslateX.value = withSpring(8, ANIMATION_CONFIGS_IOS)
      imageTranslateY.value = withSpring(8, ANIMATION_CONFIGS_IOS)
      backgroundColor.value = withSpring("#FFFFFF", ANIMATION_CONFIGS_IOS)
      smallOpacity.value = withTiming(1, { duration: 100 })
      largeOpacity.value = withTiming(0, { duration: 100 })
      setCanPan(false)
    }
    if (from === 1 && to === 2) {
      imageTranslateX.value = withSpring(width / 2 - (240 / 2), ANIMATION_CONFIGS_IOS)
      imageTranslateY.value = withSpring(inset.top + 60, ANIMATION_CONFIGS_IOS)
      backgroundColor.value = withSpring("#7C7D80", ANIMATION_CONFIGS_IOS)
      smallOpacity.value = withTiming(0, { duration: 100 })
      largeOpacity.value = withTiming(1, { duration: 100 })
      setCanPan(true)
    }
  }, [backgroundColor, imageTranslateX, imageTranslateY, inset.top, largeOpacity, smallOpacity])

  const expand = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(2)
  }, [])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(bottomSheetIndex.value, [1, 2], [54, height], Extrapolation.CLAMP),
      marginHorizontal: interpolate(bottomSheetIndex.value, [1, 2], [12, 0], Extrapolation.CLAMP),
      backgroundColor: interpolateColor(bottomSheetIndex.value, [1, 1.4], ['#FFFFFF', '#7C7D80']),
      boxShadow: bottomSheetIndex.value < 1.05 ? "0px 2px 20px rgba(0, 0 , 0, 0.15)" : "0px 2px 20px rgba(0, 0 , 0, 0)",
      borderRadius: bottomSheetIndex.value < 1.05 ? 12 : 0,
    }
  })

  const animatedImage = useAnimatedStyle(() => {
    return {
      width: interpolate(bottomSheetIndex.value, [1, 2], [40, 240], Extrapolation.CLAMP),
      height: interpolate(bottomSheetIndex.value, [1, 2], [40, 240], Extrapolation.CLAMP),
      transform: [
        { translateX: imageTranslateX.value },
        { translateY: imageTranslateY.value }
      ]
    }
  })

  const animatedContent = useAnimatedStyle(() => ({ opacity: largeOpacity.value }))
  const animatedSmallContent = useAnimatedStyle(() => ({ opacity: smallOpacity.value }))

  useEffect(() => {
    bottomSheetRef.current?.present()
  }, [])

  return (
    <View style={styles.container}>
      <BottomSheetModal
        detached
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        animatedPosition={bottomSheetPosition}
        animatedIndex={bottomSheetIndex}
        animationConfigs={ANIMATION_CONFIGS_IOS}
        enableOverDrag={false}
        enableDynamicSizing={false}
        style={styles.sheetContainer}
        handleStyle={{ display: 'none' }}
        backgroundStyle={styles.sheetContainer}
        onAnimate={onBottomSheetAnimate}
        enablePanDownToClose={false}
        enableContentPanningGesture={canPan}
      >
        <Animated.View style={[styles.contentContainer, animatedStyle]}>
          <Animated.View style={[StyleSheet.absoluteFill, styles.largeContentWrapper, { paddingTop: inset.top }, animatedContent]}>
            <View style={styles.dragHandleWrapper}>
              <View style={styles.dragHandle} />
            </View>
            <View style={styles.fullContentWrapper}>
              <Text style={styles.largeTitle}>luther</Text>
              <Text style={styles.largeSubtitle}>Kendrick Lamar & SZA</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBar} />
              </View>
              <View style={styles.timeWrapper}>
                <Text style={styles.timeText}>0:24</Text>
                <Text style={styles.timeText}>-2:24</Text>
              </View>
              <View style={styles.controlWrapper}>
                <Entypo name="controller-fast-backward" size={40} color={'white'} />
                <Entypo name="controller-play" size={54} color={'white'} />
                <Entypo name="controller-fast-forward" size={40} color={'white'} />
              </View>
              <View style={styles.volumeWrapper}>
                <Ionicons name="volume-low" size={20} color={"#DFE0E4"} />
                <View style={styles.volumeBarContainer}>
                  <View style={styles.volumeBar} />
                </View>
                <Ionicons name="volume-high" size={20} color={"#DFE0E4"} />
              </View>
              <View style={styles.bottomIconsWrapper}>
                <Image tintColor={'white'} source={icon_1} style={styles.icon} resizeMode="contain" />
                <Image tintColor={'white'} source={icon_2} style={styles.icon} resizeMode="contain" />
                <Image tintColor={'white'} source={icon_3} style={styles.icon} resizeMode="contain" />
              </View>
            </View>
          </Animated.View>
          <Pressable onPress={expand} style={styles.collapsedPressable}>
            <Animated.Image source={gnx} style={[styles.collapsedImage, animatedImage]} resizeMethod="none" resizeMode="cover" />
            <Animated.View style={[styles.collapsedContent, animatedSmallContent]}>
              <Text style={styles.collapsedTitle}>luther</Text>
              <View style={styles.collapsedButtons}>
                <Entypo name="controller-play" size={28} />
                <Entypo name="controller-fast-forward" size={28} />
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </BottomSheetModal>

      <View style={styles.navWrapper}>
        <View style={styles.navItem}>
          <Foundation size={28} color={'#FA233B'} name="home" />
          <Text style={styles.navTextActive}>Home</Text>
        </View>
        <View style={styles.navItemGap5}>
          <Ionicons size={24} color={'#8D8D8D'} name="grid" />
          <Text style={styles.navText}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons size={28} color={'#8D8D8D'} name="radio" />
          <Text style={styles.navText}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <MaterialIcons size={28} color={'#8D8D8D'} name="library-music" />
          <Text style={styles.navText}>Home</Text>
        </View>
        <View style={styles.navItem}>
          <Ionicons size={28} color={'#8D8D8D'} name="search" />
          <Text style={styles.navText}>Home</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  sheetContainer: {
    backgroundColor: 'transparent'
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: 'center',
    borderRadius: 12
  },
  largeContentWrapper: {
    alignItems: 'center',
    overflow: 'hidden'
  },
  dragHandleWrapper: {
    flex: 1
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#C8C7C9",
    borderRadius: 6
  },
  fullContentWrapper: {
    paddingTop: 60,
    width: '100%',
    paddingHorizontal: 24,
    flex: 1
  },
  largeTitle: {
    color: "#FFF",
    opacity: 0.9,
    width: '100%',
    fontWeight: '500',
    fontSize: 24
  },
  largeSubtitle: {
    color: "#FFF",
    opacity: 0.9,
    width: '100%',
    fontWeight: '400',
    fontSize: 20
  },
  progressBarContainer: {
    height: 8,
    borderRadius: 4,
    width: '100%',
    backgroundColor: "#9A9A9B",
    marginTop: 32
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '20%',
    backgroundColor: "#DFE0E4"
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  timeText: {
    color: "#FFF",
    opacity: 0.5,
    fontSize: 12,
    marginTop: 12
  },
  controlWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 40
  },
  volumeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 16
  },
  volumeBarContainer: {
    height: 8,
    borderRadius: 4,
    flex: 1,
    backgroundColor: "#9A9A9B"
  },
  volumeBar: {
    height: 8,
    borderRadius: 4,
    width: '20%',
    backgroundColor: "#DFE0E4"
  },
  bottomIconsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: 30
  },
  icon: {
    width: 20,
    height: 20
  },
  collapsedPressable: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  collapsedImage: {
    borderRadius: 8,
    position: 'absolute',
    top: 0
  },
  collapsedContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  collapsedTitle: {
    flex: 1,
    paddingLeft: 48,
    fontSize: 14
  },
  collapsedButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingRight: 4
  },
  navWrapper: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 40,
    left: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    height: 40
  },
  navItemGap5: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    height: 40
  },
  navText: {
    color: "#8D8D8D",
    fontSize: 10,
    fontWeight: '300'
  },
  navTextActive: {
    color: "#FA233B",
    fontSize: 10,
    fontWeight: '300'
  },
});
