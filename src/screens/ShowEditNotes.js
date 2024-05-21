//ShowEditNotes
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { firebase } from "../../firebase-config"; // Asegúrate de importar firebase desde tu archivo de configuración
import { COLORS } from "../themes/DarkTheme";
import Icon from "react-native-vector-icons/FontAwesome5";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function ShowEditNotes(props) {
  const [note, setNote] = useState({});
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const db = getFirestore();

  // Contador de palabras para la descripción
  const wordCount = editedDescription
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  const getOneNote = async (id) => {
    try {
      const docRef = doc(db, "notas", id);
      const docSnap = await getDoc(docRef);
      const noteData = docSnap.data();
      setNote(noteData);
      setEditedTitle(noteData.title); // Establece el título editado al valor original
      setEditedDescription(noteData.description); // Establece la descripción editada al valor original
      setImageUrl(noteData.imageUrl); // Establece la URL de la imagen
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOneNote(props.route.params.noteId);
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setNewImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri) => {
    const { uri: localUri } = await FileSystem.getInfoAsync(uri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", localUri, true);
      xhr.send(null);
    });
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const ref = firebase.storage().ref().child(filename);
    await ref.put(blob);
    return await ref.getDownloadURL();
  };

  const saveChanges = async () => {
    try {
      let newImageUrl = imageUrl;
      if (newImage) {
        newImageUrl = await uploadImage(newImage);
      }

      const noteRef = doc(db, "notas", props.route.params.noteId);
      await updateDoc(noteRef, {
        title: editedTitle,
        description: editedDescription,
        imageUrl: newImageUrl,
      });

      Alert.alert("Éxito", "Nota actualizada con éxito");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (id) => {
    await deleteDoc(doc(db, "notas", id));
    Alert.alert("Éxito", "Nota eliminada con éxito");
    props.navigation.navigate("ListNotes");
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  const viewMarkdown = () => {
    // Navegar a la pantalla MarkdownView con los datos necesarios
    props.navigation.navigate("MarkdownView", {
      title: editedTitle,
      description: editedDescription,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.arrowButton} onPress={goBack}>
          <Icon
            name={"long-arrow-alt-left"}
            size={18}
            color={COLORS.secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrowButton} onPress={viewMarkdown}>
          <Icon name={"markdown"} size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.imageAddButton} onPress={pickImage}>
          <Icon name={"images"} size={18} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageAddButton} onPress={saveChanges}>
          <Icon name={"save"} size={20} color={COLORS.secondary} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        style={styles.writeContainer}
        behavior={Platform.OS === "ios" ? "padding" : null} // Ajuste de comportamiento según la plataforma
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Compensación vertical según la plataforma
      >
        <View style={styles.titleContainer}>
          <TextInput
            placeholder="Título"
            placeholderTextColor={COLORS.secondary}
            onChangeText={(text) => setEditedTitle(text)}
            value={editedTitle}
            style={styles.titleInput}
            color={COLORS.secondary}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.wordCount}>Palabras: {wordCount}</Text>
          <Text style={styles.wordCount}>{new Date().toLocaleString()}</Text>
        </View>
        <ScrollView style={styles.noteContainer}>
          <TextInput
            placeholderTextColor={COLORS.secondary}
            placeholder="Empieza a escribir aquí..."
            style={styles.descriptionInput}
            value={editedDescription}
            onChangeText={(text) => setEditedDescription(text)}
            editable
            multiline
            color={COLORS.secondary}
          />
        </ScrollView>
        <View style={styles.imageContainer}>
          {(newImage || imageUrl) && (
            <Image
              source={{ uri: newImage || imageUrl }}
              style={styles.image}
            />
          )}
        </View>
        <TouchableOpacity
          style={styles.btnDelete}
          onPress={() => deleteNote(props.route.params.noteId)}
        >
          <Text style={styles.txtEliminar}>Eliminar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    padding: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  writeContainer: {
    flex: 1,
  },
  titleContainer: {
    marginBottom: 10,
    borderRadius: 5,
    borderColor: COLORS.secondary,
    borderWidth: 1,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  descriptionInput: {
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    textAlign: "auto",
    textAlignVertical: "top",
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  wordCount: {
    color: COLORS.secondary,
    fontSize: 12,
  },
  titleInput: {
    padding: 10,
    fontSize: 16,
  },

  arrowButton: {
    padding: 10,
    borderRadius: 5,
  },
  imageAddButton: {
    padding: 10,
    borderRadius: 5,
  },
  btnDelete: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: COLORS.danger,
    alignItems: "center",
  },
  txtEliminar: {
    color: COLORS.white,
    fontSize: 16,
  },
});
