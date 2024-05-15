//loader.js console.log('loader.js')


import { authJs } from '/auth.js';
import { googleAuthJs } from '/google-auth.js';
import { buttonStatesJsFile } from '/buttonStates.js';
import {signOutCallback, signInCallback, signUpCallback } from '/email-password-auth.js';





/* for the loader*/
const overlayForLoader = document.querySelector(".overlayForLoader");


function hideLoader() {
  overlayForLoader.classList.add('hidden');
}

function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
}







authJs((isUserAuthenticated) => {
  if (isUserAuthenticated) {
    hideLoader(); // Hide the loader if the user is authenticated
  } else {
    // Handle the case where the user is not authenticated
    //console.log('no hudeLoader')
  }
});




buttonStatesJsFile((returnCallback) => {
  if (returnCallback) {
    window.setTimeout(() => {
      hideLoader();
    }, 3000);
    //console.log('hideLoader')
  } else {
    showLoader();
    //console.log('no hideloader')
  }
})




