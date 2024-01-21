import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAwqpJ6Xln7u48MgW_nYp6pZDUWVEsIdR8",
  authDomain: "in-an-hung-nguyet.firebaseapp.com",
  projectId: "in-an-hung-nguyet",
  storageBucket: "in-an-hung-nguyet.appspot.com",
  messagingSenderId: "694470139934",
  appId: "1:694470139934:web:c64e100dbb763d95100e0f",
  measurementId: "G-X4X1PWRW9T",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage();
