// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/database";

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCzyi-4Y5yBjwveM_pYb8RVgNJyuO65wtY",
    authDomain: "todo-db-cb16f.firebaseapp.com",
    databaseURL: "https://todo-db-cb16f.firebaseio.com",
    projectId: "todo-db-cb16f",
    storageBucket: "todo-db-cb16f.appspot.com",
    messagingSenderId: "421000210131",
    appId: "1:421000210131:web:ffa8d8d63ba3110c60d626"
};

firebase.initializeApp(firebaseConfig);
let database = firebase.database();
let uid = 'Anonymous'

function configureDatabase(user) {
    uid = user;
}

function dbRead() {
    console.log("Reading database...");
    console.log(database.ref(`users/${uid}`).once('value'));
    /*return database.once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
    });*/     
}

function dbWrite(object) {
    let ret = true;
    database.ref(`users/${uid}`).push(object, function(error) {
        if (error) {
          // The write failed...
          ret = true;
        }
        else {
          // Data saved successfully!
          ret = false;
        }
    });
    return ret;
}

export {configureDatabase, dbWrite, dbRead};