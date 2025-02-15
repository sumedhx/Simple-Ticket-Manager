import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCYVi7ORqiCFKf5-dz9n-ONJAHYOi3U9Cw",
  authDomain: "simple-ticket-manager.firebaseapp.com",
  projectId: "simple-ticket-manager",
  storageBucket: "simple-ticket-manager.appspot.com",
  messagingSenderId: "845296528005",
  appId: "1:845296528005:web:4f16a11c54ec88e19a57ec",
  measurementId: "G-6RM2DRHZ86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); 

export { app, auth, db , storage};








// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import App from "./App";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCYVi7ORqiCFKf5-dz9n-ONJAHYOi3U9Cw",
//   authDomain: "simple-ticket-manager.firebaseapp.com",
//   projectId: "simple-ticket-manager",
//   storageBucket: "simple-ticket-manager.firebasestorage.app",
//   messagingSenderId: "845296528005",
//   appId: "1:845296528005:web:4f16a11c54ec88e19a57ec",
//   measurementId: "G-6RM2DRHZ86"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);