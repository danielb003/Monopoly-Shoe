import firebase from 'firebase';

// Initialize Firebase
const config = {
    apiKey: "AIzaSyAvWYiVSH2CzepYSANoe-1T_7tA9hrIQAQ",
    authDomain: "programming-project-01-3438e.firebaseapp.com",
    databaseURL: "https://programming-project-01-3438e.firebaseio.com",
    projectId: "programming-project-01-3438e",
    storageBucket: "programming-project-01-3438e.appspot.com",
    messagingSenderId: "141480863825"
};

const app = firebase.initializeApp(config);

export { app }