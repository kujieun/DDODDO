import React, { useEffect, useRef, useState } from "react";
import { ViroText, ViroTextStyle } from "@viro-community/react-viro";
import { ColorValue, Platform } from "react-native";

export type ViroCustomTextProps = {
  text: string;
  color?: ColorValue;
  extrusionDepth?: number;
  style?: ViroTextStyle;
  outerStroke?: {
    type?: "None" | "Outline" | "DropShadow";
    width?: number;
    color?: ColorValue;
  };
  maxLines?: number;
  textClipMode?: "None" | "ClipToBounds";
  textLineBreakMode?: "WordWrap" | "CharWrap" | "Justify" | "None";
  width?: number;
  height?: number;
};

export function ViroCustomText(props: ViroCustomTextProps) {
  const {
    text,
    color,
    extrusionDepth,
    maxLines,
    outerStroke,
    style,
    textClipMode,
    textLineBreakMode,
    width,
    height,
  } = props;

  const ref = useRef<ViroText>();
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android") {
      ref.current.setNativeProps({
        fontWeight: "500",
        fontFamily: [
          "SamsungKorean",
          "NotoSansCJK",
          "Roboto",
          "monaco",
          "normal",
          "nanum_gothic",
          "sans-serif",
        ].join(","),
      } as any);
    }

    setRender(true);
  }, []);

  return (
    <ViroText
      ref={ref}
      text={!render ? "" : text}
      color={color}
      extrusionDepth={extrusionDepth}
      maxLines={maxLines}
      outerStroke={outerStroke}
      style={{
        ...style,
      }}
      textClipMode={textClipMode}
      textLineBreakMode={textLineBreakMode}
      width={width}
      height={height}
    />
  );
}