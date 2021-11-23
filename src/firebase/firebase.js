import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const firebaseConfig = {
    apiKey: "AIzaSyBF4EiMbyltL7eSZDVde32Zxr_GOWUBe28",
    authDomain: "e-commerce-68753.firebaseapp.com",
    databaseURL: "https://e-commerce-68753-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "e-commerce-68753",
    storageBucket: "e-commerce-68753.appspot.com",
    messagingSenderId: "495331646480",
    appId: "1:495331646480:web:df59911b68677b017fbe95"
}

export class Firebase {
    constructor() {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig)
        } else {
            firebase.app()
        }
        this.database = firebase.database()
        this.auth = firebase.auth()
    }
}