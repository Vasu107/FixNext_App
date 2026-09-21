import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { authFetch } from "@/src/api";

const BLUE = "#2B719E";
const LIGHT_BG = "#F8FAFC";

export default function EditProviderProfile() {
  const router = useRouter();

  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Optionally prepopulate if needed
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await authFetch('/providers/profile', {
        method: 'PUT',
        body: JSON.stringify({ bio, experience, city })
      });
      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.field}>
          <Text style={styles.label}>Bio</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: "top" }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself"
            multiline
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Experience</Text>
          <TextInput
            style={styles.input}
            value={experience}
            onChangeText={setExperience}
            placeholder="e.g. 5 Years"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="e.g. Mumbai"
          />
        </View>

        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={handleSave}
          disabled={loading}
        >
          <Text style={styles.saveText}>{loading ? "Saving..." : "Save Profile"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: LIGHT_BG },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F1F1",
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  container: { padding: 20 },
  field: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 8 },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111",
  },
  saveButton: {
    backgroundColor: BLUE,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
