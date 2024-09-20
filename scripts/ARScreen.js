import React, { useEffect, useRef, useState } from "react";
import { ViroARScene, ViroARSceneNavigator, ViroText } from "@viro-community/react-viro";
import { ColorValue, Platform, StyleSheet } from "react-native";

// ViroCustomText 컴포넌트
export function ViroCustomText(props) {
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

  const ref = useRef(null); // 타입 제거
  const [render, setRender] = useState(false);

  useEffect(() => {
    if (Platform.OS === "android") {
      ref.current?.setNativeProps({
        fontFamily: ["NotoSansCJK"].join(","),
      });
    }
    setRender(true);
  }, []);

  return (
    <ViroText
      ref={ref}
      text={!render ? "" : text} // 폰트가 로드될 때까지 빈 문자열로 설정
      color={color}
      extrusionDepth={extrusionDepth}
      maxLines={maxLines}
      outerStroke={outerStroke}
      textClipMode={textClipMode}
      textLineBreakMode={textLineBreakMode}
      width={width}
      height={height}
      style={style}
    />
  );
}

// HelloWorldSceneAR 컴포넌트
const HelloWorldSceneAR = () => {
  return (
    <ViroARScene>
      <ViroCustomText
        text="안녕하세요"
        position={[0, 0, -1]} // AR 카메라 앞에 위치
        extrusionDepth={1} // 텍스트 깊이 설정
        style={{ fontSize: 30, color: "#black" }} // 텍스트 스타일 설정
      />
    </ViroARScene>
  );
};

// 기본 내보내기
const App = () => {
  return (
    <ViroARSceneNavigator
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

// 스타일 정의
const styles = StyleSheet.create({
  f1: { flex: 1 },
});

export default App;
