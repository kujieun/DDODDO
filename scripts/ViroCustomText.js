import React, { useEffect, useRef, useState, forwardRef } from 'react';
import { ViroText } from '@viro-community/react-viro';
import { Platform, StyleSheet } from 'react-native';

// Use forwardRef to allow ref forwarding
const ViroCustomText = forwardRef((props, ref) => {
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

  const localRef = useRef(null); // Local ref to manage internal component reference
  const [render, setRender] = useState(false);

  useEffect(() => {
    setRender(true);
  }, []);

  const combinedStyle = [
    style,
    Platform.OS === 'android' && { fontFamily: 'NotoSansKR-Bold' } // Use a single font family
  ];

  return (
    <ViroText
      ref={(node) => {
        localRef.current = node;
        if (ref) {
          // Forward the ref to the parent component
          if (typeof ref === 'function') {
            ref(node);
          } else {
            ref.current = node;
          }
        }
      }}
      text={!render ? '' : text}
      color={color}
      extrusionDepth={extrusionDepth}
      maxLines={maxLines}
      outerStroke={outerStroke}
      textClipMode={textClipMode}
      textLineBreakMode={textLineBreakMode}
      width={width}
      height={height}
      style={combinedStyle}
    />
  );
});

export { ViroCustomText };
