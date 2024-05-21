import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";

import { COLORS } from "../themes/DarkTheme";

const MarkdownView = ({ route, navigation }) => {
  const { title, description } = route.params;
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Markdown style={markdownStyles}>
          {`# ${title}\n\n${description}`}
        </Markdown>
      </ScrollView>
    </SafeAreaView>
  );
};

const markdownStyles = StyleSheet.create({
  heading1: {
    color: COLORS.secondary, // Cambiar el color del título
  },
  text: {
    color: COLORS.secondary,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.secondary,
  },
  closeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
  },
});

export default MarkdownView;
