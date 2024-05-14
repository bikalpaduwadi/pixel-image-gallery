import React from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";

import { hp, wp } from "@/helper/common";
import { theme } from "@/constants/theme";

const WelcomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Image
        source={require("../assets/images/welcome.png")}
        style={styles.bgImage}
        resizeMode="cover"
      ></Image>
      {/* linear gradient */}
      <Animated.View entering={FadeInDown.duration(1000)} style={{ flex: 1 }}>
        <LinearGradient
          colors={[
            "rgba(255,255,255,0)",
            "rgba(255,255,255,0.5)",
            "white",
            "white",
          ]}
          style={styles.gradient}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 0.8 }}
        />

        {/* content */}
        <View style={styles.contentContainer}>
          <Animated.Text
            entering={FadeInDown.delay(700).springify()}
            style={styles.title}
          >
            Image Gallery
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(1000).springify()}
            style={styles.description}
          >
            Experience Captivating Imagery In Our Gallery
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(1200).springify()}>
            <Pressable
              onPress={() => router.push("home")}
              style={styles.exploreButton}
            >
              <Text style={styles.exploreText}>Explore</Text>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    width: wp(100),
    height: hp(100),
    position: "absolute",
  },
  gradient: {
    width: wp(100),
    height: hp(65),
    bottom: 0,
    position: "absolute",
  },
  contentContainer: {
    flex: 1,
    gap: 14,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: hp(5),
    color: theme.colors.neutral(0.9),
    fontWeight: theme.fontWeights.bold as any,
  },
  description: {
    fontSize: hp(2),
    // display: "flex",
    alignItems: "center",
    // justifyContent: "center",
    letterSpacing: 1,
    marginBottom: 10,
    fontWeight: theme.fontWeights.medium as any,
  },
  exploreButton: {
    padding: 15,
    marginBottom: 50,
    paddingHorizontal: 90,
    borderCurve: "continuous",
    borderRadius: theme.radius.xl,
    backgroundColor: theme.colors.neutral(0.9),
  },
  exploreText: {
    color: theme.colors.white,
    fontSize: hp(3),
    fontWeight: theme.fontWeights.medium as any,
    letterSpacing: 1,
  },
});
