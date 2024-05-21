import {
  Text,
  View,
  TextInput,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../themes/DarkTheme";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import Icon from "react-native-vector-icons/FontAwesome";
import { FIREBASE_AUTH } from "../../firebase-config";

const RegisterScreen = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const { setUserId } = useContext(UserContext);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Envía el correo de verificación
      await sendEmailVerification(auth.currentUser);
      // Muestra un mensaje de éxito y navega a la pantalla de inicio de sesión
      Alert.alert(
        "Success",
        "User created successfully. Please verify your email before logging in.",
        [{ text: "OK", onPress: () => navigation.navigate("LoginScreen") }]
      );
      console.log("Usuario creado con éxito. ID:", response.user.uid);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.upperHalf}>
        <Image
          source={require("../../assets/Logo.png")}
          style={{ width: "100%", height: "100%" }}
        />
      </View>
      <View style={styles.lowerHalf} />
      <View style={styles.card}>
        <View>
          <Text style={styles.title}>Registro</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder="Correo"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputText}
            value={password}
            onChangeText={(text) => setPassword(text)}
            placeholder="Contraseña"
            secureTextEntry={!showPassword} // Cambia el tipo de entrada basado en el estado
          />
          {/* Icono para mostrar/ocultar la contraseña */}
          <TouchableOpacity
            onPress={toggleShowPassword}
            style={styles.iconContainer}
          >
            <Icon
              name={showPassword ? "eye-slash" : "eye"}
              size={18}
              color="#323032" // Cambia el color del icono aquí
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{ marginTop: 10 }}
          />
        ) : (
          <TouchableOpacity
            style={styles.registerButton}
            onPress={() => signUp()}
          >
            <Text style={{ fontSize: 16, color: "white" }}>Crear cuenta</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("LoginScreen")}
          style={styles.signInContainer}
        >
          <Text style={styles.signInText}>¿Ya tienes cuenta? Accede</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  upperHalf: {
    flex: 4,
    width: "100%",
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  lowerHalf: {
    flex: 6,
    width: "100%",
    backgroundColor: COLORS.white,
  },
  card: {
    position: "absolute",
    top: "35%",
    backgroundColor: COLORS.light,
    borderRadius: 10,
    padding: 20,
    width: "80%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  inputText: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  registerButton: {
    backgroundColor: "#324A5F",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  signInContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  signInText: {
    color: "#0C1821",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    height: "100%",
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#0C1821",
  },
});
