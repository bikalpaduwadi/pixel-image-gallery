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
} from "react-native";

import { fetchImages } from "@/api";
import { hp, wp } from "@/helper/common";
import { theme } from "@/constants/theme";
import Categoreis from "@/components/Categoreis";
import ImageGrid from "@/components/ImageGrid";

const HomeScreen = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [images, setImages] = useState<any>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const searchInputRef = useRef<TextInput>(null);
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

    let params: any = {
      page: 1,
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
      const param = { page: 1, q: text.toLowerCase() || "" };
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

  return (
    <View style={[styles.container, { paddingTop }]}>
      {/* header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.title}>Gallery</Text>
        </Pressable>
        <Pressable>
          <FontAwesome6
            name="bars-staggered"
            size={22}
            color={theme.colors.neutral(0.7)}
          ></FontAwesome6>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ gap: 15 }}>
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

        {/* images masonary grid view  */}
        <View>{images.length > 0 && <ImageGrid images={images} />}</View>
      </ScrollView>
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
});
