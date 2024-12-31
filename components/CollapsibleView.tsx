import React, { useState, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

interface CollapsibleViewProps {
  header: React.ReactNode; // Custom header as a React node
  children: React.ReactNode; // Collapsible content
}

const CollapsibleView: React.FC<CollapsibleViewProps> = ({ header, children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [animation] = useState(new Animated.Value(0));
  const contentHeight = useRef(0); // Holds the actual height of the content

  const toggleCollapse = () => {
    Animated.timing(animation, {
      toValue: collapsed ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCollapsed(!collapsed);
  };

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight.current], // Use the dynamically measured height
  });

  return (
    <View>
      {/* Custom header with toggle functionality */}
      <View onTouchEnd={toggleCollapse}>{header}</View>
      <Animated.View style={{ height: heightInterpolate, overflow: 'hidden' }}>
        <View
          onLayout={(event) => {
            if (!contentHeight.current) {
              contentHeight.current = event.nativeEvent.layout.height;
            }
          }}
        >
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CollapsibleView;
