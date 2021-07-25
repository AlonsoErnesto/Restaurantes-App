import firebase from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgKz2wnNnAv4uWedabcgCL2HWrGitTYUs",
    authDomain: "apprestaurant-81ebe.firebaseapp.com",
    projectId: "apprestaurant-81ebe",
    storageBucket: "apprestaurant-81ebe.appspot.com",
    messagingSenderId: "614804990836",
    appId: "1:614804990836:web:cd38e8069a73ca98771a21"
  };
  // Initialize Firebase
  export const firebaseApp = firebase.initializeApp(firebaseConfig);