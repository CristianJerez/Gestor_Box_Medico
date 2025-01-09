import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";

const DBContext = {
  async login(email, password) {
    try {
      // Autenticación del usuario con Firebase
      const userCredential = await auth.signInWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user; // Obtenemos el usuario autenticado

      // Consultamos Firestore para verificar el rol del usuario
      const userDoc = await db.collection("usuarios").doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data(); // Obtenemos los datos del usuario desde la base de datos

        // Redirigimos al panel correspondiente según el rol del usuario
        const myUser = {
          id: userData.id,
          email: userData.email,
          nombre: userData.nombre,
          rol: userData.rol,
        };
        if (myUser) {
          return myUser;
        } else {
          throw new Error("Rol de usuario no definido correctamente.");
        }
      } else {
        throw new Error("Usuario no encontrado en la base de datos.");
      }
    } catch (err) {
      // Manejamos errores al iniciar sesión, como usuario o contraseña incorrectos
      throw new Error(
        "Error al iniciar sesión: " +
          (err.code === "auth/user-not-found"
            ? "Usuario no registrado."
            : err.message)
      );
    }
    // const user = Usuarios.find(
    //     (user) => user.email === email && user.password === password
    // );
    // console.log("dbcontext", user);
    // if (user) {
    //     return user;
    // } else {
    //     throw new Error("Usuario o contraseña incorrecta");
    // }
  },

  async getUsers() {
    const pasillosCollectionRef = collection(db, "usuarios");
    const data = await getDocs(pasillosCollectionRef);
    const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return response;
  },

  async addUser(nuevoUsuario) {
    const CollectionRef = collection(db, "usuarios");
    await addDoc(CollectionRef, nuevoUsuario);
    console.log("Usuario creado con éxito.");
    return true;
  },

  async editUser(editando, nuevo) {
    await updateDoc(doc(db, "usuarios", editando), nuevo);
    console.log("Usuario actualizado con éxito.");
  },

  async deleteUser(id) {
    try {
      await deleteDoc(doc(db, "usuarios", id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  },

  async getBoxes() {
    const boxesCollectionRef = collection(db, "boxes");
    const data = await getDocs(boxesCollectionRef);
    const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return response;
  },

  async addBox(nuevoBox) {
    const boxesCollectionRef = collection(db, "boxes");
    await addDoc(boxesCollectionRef, nuevoBox);
    alert("Box creado con éxito.");
    return true;
  },

  async editBox(editando, nuevoBox) {
    await updateDoc(doc(db, "boxes", editando), nuevoBox);
    alert("Box actualizado con éxito.");
  },

  async deleteBox(id) {
    try {
      await deleteDoc(doc(db, "boxes", id));
    } catch (error) {
      console.error("Error al eliminar el box:", error);
    }
  },

  async getPasillos() {
    const pasillosCollectionRef = collection(db, "pasillos");
    const data = await getDocs(pasillosCollectionRef);
    const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return response;
  },

  async addPasillo(pasillo) {
    const boxesCollectionRef = collection(db, "pasillos");
    await addDoc(boxesCollectionRef, pasillo);
    console.log("Pasillo creado con éxito.");
    return true;
  },

  async editPasillo(editando, nuevo) {
    await updateDoc(doc(db, "pasillos", editando), nuevo);
    console.log("Pasillo actualizado con éxito.");
  },

  async deletePasillo(id) {
    try {
      await deleteDoc(doc(db, "pasillos", id));
    } catch (error) {
      console.error("Error al eliminar el pasillo:", error);
    }
  },

async obtenerDatosPasillo (pasilloId) {
  try {
    const pasilloDocRef = doc(db, "pasillos", pasilloId);
    const pasilloDoc = await getDoc(pasilloDocRef);

    if (pasilloDoc.exists()) {
      return {
        numero: pasilloDoc.data().numero_pasillo,
        nombre: pasilloDoc.data().nombre,
      };
    } else {
      return { numero: "Desconocido", nombre: "Desconocido" };
    }
  } catch (error) {
    console.error("Error al obtener datos del pasillo:", error.message);
    return { numero: "Desconocido", nombre: "Desconocido" };
  }
},

};
export { DBContext };
