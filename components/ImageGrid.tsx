import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MasonryFlashList } from "@shopify/flash-list";
import ImageCard from "./ImageCard";
import { wp, getColumnCount } from "@/helper/common";

type ImageGridProps = {
  images: any[];
};

const ImageGrid = ({ images }: ImageGridProps) => {
  const columns = getColumnCount();

  return (
    <View style={styles.container}>
      <MasonryFlashList
        data={images}
        numColumns={2}
        contentContainerStyle={styles.imageList}
        renderItem={({ item, index }) => (
          <ImageCard image={item} index={index} columns={columns} />
        )}
        estimatedItemSize={200}
      />
    </View>
  );
};

export default ImageGrid;

const styles = StyleSheet.create({
  container: {
    minHeight: 3,
    width: wp(100),
  },
  imageList: {
    paddingHorizontal: wp(4),
  },
});