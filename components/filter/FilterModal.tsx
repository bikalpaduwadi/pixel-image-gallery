import React, { useMemo } from "react";
import { BlurView } from "expo-blur";
import { Text, StyleSheet, View, Pressable } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import Animated, {
  Extrapolation,
  FadeInDown,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { capitalize, hp } from "@/helper/common";
import { theme } from "@/constants/theme";
import FilterSectionView, {
  ColorFilter,
  CommonFilter,
} from "./FilterSectionView";
import IMAGE_FILTERS from "@/constants/imageFilters";

type FilterModalProps = {
  refFilterModal: any;
  filters: any;
  onApply: any;
  onClose: any;
  onReset: any;
  setFilters: any;
};

const FilterModal = ({
  refFilterModal,
  filters,
  onApply,
  onClose,
  onReset,
  setFilters,
}: FilterModalProps) => {
  const snapPoints = useMemo(() => ["75%"], []);

  return (
    <BottomSheetModal
      ref={refFilterModal}
      index={0}
      enablePanDownToClose={true}
      snapPoints={snapPoints}
      backdropComponent={CustomBackdrop}
      // onChange={handleSheetChanges}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View style={styles.content}>
          <Text style={styles.filterText}>Apply Filters</Text>
          {Object.keys(sections).map((section: string, index: number) => {
            const sectionView = sections[section];
            const sectionData = IMAGE_FILTERS[section];
            const title = capitalize(section);

            return (
              <Animated.View
                key={section}
                entering={FadeInDown.delay(index * 100 + 100)
                  .springify()
                  .damping(11)}
              >
                <FilterSectionView
                  title={title}
                  content={sectionView({
                    data: sectionData,
                    filters,
                    setFilters,
                    filterName: section,
                  })}
                />
              </Animated.View>
            );
          })}

          {/* Actions  */}
          <Animated.View
            style={styles.buttons}
            entering={FadeInDown.delay(500).springify().damping(11)}
          >
            <Pressable style={styles.resetButton} onPress={onReset}>
              <Text
                style={[
                  styles.buttonText,
                  { color: theme.colors.neutral(0.9) },
                ]}
              >
                Reset
              </Text>
            </Pressable>
            <Pressable style={styles.applyButton} onPress={onApply}>
              <Text style={[styles.buttonText, { color: theme.colors.white }]}>
                Apply
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const sections: Record<string, any> = {
  order: (props: any) => <CommonFilter {...props} />,
  orientation: (props: any) => <CommonFilter {...props} />,
  type: (props: any) => <CommonFilter {...props} />,
  colors: (props: any) => <ColorFilter {...props} />,
};

export default FilterModal;

const CustomBackdrop = ({ animatedIndex, style }: any) => {
  const containerStyleAnimated = useAnimatedStyle(() => {
    let opacity = interpolate(
      animatedIndex.value,
      [-1, 0],
      [0, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  const containerStyle = [
    StyleSheet.absoluteFill,
    style,
    styles.overlay,
    containerStyleAnimated,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={25} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    flex: 1,
    gap: 15,
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: hp(4),
    fontWeight: theme.fontWeights.semibold as any,
    color: theme.colors.neutral(0.8),
    marginBottom: 5,
  },
  buttons: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  resetButton: {
    flex: 1,
    padding: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.neutral(0.03),
  },
  applyButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderCurve: "continuous",
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.neutral(0.8),
  },
  buttonText: {
    fontSize: hp(2.2),
  },
});
