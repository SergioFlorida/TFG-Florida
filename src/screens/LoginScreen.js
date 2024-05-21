// LoginScreen.js

import { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  onAuthStateChanged,
} from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebase-config";
import { UserContext } from "../contexts/UserContext";

import Icon from "react-native-vector-icons/FontAwesome";

import { COLORS } from "../themes/DarkTheme";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;
  const { setUserId } = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && !user.emailVerified) {
        Alert.alert(
          "Error",
          "Por favor, verifica tu correo electrónico antes de iniciar sesión."
        );
        await signOut();
      }
    });
    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      setUserId(response.user.uid);
      console.log("Usuario autenticado con éxito. ID:", response.user.uid);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Correo electrónico o contraseña incorrectos.");
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.log(error);
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
          <Text style={styles.title}>Acceso</Text>
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
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={toggleShowPassword}
            style={styles.iconContainer}
          >
            <Icon
              name={showPassword ? "eye-slash" : "eye"}
              size={18}
              color="#323032" //TODO: Cambia el color del icono aquí
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
            onPress={() => signIn()}
          >
            <Text style={{ fontSize: 16, color: "white" }}>Acceder</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => navigation.navigate("RegisterScreen")}
          style={styles.signInContainer}
        >
          <Text style={styles.signInText}>¿No tienes cuenta? Regístrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

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
