import { Dimensions } from "react-native";

const { width: deviceWidth, height: deviceHeight } = Dimensions.get("window");

export const wp = (percentage: number) => (percentage * deviceWidth) / 100;
export const hp = (percentage: number) => (percentage * deviceHeight) / 100;

export const getColumnCount = () => {
  if (deviceWidth >= 1024) {
    // Desktop
    return 4;
  } else if (deviceWidth >= 768) {
    // Tablet
    return 3;
  } else {
    // Phone
    return 2;
  }
};

export const getImageSize = (height: number, width: number) => {
  if (width > height) {
    // Landscape
    return 250;
  } else if (width < height) {
    // Portrait
    return 300;
  } else {
    // Square
    return 200;
  }
};

export const capitalize = (value: string) => {
  if (!value) {
    return "";
  }

  return value[0].toUpperCase() + value.slice(1);
};
