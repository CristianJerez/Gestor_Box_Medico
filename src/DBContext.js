import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";

const DBContext = {
  // Login de usuario
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "usuarios", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        return {
          id: user.uid,
          email: userData.email,
          nombre: userData.nombre,
          rol: userData.rol,
        };
      } else {
        throw new Error("No se encontraron datos del usuario en Firestore.");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      await signOut(auth);
      console.log("Sesión cerrada correctamente.");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    }
  },

  // Obtener usuarios
  async getUsers() {
    try {
      const usersCollectionRef = collection(db, "usuarios");
      const querySnapshot = await getDocs(usersCollectionRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
      throw error;
    }
  },

  // Crear usuario
  async addUser({ email, password, nombre, rol }) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userId = userCredential.user.uid;

      await setDoc(doc(db, "usuarios", userId), {
        email,
        nombre,
        rol,
      });
      console.log("Usuario creado exitosamente.");
      return true;
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
      throw error;
    }
  },

  // Editar usuario
  async editUser(id, updatedData) {
    if (!id || !updatedData) {
      console.error("ID o datos no proporcionados para editar el usuario.");
      throw new Error("Datos insuficientes para la actualización.");
    }
    try {
      await updateDoc(doc(db, "usuarios", id), updatedData);
      console.log(`Usuario con ID ${id} actualizado exitosamente.`);
    } catch (error) {
      console.error("Error al actualizar usuario:", error.message);
      throw error;
    }
  },

  // Eliminar usuario
  async deleteUser(id) {
    try {
      await deleteDoc(doc(db, "usuarios", id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  },

  // Obtener pasillos
  async getPasillos() {
    try {
      const pasillosCollectionRef = collection(db, "pasillos");
      const q = query(pasillosCollectionRef, orderBy("numero_pasillo", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error al obtener pasillos:", error.message);
      throw error;
    }
  },

  async getPasillo(idPasillo) {
    try {
      const CollectionRef = collection(db, "pasillos");
      const q = query(CollectionRef, where("numero_pasillo", "==", idPasillo));
      const data = await getDocs(q);
      const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return response;
    } catch (error) {
      console.error("Error al obtener el pasillo:", error);
      throw error;
    }
  },

  // Crear pasillo
  async addPasillo(pasilloData) {
    try {
      console.log("Datos enviados a Firestore:", pasilloData);
      const pasillosCollectionRef = collection(db, "pasillos");
      const docRef = await addDoc(pasillosCollectionRef, pasilloData);
      console.log(`Pasillo creado exitosamente con ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Error al crear pasillo:", error.message);
      throw error;
    }
  },

  // Editar pasillo
  async editPasillo(id, updatedData) {
    if (!id || !updatedData) {
      console.error("ID o datos no proporcionados para editar el pasillo.");
      throw new Error("Datos insuficientes para la actualización.");
    }
    try {
      console.log(`Actualizando pasillo con ID: ${id}`, updatedData);
      await updateDoc(doc(db, "pasillos", id), updatedData);
      console.log(`Pasillo con ID ${id} actualizado exitosamente.`);
    } catch (error) {
      console.error("Error al actualizar pasillo:", error.message);
      throw error;
    }
  },

  // Eliminar pasillo
  async deletePasillo(id) {
    if (!id) {
      console.error("ID no proporcionado para eliminar el pasillo.");
      throw new Error("ID no válido.");
    }
    try {
      console.log(`Eliminando pasillo con ID: ${id}`);
      await deleteDoc(doc(db, "pasillos", id));
      console.log(`Pasillo con ID ${id} eliminado exitosamente.`);
    } catch (error) {
      console.error("Error al eliminar pasillo:", error.message);
      throw error;
    }
  },

  async getBoxes() {
    try {
      const boxesCollectionRef = collection(db, "boxes");
      const q = query(boxesCollectionRef, orderBy("numero", "asc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error al obtener boxes:", error.message);
      throw error;
    }
  },

  async getBox(idBox) {
    try {
      const boxDocRef = doc(db, "boxes", idBox);
      const boxDoc = await getDoc(boxDocRef);
      if (boxDoc.exists()) {
        return { id: boxDoc.id, ...boxDoc.data() };
      } else {
        throw new Error("Box no encontrado");
      }
    } catch (error) {
      console.error("Error al obtener el box:", error);
      throw error;
    }
  },

  async findBox(numerobox, idPasillo) {
    try {
      console.log("entro find", numerobox, idPasillo);
      const CollectionRef = collection(db, "boxes");
      const q = query(
        CollectionRef,
        where("numero", "==", numerobox),
        where("pasilloId", "==", idPasillo)
      );
      const data = await getDocs(q);
      console.log("find", data);
      const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return response;
    } catch (error) {
      console.error("Error al buscar box:", error);
      throw error;
    }
  },

  async addBox(boxData) {
    try {
      const boxesCollectionRef = collection(db, "boxes");
      const docRef = await addDoc(boxesCollectionRef, boxData);
      console.log(`Box creado con ID: ${docRef.id}`);
      return docRef.id;
    } catch (error) {
      console.error("Error al crear el box:", error.message);
      throw error;
    }
  },

  async editBox(id, updatedData) {
    try {
      const boxRef = doc(db, "boxes", id);
      await updateDoc(boxRef, updatedData);
      console.log(`Box con ID ${id} actualizado.`);
    } catch (error) {
      console.error("Error al actualizar el box:", error.message);
      throw error;
    }
  },

  async deleteBox(id) {
    try {
      const boxRef = doc(db, "boxes", id);
      await deleteDoc(boxRef);
      console.log(`Box con ID ${id} eliminado.`);
    } catch (error) {
      console.error("Error al eliminar el box:", error.message);
      throw error;
    }
  },
  async getReservas() {
    console.log("entro");
    const CollectionRef = collection(db, "reservas");
    const data = await getDocs(CollectionRef);
    const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    console.log(response);
    return response;
  },

  async getMisReservas(userid) {
    try {
      const CollectionRef = collection(db, "reservas");
      const q = query(CollectionRef, where("usuarioId", "==", userid));
      const data = await getDocs(q);
      const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return response;
    } catch (error) {
      console.error("Error fetching reservations: ", error);
      throw error;
    }
  },

  async getReservasActuales(boxId, fecha) {
    try {
      const CollectionRef = collection(db, "reservas");
      const q = query(
        CollectionRef,
        where("boxId", "==", boxId),
        where("fecha", "==", fecha)
      );
      const data = await getDocs(q);
      const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return response;
    } catch (error) {
      console.error("Error fetching reservations: ", error);
      throw error;
    }
  },

  async getReservasDelDia(fecha) {
    try {
      const CollectionRef = collection(db, "reservas");
      const q = query(CollectionRef, where("fecha", "==", fecha));
      const data = await getDocs(q);
      const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      return response;
    } catch (error) {
      console.error("Error fetching reservations: ", error);
      throw error;
    }
  },

  async addReserva(nuevaReserva) {
    const CollectionRef = collection(db, "reservas");
    await addDoc(CollectionRef, nuevaReserva);
    console.log("Reserva creada con éxito.");
    return true;
  },

  async editReserva(editando, nuevo) {
    await updateDoc(doc(db, "reservas", editando), nuevo);
    console.log("Usuario actualizado con éxito.");
  },

  async deleteReserva(id) {
    try {
      await deleteDoc(doc(db, "reservas", id));
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  },
};

export { DBContext };
