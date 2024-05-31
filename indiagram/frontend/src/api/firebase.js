import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyA2333jhchMpXvxFVbSN_LxrpjmonbTizY",
    authDomain: "indiagram-406920.firebaseapp.com",
    projectId: "indiagram-406920",
    storageBucket: "indiagram-406920.appspot.com",
    messagingSenderId: "667880868710",
    appId: "1:667880868710:web:b6b5626c872445e0a1d6a7",
    measurementId: "G-T74SFV2XLG"
  };
  
  const app = initializeApp(firebaseConfig);
  export const bucket =getStorage(app);
  