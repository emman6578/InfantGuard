import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, Text as SvgText } from "react-native-svg";

type CircularProgressBarProps = {
  progress: number; // progress value between 0 and 100
  size: number; // size of the circular progress bar
  strokeWidth: number; // width of the circular progress stroke
  color: string; // color of the progress stroke
  backgroundColor: string; // background color of the circle
  label?: string; // Optional label to display inside the circle
};

const CircularProgressBar: React.FC<CircularProgressBarProps> = ({
  progress,
  size,
  strokeWidth,
  color,
  backgroundColor,
  label,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (progress / 100) * circumference; // Calculate the offset based on progress

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
        />

        {/* Progress Label */}
        <SvgText
          x={size / 2}
          y={size / 2 + strokeWidth}
          textAnchor="middle"
          fontSize={10}
          fontWeight="bold"
          fill="black"
        >
          {`${Math.round(progress)}%`}
        </SvgText>
      </Svg>

      {/* Optional label below the circle */}
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default CircularProgressBar;
