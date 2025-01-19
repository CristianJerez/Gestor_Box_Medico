import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
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
      const userDoc = await getDoc(doc(db, "usuarios", user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data(); // Obtenemos los datos del usuario desde la base de datos
        return {
          id: user.uid,
          email: userData.email,
          nombre: userData.nombre,
          rol: userData.rol,
        };
      } else {
        throw new Error("Usuario no encontrado en la base de datos.");
      }
    } catch (err) {
      throw new Error(
        "Error al iniciar sesión: " +
          (err.code === "auth/user-not-found"
            ? "Usuario no registrado."
            : err.message)
      );
    }
  },

  async getUsers() {
    const usersCollectionRef = collection(db, "usuarios");
    const data = await getDocs(usersCollectionRef);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  },

  async addUser(nuevoUsuario) {
    const usersCollectionRef = collection(db, "usuarios");

    // Asegurarnos de que email y password están presentes
    const { email, password, ...userData } = nuevoUsuario;

    if (!email || !password) {
      throw new Error(
        "Email y contraseña son obligatorios para registrar un usuario."
      );
    }

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const userId = userCredential.user.uid;

      // Guardar los datos adicionales en Firestore
      await addDoc(usersCollectionRef, { ...userData, email, id: userId });
      console.log("Usuario creado con éxito.");
      return true;
    } catch (error) {
      console.error("Error al crear el usuario:", error.message);
      throw new Error("No se pudo registrar el usuario: " + error.message);
    }
  },

  async editUser(editando, nuevo) {
    await updateDoc(doc(db, "usuarios", editando), nuevo);
    console.log("Usuario actualizado con éxito.");
  },

  async deleteUser(id) {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      console.log("Usuario eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el usuario:", error.message);
    }
  },

  async getBoxes() {
    const boxesCollectionRef = collection(db, "boxes");
    const data = await getDocs(boxesCollectionRef);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  },

  async getBox(idBox) {
    try {
      const boxDoc = await getDoc(doc(db, "boxes", idBox));
      if (boxDoc.exists()) {
        return { id: boxDoc.id, ...boxDoc.data() };
      } else {
        throw new Error("Box no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener el box:", error.message);
      throw error;
    }
  },

  async addBox(nuevoBox) {
    const boxesCollectionRef = collection(db, "boxes");
    await addDoc(boxesCollectionRef, nuevoBox);
    console.log("Box creado con éxito.");
    return true;
  },

  async editBox(editando, nuevoBox) {
    await updateDoc(doc(db, "boxes", editando), nuevoBox);
    console.log("Box actualizado con éxito.");
  },

  async deleteBox(id) {
    try {
      await deleteDoc(doc(db, "boxes", id));
      console.log("Box eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el box:", error.message);
    }
  },

  async getPasillos() {
    const pasillosCollectionRef = collection(db, "pasillos");
    const data = await getDocs(pasillosCollectionRef);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  },

  async getPasillo(idPasillo) {
    try {
      const pasilloDoc = await getDoc(doc(db, "pasillos", idPasillo));
      if (pasilloDoc.exists()) {
        return { id: pasilloDoc.id, ...pasilloDoc.data() };
      } else {
        throw new Error("Pasillo no encontrado.");
      }
    } catch (error) {
      console.error("Error al obtener el pasillo:", error.message);
      throw error;
    }
  },

  async addPasillo(pasillo) {
    const pasillosCollectionRef = collection(db, "pasillos");
    await addDoc(pasillosCollectionRef, pasillo);
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
      console.log("Pasillo eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el pasillo:", error.message);
    }
  },

  async getReservas() {
    const reservasCollectionRef = collection(db, "reservas");
    const data = await getDocs(reservasCollectionRef);
    return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  },

  async getMisReservas(userid) {
    try {
      const reservasCollectionRef = collection(db, "reservas");
      const q = query(reservasCollectionRef, where("usuarioId", "==", userid));
      const data = await getDocs(q);
      return data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
      console.error(
        "Error al obtener las reservas del usuario:",
        error.message
      );
      throw error;
    }
  },

  async addReserva(nuevaReserva) {
    const reservasCollectionRef = collection(db, "reservas");
    await addDoc(reservasCollectionRef, nuevaReserva);
    console.log("Reserva creada con éxito.");
    return true;
  },

  async editReserva(editando, nuevo) {
    await updateDoc(doc(db, "reservas", editando), nuevo);
    console.log("Reserva actualizada con éxito.");
  },

  async deleteReserva(id) {
    try {
      await deleteDoc(doc(db, "reservas", id));
      console.log("Reserva eliminada con éxito.");
    } catch (error) {
      console.error("Error al eliminar la reserva:", error.message);
    }
  },
};

export { DBContext };
