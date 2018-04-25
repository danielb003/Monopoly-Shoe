import firebase from 'firebase';

// Initialize Firebase
// Daniel's DB
// const config = {
//     apiKey: "AIzaSyAvWYiVSH2CzepYSANoe-1T_7tA9hrIQAQ",
//     authDomain: "programming-project-01-3438e.firebaseapp.com",
//     databaseURL: "https://programming-project-01-3438e.firebaseio.com",
//     projectId: "programming-project-01-3438e",
//     storageBucket: "programming-project-01-3438e.appspot.com",
//     messagingSenderId: "141480863825"
// };

// Seth's DB
var config = {
    apiKey: "AIzaSyCuWJ1oii7W52PvVUvGZjl03FuavxApXdE",
    authDomain: "pp1-project-5de58.firebaseapp.com",
    databaseURL: "https://pp1-project-5de58.firebaseio.com",
    projectId: "pp1-project-5de58",
    storageBucket: "pp1-project-5de58.appspot.com",
    messagingSenderId: "909893903732"
};

const app = firebase.initializeApp(config);

export { app }