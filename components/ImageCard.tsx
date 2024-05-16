import React from "react";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

import { theme } from "@/constants/theme";
import { getImageSize, wp } from "@/helper/common";

const ImageCard = ({
  image,
  index,
  columns,
}: {
  image: any;
  index: number;
  columns: number;
}) => {
  const getImageHeight = () => {
    let { imageHeight: height, imageWidth: width } = image;
    return { height: getImageSize(height, width) };
  };

  const isLastInRow = () => {
    return (index + 1) % columns === 0;
  };

  return (
    <Pressable style={[styles.imageWrapper, !isLastInRow() && styles.spacing]}>
      <Image
        style={[styles.image, getImageHeight()]}
        source={image.webformatURL}
        transition={300}
      />
    </Pressable>
  );
};

export default ImageCard;

const styles = StyleSheet.create({
  image: {
    height: 300,
    width: "100%",
  },
  imageWrapper: {
    backgroundColor: theme.colors.grayBG,
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
    marginBottom: wp(2),
  },
  spacing: {
    marginRight: wp(2),
  },
});
