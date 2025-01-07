import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "./FirebaseConfig";

const Usuarios = [
  {
    email: "pancho@chile.cl",
    password: "ab123456",
    role: "admin",
  },
  {
    email: "lolo@chile.cl",
    password: "ab123456",
    role: "solicitante",
  },
];

const Boxes = [
  {
    id: 1,
    name: "Box 1",
    pasillo: "A",
    estado: "Disponible",
    solicitante: "",
    id_pasillo: 1,
  },
  {
    id: 2,
    name: "Box 2",
    pasillo: "A",
    estado: "Disponible",
    solicitante: "",
    id_pasillo: 1,
  },
];

const Solicitudes = [{}];

const Pasillos = [
  {
    id: 1,
    name: "Pasillo A",
    estado: "Disponible",
    solicitante: "",
  },
  {
    id: 2,
    name: "Pasillo B",
    estado: "Disponible",
    solicitante: "",
  },
];

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

  async getPasillo() {
    const pasillosCollectionRef = collection(db, "pasillos");
    const data = await getDocs(pasillosCollectionRef);
    const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return response;
  },

  async getPasillos() {
    const pasillosCollectionRef = collection(db, "pasillos");
    const data = await getDocs(pasillosCollectionRef);
    const response = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    return response;
  },

  async getUsers() {
    return Usuarios;
  },

  async addUser(email, password, role) {
    const user = Usuarios.find((user) => user.email === email);
    if (user) {
      throw new Error("Usuario ya existe");
    } else {
      Usuarios.push({ email, password, role });
      return true;
    }
  },
  async deleteUser(email) {
    const user = Usuarios.find((user) => user.email === email);
    if (user) {
      Usuarios.splice(Usuarios.indexOf(user), 1);
      return true;
    } else {
      throw new Error("Usuario no existe");
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
      alert("Box eliminado con éxito.");
    } catch (error) {
      console.error("Error al eliminar el box:", error);
      alert("Error al eliminar el box.");
    }
  },

  // async getPasillos() {
  //     return Pasillos;
  // },
  async addSolicitud(solicitud) {
    Solicitudes.push(solicitud);
    return true;
  },
  async deleteSolicitud(id) {
    const solicitud = Solicitudes.find((solicitud) => solicitud.id === id);
    if (solicitud) {
      Solicitudes.splice(Solicitudes.indexOf(solicitud), 1);
      return true;
    } else {
      throw new Error("Solicitud no existe");
    }
  },

  async addPasillo(pasillo) {
    Pasillos.push(pasillo);
    return true;
  },
  async deletePasillo(id) {
    const pasillo = Pasillos.find((pasillo) => pasillo.id === id);
    if (pasillo) {
      Pasillos.splice(Pasillos.indexOf(pasillo), 1);
      return true;
    } else {
      throw new Error("Pasillo no existe");
    }
  },
};

export { DBContext };
