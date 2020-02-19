import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

// const firebaseConfig = {
//     apiKey: "AIzaSyBAL9WEiKUu9fO-W9-vHtLipqoJ_7pARDY",
//     authDomain: "no-excuse-1579439547243.firebaseapp.com",
//     databaseURL: "https://no-excuse-1579439547243.firebaseio.com",
//     projectId: "no-excuse-1579439547243",
//     storageBucket: "no-excuse-1579439547243.appspot.com",
//     messagingSenderId: "247254955127",
//     appId: "1:247254955127:web:c884850b75dc83d3cf8272",
//     measurementId: "G-G4GGLVNS9Y"
// };

// firebase.initializeApp(firebaseConfig);

const firebaseConfig = {
    apiKey: "AIzaSyA6Sorw0PMXhHNpqQ_180jgzPY4g2KPmlk",
    authDomain: "noexcuse2.firebaseapp.com",
    databaseURL: "https://noexcuse2.firebaseio.com",
    projectId: "noexcuse2",
    storageBucket: "noexcuse2.appspot.com",
    messagingSenderId: "558299576504",
    appId: "1:558299576504:web:f53d38a2f466f627351c4d",
    measurementId: "G-SZ1F6J7D0R"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase;