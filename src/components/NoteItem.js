//NoteItem.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { formatDate } from "../utils/formatDate"; // Utilidad de formato de fecha
import { COLORS } from "../themes/DarkTheme";

const NoteItem = ({ note, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.noteItem}
      onPress={() => navigation.navigate("ShowEditNotes", { noteId: note.id })}
    >
      <Text style={styles.noteTitle}>{note.title}</Text>
      <Text style={styles.noteDescription}>{formatDate(note.createdAt)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  noteItem: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  noteTitle: {
    fontSize: 16,
  },
  noteDescription: {
    fontSize: 14,
    color: "#666",
  },
});

export default NoteItem;
