import React from "react";
import { Animated, View, Text } from "react-native";

const PageHeader = ({ title, scrollY }) => {
  
    // Header height transition (fixed height in this case)
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [50, 50], // Fixed header height (50px)
        extrapolate: 'clamp',
    });

    // Title scale (shrinks as you scroll)
    const titleScale = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0.5], // Title shrinks as you scroll
        extrapolate: 'clamp',
    });

    // Title opacity (fades out as you scroll)
    const titleOpacity = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [1, 0.8], // Title fades as you scroll
        extrapolate: 'clamp',
    });

    // Title vertical movement (moves down as you scroll)
    const titleTranslateY = scrollY.interpolate({
        inputRange: [0, 150],
        outputRange: [0, 10], // Dynamically center based on title width
        extrapolate: 'clamp',
      });

    return (
        <Animated.View
            style={[{ height: headerHeight, opacity: titleOpacity }]}
            className=""
        >
            {/* Title text */}
            <Animated.Text
                style={[
                    {
                        transform: [{ scale: titleScale }, { translateY: titleTranslateY }],
                        opacity: titleOpacity,
                    },
                ]}
                className="text-3xl font-bold text-black dark:text-white"
            >
                {title}
            </Animated.Text>
        </Animated.View>
    );

};