import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { StyleSheet } from 'react-native';
import Colors from "../../constants/Colors";
import { Text, View } from "../../components/Themed";

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    tabtitle: {
      fontSize: 16,
      fontWeight: '600',
          marginTop:-10,
      color: Colors[colorScheme ?? "light"].tint ,
    },
  });

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        //tabBarActiveBackgroundColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle:{
          marginVertical: 5,
          position:'absolute',
          height:60,
          borderTopWidth: 0,
          justifyContent:'space-between'
        },
        tabBarLabelPosition: "below-icon",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ focused }) => 
            focused ? <Text style={styles.tabtitle}>Accueil</Text> : null,
          tabBarIcon: ({ color }) =>
            <TabBarIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="suivis"
        options={{
          tabBarLabel: ({ focused }) => 
            focused ? <Text style={styles.tabtitle}>Suivis</Text> : null,
          tabBarIcon: ({ color }) => 
            <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="messagerie"
        options={{
          tabBarLabel: ({ focused }) =>
            focused ? <Text style={styles.tabtitle}>Messagerie</Text> : null,
          tabBarIcon: ({ color }) => 
            <TabBarIcon name="envelope" color={color} />
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: ({ focused }) =>
            focused ? <Text style={styles.tabtitle}>Paramètres</Text> : null,
          tabBarIcon: ({ color }) => 
            <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}


