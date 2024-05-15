//console.log('google.auth.js works');

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth, signInWithPopup, setPersistence, GoogleAuthProvider, browserSessionPersistence } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";



const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();



  
  
  
  
  

  setPersistence(auth, browserSessionPersistence)
    .then(() => {
      // Existing and future Auth states are now persisted in the current
      // session only. Closing the window would clear any existing state even
      // if a user forgets to sign out.
      // ...
      // New sign-in will be persisted with session persistence.
      //return signInWithPopup(auth, provider);
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
    });



  function googleAuthJs(callback) {
    const googleBtn = document.getElementById('googleSigninBtn');
  const googleSigninBtnLoading = document.getElementById('googleSigninBtnLoading');
      

      if (googleBtn) {
        callback(true);
        googleBtn.addEventListener('click', function() {
          googleSignIn();
        })
      }
      
      
      
      //function to handle google signin
      function googleSignIn() {
        
        const referralCode = null;
        
        const timestamp = new Date();
        
        
        
        
        
        signInWithPopup(auth, provider, timestamp, referralCode)
          .then(async (result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            
          const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;


            const uid = user.uid
            

            await writeToFirestore(uid, name, provider, timestamp, referralCode);
            //i moved this here to make the user state be known as logged in.
            //alert(user.uid);
            //alert("this is the uid alone :" + uid)
            alert("Account Created")
            openModal();
            window.setTimeout(() => {
              window.location.href = "/acctcreation/login.html";
            }, 3000);
            //window.location.href = "/acctcreation/login.html"

          }).catch((error) => {
            
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            alert(errorMessage);
            //console.error('Google Sign-In Error:', error.message);
            alert('Google Sign-In Error. Please try again.');
          });
      }

    
 }

  async function writeToFirestore(uid, name, provider, timestamp, referralCode) {
    try {
      const docRef = await addDoc(collection(db, "users"), {
        uid: uid,
        name: name,
        provider: provider,
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
      //console.log("db error " + e)
    }
  } 





export { googleAuthJs };