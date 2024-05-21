import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListNotes from "../screens/ListNotes";
import CreateNotes from "../screens/CreateNotes";
import ShowEditNotes from "../screens/ShowEditNotes";
import MarkdownView from "../screens/MarkdownView";

const Stack = createNativeStackNavigator();

const AuthenticatedStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ListNotes"
        component={ListNotes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateNotes"
        component={CreateNotes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ShowEditNotes"
        component={ShowEditNotes}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MarkdownView"
        component={MarkdownView}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthenticatedStack;
