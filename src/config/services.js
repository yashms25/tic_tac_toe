import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
const getusername = async (email) => {
  let name = "";
  const q2 = query(
    collection(getFirestore(), "users"),
    where("email", "==", email)
  );
  const querySnapshot1 = await getDocs(q2);
  querySnapshot1.forEach((doc) => {
    name = doc.data().username;
  });
  return name;
};

export { getusername };
