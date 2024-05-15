//console.log('this works 2');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth, setPersistence, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";  */

import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

setPersistence(auth, browserSessionPersistence)
  .then(() => {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    //return signInWithEmailAndPassword(auth, email, password);
  })
  .catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
  });

// function to write to database
/* function writeUserData( name, email) {
  set(ref(db, 'users/' + name), {
    username: user.name,
    email: user.email
  });
} */



// Callback for sign out button
function signOutCallback(callback) {
  return (callback);
}

// Callback for sign up button
function signUpCallback(callback) {
  return (callback);
}

// Callback for sign in button
function signInCallback(callback) {
  return (callback);
}


document.addEventListener('DOMContentLoaded', (event) => {

  // linking to elements 
  const userName = document.getElementById('userName');
  const emailInput = document.getElementById('Email');
  const passwordInput = document.getElementById('Password');
  const signInButton = document.getElementById(
    'signinButton');
  const signinButtonLoading = document.getElementById('signinButtonLoading');
  const signUpButton = document.getElementById(
    'signupButton');
  const signUpButtonLoading = document.getElementById('signupButtonLoading');
  const signOutButton = document.getElementById('signOutBtn');
  const loginForm = document.getElementById('login-form');
  const referralCodeInput = document.getElementById('referralCode');

  /* The account created alert code*/
  const acctCreatedCard = document.querySelector(".acctCreatedCard");
  const overlay = document.querySelector(".overlay");
  const openModal = function() {
    acctCreatedCard.classList.remove("hidden");
    overlay.classList.remove("hidden");
  };


  /* the signup error code*/
  const alertMessage = document.querySelector(".alertMessage");
  const alertCard = document.querySelector(".alert-card");


  function ErrorModal(errorMessage, nullEmail) {
    if (errorMessage) {
      alertMessage.innerHTML = "It seems the error is from an " + errorMessage;
      alertCard.classList.remove("hidden");
    } else if (nullEmail) {
      alertMessage.innerHTML = nullEmail
      alertCard.classList.remove("hidden");
    } else if (signOutMsg) {
      alertMessage.innerHTML = signOutMsg;
      alertCard.classList.remove("hidden");
    }

  }


  //const signOutMsg = "User Signed Out";

  if (signOutButton) {
    signOutCallback(true);
    signOutButton.addEventListener('click', (e) => {
      e.preventDefault();

      auth.signOut().then(() => {
        //ErrorModal(signOutMsg);
        /* console.log('User signed out');
         alert('user Signed Out') */
        window.location.href = "/acctcreation/login.html";

      })
    })
  } else {
    signOutCallback(false);
  }

  if (signUpButton) {
    signUpCallback(true);
    signUpButton.addEventListener('click', async function(event) {
      event.preventDefault(); // Prevent default form submission behavior

      if (validateInputs()) {
        try {
          await handleSignUp();
        } catch (error) {
          //console.log(error);
        }
      }
    });
  } else {
    signUpCallback(false);
  }

  if (signInButton) {
    signInCallback(true);
    signInButton.addEventListener('click', async function(event) {
      event.preventDefault(); // Prevent default form submission behavior

      if (validateInputs()) {

        try {
          await handleSignIn();
        }
        catch (error) {
          //console.log(error);

        }
      }
    });
  } else {
    signInCallback(false);
  }

  //function to toogle the buttonstates from loadjng to normal, i swear this shit is somewhat cibfusing but it works, and i hope you get it
  function toggleButtonState(button, loadingButton, enable) {
    button.classList.toggle('hidden', enable);

    loadingButton.classList.toggle('hidden', !enable);
  }


  function validateInputs() {
    const email = emailInput.value;
    const password = passwordInput.value;
    const nullEmail = " Please fill your email and password ";

    if (!email || !password) {
      ErrorModal(nullEmail);
      alert("Please fill in both email and password.");


      return false;
    }
    return true;
  }

  // handles Signin button action
  function handleSignIn() {
    const email = emailInput.value;
    const password = passwordInput.value;
    toggleButtonState(signInButton, signinButtonLoading, true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        // ...
        //loginForm.reset();
        //console.log("User successfully signed in with UID:", user.uid, user.email);

        // i moved this here to make the user state be known as logged in.
        window.location.href = "/index.html"

      })
      .catch((error) => {
        toggleButtonState(signInButton, signinButtonLoading, false)
        const errorCode = error.code;
        const errorMessage = error.message;
        //console.log(errorCode, errorMessage);
        //console.error("Authentication failed with code:", errorCode, "Message:", errorMessage)
        ErrorModal(errorMessage);

      });

  }




  function handleSignUp() {
    const name = userName.value
    const email = emailInput.value;
    const password = passwordInput.value;
    const referralCode = referralCodeInput.value || null;

    const timestamp = new Date()

    toggleButtonState(signUpButton, signUpButtonLoading, true);

    createUserWithEmailAndPassword(auth, email, password, referralCode)
      //async is after then cause of d await
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const uid = user.uid


        await writeToFirestore(uid, name, email, timestamp, referralCode);
        //i moved this here to make the user state be known as logged in.
        //alert(user.uid);
        //alert("this is the uid alone :" + uid)
        alert("Account Created")
        openModal();
        window.setTimeout(() => {
          window.location.href = "/acctcreation/login.html";
        }, 3000);
        //window.location.href = "/acctcreation/login.html"
      })

      .catch((error) => {
        toggleButtonState(signUpButton, signUpButtonLoading, false);

        const errorCode = error.code;
        const errorMessage = error.message;
       // console.log(errorCode, errorMessage);
       // console.error("Authentication failed with code:", errorCode, "Message:", errorMessage)
        ErrorModal(errorMessage);
      });

  }


  async function writeToFirestore(uid, name, email, timestamp, referralCode) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        uid: uid,
        name: name,
        email: email,
        creationdate: timestamp,

        referralCode: referralCode,

        netflixSubStatus: false,
        successfullNetflixSubTimeStamp: null,
        showmaxSubStatus: false,
        successfullShowmaxSubTimeStamp: null,
        spotifySubStatus: false,
        successfullSpotifySubTimeStamp: null

      });
    } catch (e) {
     // console.log("db error " + e)
    }
  }



})

export { signOutCallback, signInCallback, signUpCallback };