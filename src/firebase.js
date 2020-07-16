// Basic default Reference firebase setup

import firebase from "firebase";

const firebaseApp = firebase.initializeApp({

    //from Firebase config website
    apiKey: "AIzaSyDurzVCGhHbeZUn-BCZxy0cLavsfpnRUtI",
    authDomain: "instagram-clone-react-52896.firebaseapp.com",
    databaseURL: "https://instagram-clone-react-52896.firebaseio.com",
    projectId: "instagram-clone-react-52896",
    storageBucket: "instagram-clone-react-52896.appspot.com",
    messagingSenderId: "333891082464",
    appId: "1:333891082464:web:e096ab48006d1f30449885"
    //from Firebase config website
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };

// export default db;