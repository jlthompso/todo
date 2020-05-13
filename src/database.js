export {dbInit, dbWrite, dbRead, dbReadTask, dbUpdate, dbDelete, updateStatus, dbCreateProject};

import {loadPage} from './dom';

// Firebase App (the core Firebase SDK) is always required and must be listed first
import * as firebase from "firebase/app";

// Add the Firebase products that you want to use
import "firebase/database";

let firebaseui = require('firebaseui');

let database;
let uid = 'Anonymous';

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

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.
            document.getElementById('firebaseui-auth-container').style.display = 'none';
            uid = firebase.auth().currentUser.uid;
            dbRead().then(function(snapshot) {
                if (!snapshot.exists()) {
                    dbCreateProject('Default');
                }
                loadPage();
            });
            
            return false;
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            document.getElementById('loader').style.display = 'none';
        }
    },
    // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
    signInFlow: 'popup',
    //signInSuccessUrl: '<url-to-redirect-to-on-success>',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
    ],
};

function dbInit() {
    firebase.initializeApp(firebaseConfig);
    database = firebase.database();
    
    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    // The start method will wait until the DOM is loaded.
    return ui.start('#firebaseui-auth-container', uiConfig);
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