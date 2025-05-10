import { StickerProps } from '@/typings/sticker';
import { Matrix4, SkMatrix, SkSize } from '@shopify/react-native-skia';
import { createContext, FC, useContext, useState } from 'react';
import { SharedValue } from 'react-native-reanimated';

type Sticker = {
  matrix: SkMatrix | SharedValue<Matrix4>
  size: SkSize
  Sticker: FC<StickerProps>
}

type StickerContextType = {
  stickers: Sticker[]
  addSticker: (sticker: Sticker) => void
  undoSticker: () => void
}

const StickerContext = createContext<StickerContextType>({
  stickers: [],
  addSticker: () => {},
  undoSticker: () => {},
})

export const StickerProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [stickers, setStickers] = useState<Sticker[]>([])

  const addSticker = (sticker: Sticker) => {
    setStickers([...stickers, sticker])
  }

  const undoSticker = () => {
    setStickers(stickers.slice(0, -1))
  }

  return (
    <StickerContext.Provider value={{ stickers, addSticker, undoSticker }}>
      {children}
    </StickerContext.Provider>
  )
}

export const useSticker = () => {
  if (!StickerContext) {
    throw new Error('useSticker must be used within a StickerProvider')
  }

  const { stickers, addSticker, undoSticker } = useContext(StickerContext)

  return { stickers, addSticker, undoSticker }
}
