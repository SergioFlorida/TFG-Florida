import React from "react";
import { TextInput, StyleSheet } from "react-native";

const SearchInput = ({ searchTerm, setSearchTerm }) => {
  return (
    <TextInput
      style={styles.searchInput}
      placeholder="Buscar notas..."
      onChangeText={(text) => setSearchTerm(text)}
      value={searchTerm}
    />
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  searchInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});
