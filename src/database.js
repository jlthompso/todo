export {configureDatabase, dbWrite, dbRead, dbReadTask, dbUpdate, dbDelete, updateStatus, dbCreateProject};

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

function dbRead(project) {
    let ret;

    if (project === undefined) {
        ret = database.ref(`users/${uid}`).once('value');
    }
    else {
        ret = database.ref(`users/${uid}/${project}`).once('value');
    }

    return ret;
}

function dbReadTask(project, key) {
    return database.ref(`users/${uid}/${project}/${key}`).once('value');
}

function dbWrite(project, object) {
    return database.ref(`users/${uid}/${project}`).push(object).key;
}

function dbUpdate(project, key, object) {
    database.ref(`users/${uid}/${project}/${key}`).set(object);
}

function dbDelete(project, key) {
    if (key === undefined) {
        database.ref(`users/${uid}/${project}`).set(null);
    }
    else {
        database.ref(`users/${uid}/${project}/${key}`).set(null);
    }
}

function updateStatus(project, key, status) {
    database.ref(`users/${uid}/${project}/${key}`).child('status').set(status);
}

function dbCreateProject(name) {
    database.ref(`users/${uid}/${name}`).set(false);
}