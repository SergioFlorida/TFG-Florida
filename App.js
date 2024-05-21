import React from "react";
import { ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { UserContextProvider } from "./src/contexts/UserContext";

import useAuth from "./src/hooks/useAuth";
import AuthenticatedStack from "./src/navigation/AuthenticatedStack";
import UnauthenticatedStack from "./src/navigation/UnauthenticatedStack";

function App() {
  const { loading, userVerified } = useAuth();

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <UserContextProvider>
      <NavigationContainer>
        {userVerified ? <AuthenticatedStack /> : <UnauthenticatedStack />}
      </NavigationContainer>
    </UserContextProvider>
  );
}

export default App;
