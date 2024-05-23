import { useRouter } from "expo-router";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather, FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { fetchImages } from "@/api";
import { hp, wp } from "@/helper/common";
import { theme } from "@/constants/theme";
import Categoreis from "@/components/Categoreis";
import ImageGrid from "@/components/ImageGrid";
import FilterModal from "@/components/filter/FilterModal";

const HomeScreen = () => {
  let page = 1;
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<any>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const searchInputRef = useRef<TextInput>(null);
  const refFilterModal = useRef(null);
  const scrollRef = useRef(null);
  const [filters, setFilters] = useState(null);
  const [isBottomReached, setIsBottomReached] = useState(false);
  const { top } = useSafeAreaInsets();
  const paddingTop = top > 0 ? top + 10 : 30;

  const getImages = async (params = { page: 1 }, append = false) => {
    const res = await fetchImages(params);
    if (res.data && res.data?.length && !res.isError) {
      if (append) {
        setImages([...images, ...res.data]);
      } else {
        setImages([...res.data]);
      }
    }
  };

  useEffect(() => {
    getImages();
  }, []);

  const handleCategorySelection = (category: string) => {
    setActiveCategory(category);
    setImages([]);
    clearSearch();

    if (category === activeCategory) {
      setActiveCategory("");
      handleSearch("");
      return;
    }

    page = 1;

    let params: any = {
      page,
      ...(filters || {}),
    };

    if (category) {
      params.category = category;
    }

    getImages(params);
  };

  const handleSearch = (text: string) => {
    setSearch(text);

    if (text.length > 2 || !text) {
      setActiveCategory("");
      setImages([]);
      page = 1;
      const param = {
        page,
        q: text.toLowerCase() || "",
        ...(filters || {}),
      };
      getImages(param);
    }
  };

  const debounceSearch = useCallback(debounce(handleSearch, 200), []);

  const clearSearch = (reset: boolean = false) => {
    setSearch("");

    if (searchInputRef.current) {
      searchInputRef.current.clear();
    }

    if (reset) {
      handleSearch("");
    }
  };

  const openFilterModel = () => {
    (refFilterModal?.current as any).present();
  };

  const closeFilterModel = () => {
    (refFilterModal?.current as any).close();
  };

  const applyFilters = () => {
    if (filters) {
      setImages([]);
      page = 1;
      let params = {
        page,
        ...(filters as any),
      };

      if (activeCategory) {
        params.category = activeCategory;
      }

      if (search) {
        params.q = search;
      }

      getImages(params);
      closeFilterModel();
    }
  };

  const resetFilters = () => {
    if (filters) {
      setFilters(null);
      setImages([]);
      page = 1;
      let params: any = {
        page,
      };

      if (activeCategory) {
        params.category = activeCategory;
      }

      if (search) {
        params.q = search;
      }

      getImages(params);
    }
    closeFilterModel();
  };

  const clearSingleFilter = (key: string) => {
    if (filters) {
      const currentFilters = { ...(filters as any) };
      delete currentFilters[key];
      setFilters({ ...currentFilters });

      // Todo: place following logic in a reuseable funtion
      setImages([]);
      page = 1;
      let params = {
        page,
        ...currentFilters,
      };

      if (activeCategory) {
        params.category = activeCategory;
      }

      if (search) {
        params.q = search;
      }

      getImages(params);
    }
  };

  const handlScroll = (event: any) => {
    const contentHeight = event.nativeEvent.contentSize.height;
    const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollOffset = event.nativeEvent.contentOffset.y;
    const bottomPosition = contentHeight - scrollViewHeight;

    if (scrollOffset >= bottomPosition - 1) {
      if (!isBottomReached) {
        setIsBottomReached(true);
        ++page;
        let params: any = { page, ...(filters || {}) };

        if (activeCategory) {
          params.category = activeCategory;
        }

        if (search) {
          params.q = search;
        }

        getImages(params, true);
      }
    } else if (isBottomReached) {
      setIsBottomReached(false);
    }
  };

  const scrollToTop = () => {
    if (scrollRef.current) {
      (scrollRef.current as any).scrollTo({
        y: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={scrollToTop}>
          <Text style={styles.title}>Gallery</Text>
        </Pressable>
        <Pressable onPress={() => openFilterModel()}>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          ></FontAwesome6>
        </Pressable>
      </View>
      <ScrollView
        onScroll={handlScroll}
        scrollEventThrottle={5}
        ref={scrollRef}
        contentContainerStyle={{ gap: 15 }}
      >
        {/* search bar */}
        <View style={styles.searchBar}>
          <View style={styles.searchIcon}>
            <Feather
              name="search"
              size={24}
              color={theme.colors.neutral(0.4)}
            />
          </View>
          <TextInput
            // value={search}
            ref={searchInputRef}
            onChangeText={debounceSearch}
            placeholder="Search images..."
            style={styles.searchInput}
          />
          {search && (
            <Pressable
              onPress={() => clearSearch(true)}
              style={styles.closeIcon}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.neutral(0.6)}
              />
            </Pressable>
          )}
        </View>

        {/* categories */}
        <View>
          <Categoreis
            activeCategory={activeCategory}
            handleCategorySelection={handleCategorySelection}
          />
        </View>

        {/* filters  */}
        {filters && (
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
            >
              {Object.keys(filters).map((key, index) => {
                return (
                  <View key={key} style={styles.filterItem}>
                    {key === "colors" ? (
                      <View
                        style={{
                          height: 20,
                          width: 30,
                          borderRadius: 7,
                          backgroundColor: filters[key],
                        }}
                      ></View>
                    ) : (
                      <Text style={styles.filterItemText}>{filters[key]}</Text>
                    )}
                    <Pressable
                      style={styles.filterCloseIcon}
                      onPress={() => clearSingleFilter(key)}
                    >
                      <Ionicons
                        name="close"
                        size={14}
                        color={theme.colors.neutral(0.9)}
                      />
                    </Pressable>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* images masonary grid view  */}
        <View>
          {images.length > 0 && <ImageGrid images={images} router={router} />}
        </View>

        {/* Loader  */}
        <View
          style={{ marginBottom: 70, marginTop: images.length > 0 ? 10 : 70 }}
        >
          <ActivityIndicator size="large" />
        </View>
      </ScrollView>

      {/* filter modal  */}
      <FilterModal
        refFilterModal={refFilterModal}
        filters={filters}
        onApply={applyFilters}
        onReset={resetFilters}
        setFilters={setFilters}
        onClose={closeFilterModel}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
  },
  header: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontSize: hp(3),
    fontWeight: theme.fontWeights.semibold as any,
    color: theme.colors.neutral(0.9),
  },
  searchBar: {
    marginHorizontal: wp(4),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: theme.colors.grayBG,
    backgroundColor: theme.colors.white,
    padding: 6,
    paddingLeft: 10,
    borderRadius: theme.radius.lg,
  },
  searchIcon: {
    padding: 8,
  },
  searchInput: {
    flex: 1,
    borderRadius: theme.radius.sm,
    paddingVertical: 10,
    fontSize: hp(1.8),
  },
  closeIcon: {
    backgroundColor: theme.colors.neutral(0.1),
    padding: 8,
    borderRadius: theme.radius.sm,
  },
  filters: {
    paddingHorizontal: wp(4),
    gap: 10,
  },
  filterItem: {
    backgroundColor: theme.colors.grayBG,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.radius.xs,
    gap: 10,
    paddingHorizontal: 10,
  },
  filterItemText: {
    fontSize: hp(1.9),
  },
  filterCloseIcon: {
    backgroundColor: theme.colors.neutral(0.2),
    padding: 4,
    borderRadius: 7,
  },
});
