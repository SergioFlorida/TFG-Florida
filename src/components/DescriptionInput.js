import React, { useState, useEffect } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { COLORS } from "../themes/DarkTheme";

const DescriptionInput = ({ value, onChangeText }) => {
  const [showCommands, setShowCommands] = useState(false);
  const [text, setText] = useState(value);
  const commands = [
    { id: 1, name: "Negrita", symbol: "**" },
    { id: 2, name: "Cursiva", symbol: "*" },
    { id: 3, name: "Subrayado", symbol: "<u></u>" },
    { id: 4, name: "Tachado", symbol: "~~" },
    { id: 5, name: "Encabezado 1", symbol: "#" },
    { id: 6, name: "Encabezado 2", symbol: "##" },
    { id: 7, name: "Encabezado 3", symbol: "###" },
    { id: 8, name: "Lista Desordenada", symbol: "-" },
    { id: 9, name: "Lista Ordenada", symbol: "1." },
    { id: 10, name: "Cita", symbol: ">" },
    { id: 11, name: "Código en Línea", symbol: "`" },
    { id: 12, name: "Bloque de Código", symbol: "```" },
    { id: 13, name: "Enlace", symbol: "[Texto](URL)" },
    { id: 14, name: "Imagen", symbol: "![Texto Alternativo](URL)" },
    { id: 15, name: "Tabla", symbol: "| Encabezado |" },
    { id: 16, name: "Divisor", symbol: "---" },
  ];

  useEffect(() => {
    if (text.endsWith("/")) {
      setShowCommands(true);
    } else {
      setShowCommands(false);
    }
  }, [text]);

  const handleCommandSelect = (command) => {
    let newText;
    if (command.symbol.includes("[")) {
      newText = text.replace(/\/$/, command.symbol);
    } else {
      newText = text.replace(/\/$/, `${command.symbol}${command.symbol}`);
    }
    setText(newText);
    onChangeText(newText);
    setShowCommands(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.noteContainer}>
        <TextInput
          placeholderTextColor={COLORS.secondary}
          placeholder="Empieza a escribir aquí..."
          onChangeText={(value) => {
            setText(value);
            onChangeText(value);
          }}
          value={text}
          editable
          multiline
          style={styles.descriptionInput}
          color={COLORS.secondary}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCommands}
        onRequestClose={() => setShowCommands(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView style={styles.commandsContainer}>
            {commands.map((command) => (
              <TouchableOpacity
                key={command.id}
                style={styles.commandItem}
                onPress={() => handleCommandSelect(command)}
              >
                <Text style={styles.commandText}>{command.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noteContainer: {
    flex: 1,
  },
  descriptionInput: {
    padding: 10,
    fontSize: 16,
    minHeight: 100,
    textAlign: "auto",
    textAlignVertical: "top",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  commandsContainer: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    padding: 10,
    maxHeight: "70%",
    width: "80%",
  },
  commandItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
  },
  commandText: {
    color: COLORS.secondary,
    fontSize: 16,
  },
});

export default DescriptionInput;
