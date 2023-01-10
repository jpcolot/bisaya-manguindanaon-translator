// import firebase from "firebase/compat/app";
// import { initializeApp } from 'firebase/app';
// import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
// import { getAuth } from 'firebase/auth'

// // Follow this pattern to import other Firebase services
// // import { } from 'firebase/<service>';

// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyB2z5JVzPW1twthbHHsGBJ5AMCOqb_AODc",
//     authDomain: "school-system-3e3cb.firebaseapp.com",
//     projectId: "school-system-3e3cb",
//     storageBucket: "school-system-3e3cb.appspot.com",
//     messagingSenderId: "835409098108",
//     appId: "1:835409098108:web:10b47eb12462370d2de0f9"
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// // const auth = getAuth(app);
// const auth = firebase.auth();


// export { app, db, auth }


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { collection, getDocs } from 'firebase/firestore'
import { getStorage } from "firebase/storage";




// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD4wDKUf1ah9Cru7uQbjeZDPvG1PXlfO2g",
  authDomain: "maguindanao-translator-12b00.firebaseapp.com",
  projectId: "maguindanao-translator-12b00",
  storageBucket: "maguindanao-translator-12b00.appspot.com",
  messagingSenderId: "433229051321",
  appId: "1:433229051321:web:033c7d4bf58bfc4f303268"
};



const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = getStorage(firebaseApp);

export { db, auth, storage };

// sudo npm install -g firebase-tools



