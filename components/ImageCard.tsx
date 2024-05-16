import React from "react";
import { Image } from "expo-image";
import { Pressable, StyleSheet } from "react-native";

import { getImageSize } from "@/helper/common";
import { theme } from "@/constants/theme";

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

  return (
    <Pressable style={[styles.imageWrapper]}>
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
  },
});
