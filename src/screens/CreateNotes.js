//CreateNotes.js
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView, // Importar KeyboardAvoidingView
  Platform,
} from "react-native";
import DescriptionInput from "../components/DescriptionInput";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { firebase } from "../../firebase-config";
import * as FileSystem from "expo-file-system";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import Icon from "react-native-vector-icons/FontAwesome5";

import { COLORS } from "../themes/DarkTheme";

export default function CreateNotes(props) {
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { userId } = useContext(UserContext);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setImage(result.assets[0].uri);
    }
  };

  const initialState = {
    title: "",
    description: "",
  };

  const [state, setState] = useState(initialState);

  const handleChangeText = (value, name) => {
    setState({ ...state, [name]: value });
  };

  const viewMarkdown = () => {
    navigation.navigate("MarkdownView", {
      title: state.title,
      description: state.description,
    });
  };

  const saveNote = async () => {
    try {
      let imageUrl = null;
      if (image) {
        const { uri } = await FileSystem.getInfoAsync(image);
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
          xhr.open("GET", uri, true);
          xhr.send(null);
        });
        const filename = image.substring(image.lastIndexOf("/") + 1);
        const ref = firebase.storage().ref().child(filename);
        await ref.put(blob);
        imageUrl = await ref.getDownloadURL();
      }

      const noteData = {
        ...state,
        userId: userId,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      };
      await addDoc(collection(getFirestore(), "notas"), noteData);
      Alert.alert("Nota Guardada");
    } catch (error) {
      console.error("Error al guardar la nota:", error);
      console.log(state);
    }
  };

  const goBack = () => {
    props.navigation.goBack();
  };

  // Contador de palabras para la descripción
  const wordCount = state.description
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

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
          <Icon name={"markdown"} size={18} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageAddButton} onPress={pickImage}>
          <Icon name={"images"} size={18} color={COLORS.secondary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.imageAddButton} onPress={saveNote}>
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
            onChangeText={(value) => handleChangeText(value, "title")}
            value={state.title}
            style={styles.titleInput}
            color={COLORS.secondary}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.wordCount}>Palabras: {wordCount}</Text>
          <Text style={styles.wordCount}>{new Date().toLocaleString()}</Text>
        </View>
        <ScrollView style={styles.noteContainer}>
          <DescriptionInput
            value={state.description}
            onChangeText={(value) => handleChangeText(value, "description")}
          />
        </ScrollView>
        <View style={styles.imageContainer}>
          {image && <Image source={{ uri: image }} style={styles.image} />}
        </View>
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
});
