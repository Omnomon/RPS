

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDCVDH2-nZ4FqIz729OtIeUbW4kiLlRchU",
    authDomain: "pokemon-514c2.firebaseapp.com",
    databaseURL: "https://pokemon-514c2.firebaseio.com",
    projectId: "pokemon-514c2",
    storageBucket: "pokemon-514c2.appspot.com",
    messagingSenderId: "946348086330"
};
firebase.initializeApp(config);

importScripts("https://www.gstatic.com/firebasejs/4.0.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.0.0/firebase-messaging.js");
importScripts("https://www.gstatic.com/firebasejs/4.0.0/init.js");

const messaging = firebase.messaging();