import React from "react";
import { Text, FlatList, StyleSheet, Pressable } from "react-native";

import { hp, wp } from "@/helper/common";
import { theme } from "@/constants/theme";
import IMAGE_CATEGOREIS from "@/constants/imageCategories";
import Animated, { FadeInRight } from "react-native-reanimated";

type CategoreisProps = {
  activeCategory: string;
  handleCategorySelection: (category: string) => void;
};

const Categoreis = ({
  handleCategorySelection,
  activeCategory,
}: CategoreisProps) => {
  return (
    <FlatList
      horizontal
      contentContainerStyle={styles.flatListContainer}
      showsHorizontalScrollIndicator={false}
      data={IMAGE_CATEGOREIS}
      keyExtractor={(item) => item}
      renderItem={({ item, index }) => (
        <CategoryItem
          title={item}
          index={index}
          isActive={activeCategory === item}
          handleCategorySelection={handleCategorySelection}
        />
      )}
    />
  );
};

export default Categoreis;

type CategoryItemProps = {
  title: string;
  index: number;
  isActive: boolean;
  handleCategorySelection: (category: string) => void;
};

const CategoryItem = ({
  title,
  index,
  isActive,
  handleCategorySelection,
}: CategoryItemProps) => {
  const backgroundColor = isActive
    ? theme.colors.neutral(0.8)
    : theme.colors.white;

  const color = !isActive ? theme.colors.neutral(0.8) : theme.colors.white;

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 200)
        .duration(1000)
        .springify()
        .damping(14)}
    >
      <Pressable
        onPress={() => handleCategorySelection(title)}
        style={[styles.category, { backgroundColor }]}
      >
        <Text style={[styles.title, { color }]}>{title}</Text>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flatListContainer: {
    paddingHorizontal: wp(4),
    gap: 8,
  },
  category: {
    padding: 12,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderCurve: "continuous",
    borderRadius: theme.radius.lg,
    borderColor: theme.colors.grayBG,
  },
  title: {
    fontSize: hp(1.8),
    fontWeight: theme.fontWeights.medium as any,
  },
});
