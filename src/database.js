export {configureDatabase, dbWrite, dbRead, dbReadTask, dbUpdate, dbDelete, updateStatus};

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
let uid = 'Anonymous';

function configureDatabase(user) {
    uid = user;
}

function dbRead() {
    return database.ref(`users/${uid}`).once('value');
}

function dbReadTask(key) {
    return database.ref(`users/${uid}/${key}`).once('value');
}

function dbWrite(object) {
    let ret = false;

    let key = database.ref(`users/${uid}`).push(object).key;

    if (key !== undefined) ret = key;

    return ret;
}

function dbUpdate(object, key) {
    database.ref(`users/${uid}/${key}`).set(object);
}

function dbDelete(key) {
    database.ref(`users/${uid}/${key}`).set(null);
}

function updateStatus(key, status) {
    database.ref(`users/${uid}/${key}`).child('status').set(status);
}