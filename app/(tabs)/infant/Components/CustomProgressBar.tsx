import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";

type ProgressBarProps = {
  progress: number; // progress value between 0 and 100
  width: number; // width of the progress bar
  height: number; // height of the progress bar
  color: string; // color of the progress line
  backgroundColor: string; // background color of the progress bar
  label?: string; // Optional label to display on the progress bar
};

const CustomProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width,
  height,
  color,
  backgroundColor,
  label,
}) => {
  const progressWidth = (width * progress) / 100; // Calculate the width based on progress

  return (
    <View style={[styles.container, { width, height }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Svg width={width} height={height}>
        {/* Background line */}
        <Line
          x1="0"
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke={backgroundColor}
          strokeWidth={height}
        />
        {/* Progress line */}
        <Line
          x1="0"
          y1={height / 2}
          x2={progressWidth}
          y2={height / 2}
          stroke={color}
          strokeWidth={height}
        />
      </Svg>
      <Text style={styles.progressText}>{progress}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  progressText: {
    fontSize: 14,
    marginTop: 5,
    fontWeight: "bold",
  },
});

export default CustomProgressBar;
