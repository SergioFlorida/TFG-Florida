import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  TextInput,
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { UserContext } from "../contexts/UserContext";
import { query, collection, onSnapshot, where } from "firebase/firestore";
import NoteItem from "../components/NoteItem";
import { FIREBASE_DB } from "../../firebase-config";
import { COLORS } from "../themes/DarkTheme";

const ListNotes = (props) => {
  const { userId } = useContext(UserContext);
  const [lista, setLista] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const db = FIREBASE_DB;

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "notas"), where("userId", "==", userId)),
      (snapshot) => {
        const docs = [];
        snapshot.forEach((doc) => {
          const { title, description, createdAt } = doc.data();
          docs.push({
            id: doc.id,
            title,
            description,
            createdAt,
          });
        });
        setLista(docs);
        console.log("Consulta realizada con: " + userId);
      },
      (error) => {
        console.error("Error al obtener las notas:", error);
      }
    );

    // Limpiar el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, [userId, db]);

  // Filtra la lista de notas basada en el término de búsqueda
  const filteredNotes = lista.filter((note) =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Lista de notas</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar notas..."
        onChangeText={(text) => setSearchTerm(text)}
        value={searchTerm}
      />
      <ScrollView style={styles.noteList}>
        {filteredNotes.map((list) => (
          <NoteItem key={list.id} note={list} navigation={props.navigation} />
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => props.navigation.navigate("CreateNotes")}
      >
        <Text style={styles.buttonText}>Agregar nota</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ListNotes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addButton: {
    backgroundColor: COLORS.button,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 30,
    color: COLORS.secondary,
  },
  noteList: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
});
