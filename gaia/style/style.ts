import {
  StyleSheet
} from "react-native";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: "100%",
    width: "100%",
  },
  header: {
    width: "100%",
    paddingHorizontal: "5%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    color: "#888888",
    fontWeight: "400",
    fontSize: 16,
  },
  AvatarIcon: {
    width: 45,
    height: 45,
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 25,
    fontSize: 18,
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
    backgroundColor: "#dddddd",
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
  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    padding: 12,
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
    padding: 15,
    borderBottomWidth: 2,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  listItemText: {
    fontSize: 18,
    color: '#333333',
  },
  dropdownInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  dropdownList: {
    maxHeight: 200,
    borderColor: "gray",
    borderWidth: 1,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
  },
  medItems: {
    backgroundColor: "#4296E450",
    borderRadius: 100,
    padding: 10,
  },

  // -------------- MODAL ---------------//

  modalTitle: {
    marginTop: 25,
    fontSize: 20,
    fontWeight: "bold",
  },
  modalType: {
    fontSize: 16,
    fontStyle: "italic",
    marginBottom: 30,
    opacity: 0.5
  },
  modalButton: {
    backgroundColor: "#4296E4",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 20,
    marginBottom: 25

  },

  // -------------- INSTRUCTION ---------------//

  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    padding: 10,
    marginBottom: 5,
  },
  selectAllButton: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  frequencyPicker: {
    backgroundColor: "#4296E450",
    margin: 10,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  loadingContainer: {
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: "100%",
    width: "100%",
  },
  square: {
    flex: 1,
    margin: 8,
    padding: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  customContainer: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "black",
  },
  customContent: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Background color for content with opacity
    padding: 16,
    justifyContent: 'center', // Center content vertically
  },

});
