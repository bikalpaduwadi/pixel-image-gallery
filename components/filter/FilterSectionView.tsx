import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { theme } from "@/constants/theme";
import { capitalize, hp } from "@/helper/common";

type FilterSectionViewProps = {
  title: string;
  content: string;
};

const FilterSectionView = ({ title, content }: FilterSectionViewProps) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View>{content}</View>
    </View>
  );
};

export default FilterSectionView;

export const CommonFilter = ({
  data,
  filters,
  filterName,
  setFilters,
}: any) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item: string, index: number) => {
          const isActive = filters && filters[filterName] === item;
          const backgroundColor = isActive
            ? theme.colors.neutral(0.7)
            : "white";
          const color = isActive ? "white" : theme.colors.neutral(0.7);

          return (
            <Pressable
              key={item}
              onPress={() => onSelect(item)}
              style={[styles.outlinedButton, { backgroundColor }]}
            >
              <Text style={[styles.outlinedButtonText, { color }]}>
                {capitalize(item)}
              </Text>
            </Pressable>
          );
        })}
    </View>
  );
};

export const ColorFilter = ({ data, filters, filterName, setFilters }: any) => {
  const onSelect = (item: string) => {
    setFilters({ ...filters, [filterName]: item });
  };

  return (
    <View style={styles.flexRowWrap}>
      {data &&
        data.map((item: string, index: number) => {
          const isActive = filters && filters[filterName] === item;
          const borderColor = !isActive ? "white" : theme.colors.neutral(0.4);

          return (
            <Pressable key={item} onPress={() => onSelect(item)}>
              <View style={[styles.colorWrapper, { borderColor }]}>
                <View style={[styles.color, { backgroundColor: item }]} />
              </View>
            </Pressable>
          );
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: hp(2.4),
    fontWeight: theme.fontWeights.medium as any,
    color: theme.colors.neutral(0.8),
  },
  flexRowWrap: {
    gap: 10,
    flexWrap: "wrap",
    flexDirection: "row",
  },
  outlinedButton: {
    padding: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    borderRadius: theme.radius.xs,
    borderCurve: "continuous",
  },
  outlinedButtonText: {},
  color: {
    height: 30,
    width: 40,
    borderRadius: theme.radius.sm - 3,
    borderCurve: "continuous",
  },
  colorWrapper: {
    padding: 3,
    borderWidth: 2,
    borderCurve: "continuous",
    borderRadius: theme.radius.sm,
  },
});
