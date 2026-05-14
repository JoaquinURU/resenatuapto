/* =========================
   FIREBASE CONFIG
========================= */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyA5_JnGZX2Wslt5sPN07vK2tjcugHgaZOY",
    authDomain: "resenatuapto.firebaseapp.com",
    projectId: "resenatuapto",
    storageBucket: "resenatuapto.firebasestorage.app",
    messagingSenderId: "510772551124",
    appId: "1:510772551124:web:859233d6f5a44c8e074a41"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };