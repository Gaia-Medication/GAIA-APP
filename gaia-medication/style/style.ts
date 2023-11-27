import {
  StyleSheet
} from "react-native";

export const styles = StyleSheet.create({
    container: {
      display: "flex",
      height: "100%",
      backgroundColor:"#fff",
      flex:1,
      gap: 20,
    },
    header: {
      paddingTop: 20,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    },
    notification: {
      width: 50
    },
    searchContainer: {
      display: "flex",
      gap: 10,
      marginHorizontal: 25,
    },
    searchBarwQR: {
      display: "flex",
      gap: 19,
      marginHorizontal: 10,
      flexDirection: "row",
      height: 50,
    },
    searchBar: {
      display: "flex",
      flex: 1,
      backgroundColor: "#A0DB3050",
      borderRadius: 10,
    },
    searchBarInput: {
      display: "flex",
      flex: 1,
      color: "#9CDE00",
      fontSize: 16,
    },
    searchQR: {
      width: 50,
      display: "flex",
      backgroundColor: "#A0DB3050",
      borderRadius: 10,
    },
    traitementContainer: {
      display: "flex",
      marginHorizontal: 25,
    },
    titleContainer: {
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    title: {
      fontSize: 30,
      fontWeight: "600",
      lineHeight: 30,
    },
    title2: {
      fontSize: 20,
      fontWeight: "600",
    },
    subtitle: {
      fontSize: 12,
      color: "#888888",
      fontWeight: "normal",
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: "80%",
    },
  });
  