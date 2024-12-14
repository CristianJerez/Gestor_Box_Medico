import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAbAhnKboDvRjRAjfr8tgKE_Of7mbzMXeo",
    authDomain: "pruebacaso1-b55b1.firebaseapp.com",
    projectId: "pruebacaso1-b55b1",
    storageBucket: "pruebacaso1-b55b1.firebasestorage.app",
    messagingSenderId: "491868773676",
    appId: "1:491868773676:web:10c3bc1ab090c013256089",
    measurementId: "G-CPZQR6PLDM"
});

export const auth = firebaseApp.auth();
export const db = firebaseApp.firestore();
export const storage = firebaseApp.storage();

export default firebaseApp;