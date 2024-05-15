//console.log('auth');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/*import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js"; */
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const userNameNav = document.getElementById('userNameNav');
const signOutBtn = document.getElementById('signOutBtn');
const signInBtn = document.getElementById('signInBtn');
const navSubBtn = document.getElementById('navSubBtn');

 function updateEmail(user) {
  let text = userNameNav.innerHTML;
  document.getElementById('userNameNav').innerHTML = text.replace("signedinuser@gmail.com", user.email);
} 


function navelements() {
  //user is signed in
  userNameNav.style.display = "block";
  signOutBtn.style.display = "block";
  signInBtn.style.display = "none";
  navSubBtn.style.display = "block"
}

function navelementselse() {
  //user is signed out
  userNameNav.style.display = "none";
  signOutBtn.style.display = "none";
  signInBtn.style.display = "block";
  navSubBtn.style.display = "none"
}

function authJs(callback) {
  onAuthStateChanged(auth, (user) => {
    
    if (user) {
      const uid = user.uid;
      //console.log(user.uid);
      //console.log(user.email);
      navelements();
      updateEmail(user);
      
      callback(true);
    
    } else {
      // User is signed out or authentication failed
      //console.log("Authentication failed or user signed out");
      navelementselse();
    
      callback(true);
    }
  }, (error) => {
    //console.error("onAuthStateChanged error:", error);
    
    callback(false);
  });

}

export{ authJs };