import {
  StyleSheet
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
    flex: 1,
    gap: 20,
  },
  header: {
    width: "100%",
    paddingTop: 20,
    paddingHorizontal: "5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  AvatarIcon: {
    width: 45,
    height: 45,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 25,
    fontSize: 24,
    fontWeight: "900",
    color: "white",
  },
  avatarText: {
    fontSize: 16,
  },
  chevron: {
    backgroundColor: "#F1F1F1",
    borderRadius: 50,
  },
  bar: {
    backgroundColor: "#E0E0E0",
    height: 25,
    width: 2,
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
  searchBarContainer: {
    borderBottomWidth: 0,
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
    justifyContent: "center",
    alignItems: "center",
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
  profileHighlight: {
    color: "#4296E4",
    backgroundColor: "#4296E450",
    borderRadius: 15,
    padding: 4,
    paddingLeft: 6,
    paddingRight: 6,
  },
  profileNoHighlight: {
    color: "#4296E4",
    borderRadius: 15,
    padding: 4,
    paddingLeft: 6,
    paddingRight: 6,
  },
  listItem: {
    backgroundColor: '#ffffff', 
    padding: 15,
    borderBottomWidth: 1, 
    borderBottomColor: '#dddddd', 
    display:"flex",
    flexDirection: "row",
    alignItems:"center"
  },
  listItemText: {
    fontSize: 18, 
    color: '#333333', 
  },
  modal: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
