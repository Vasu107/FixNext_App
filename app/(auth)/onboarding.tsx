import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const slides = [
  {
    id: "1",
    title: "Everything your home needs",
    subtitle: "Book trusted professionals for everyday home services.",
    image: require("../../assets/onboarding1.png"),
  },
  {
    id: "2",
    title: "Trusted professionals at your doorstep",
    subtitle:
      "Verified professionals, transparent pricing and reliable service.",
    image: require("../../assets/onboarding2.png"),
  },
  {
    id: "3",
    title: "Book in minutes",
    subtitle: "Choose a service, select a time and let us handle the rest.",
    image: require("../../assets/onboarding3.png"),
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [currentIndex, setCurrentIndex] = useState(0);

  const slidesRef = useRef<FlatList>(null);

  const viewableItemsChanged = useRef(
    ({ viewableItems }: any) => {
      if (viewableItems && viewableItems.length > 0) {
        const index = viewableItems[0]?.index;

        if (index !== null && index !== undefined) {
          setCurrentIndex(index);
        }
      }
    }
  ).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const handleFinish = async () => {
    try {
      await AsyncStorage.setItem("onboardingCompleted", "true");
      router.replace("/login");
    } catch (error) {
      console.error("Failed to save onboarding status:", error);
      router.replace("/login");
    }
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleFinish();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleFinish}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Skip onboarding"
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={slidesRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image
              source={item.image}
              style={styles.image}
              resizeMode="contain"
            />

            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>

              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        )}
      />

      {/* Footer */}
      <View style={styles.footer}>
        {/* Pagination */}
        <View style={styles.paginator}>
          {slides.map((_, index) => (
            <View
              key={index.toString()}
              style={[
                styles.dot,
                index === currentIndex
                  ? styles.activeDot
                  : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "flex-end",
  },

  skipText: {
    color: "#287AA8",
    fontSize: 16,
    fontWeight: "600",
  },

  slide: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },

  image: {
    width: "100%",
    height: 300,
    marginTop: 40,
    marginBottom: 40,
  },

  textContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111111",
    textAlign: "center",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    lineHeight: 24,
  },

  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  paginator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#287AA8",
    marginHorizontal: 4,
  },

  activeDot: {
    width: 20,
    opacity: 1,
  },

  inactiveDot: {
    width: 8,
    opacity: 0.3,
  },

  button: {
    width: "100%",
    height: 56,
    borderRadius: 8,
    backgroundColor: "#287AA8",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});