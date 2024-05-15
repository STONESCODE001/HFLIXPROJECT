import { googleAuthJs } from '/google-auth.js';
import {signOutCallback, signInCallback, signUpCallback } from '/email-password-auth.js';


/* for the loader*/
const overlayForLoader = document.querySelector(".overlayForLoader");

function hideLoader() {
  overlayForLoader.classList.add('hidden');
}
function showLoader() {
  document.getElementById('loader').classList.remove('hidden');
}


googleAuthJs((returnCallback) => {
  if (returnCallback) {
    hideLoader();
    //console.log('hideLoader')
  } else {
    showLoader();
   // console.log('no hideloader')
  }
})

/*if (signInCallback && signUpCallback && signOutCallback) {
  hideLoader();
} else {
  showLoader();
}*/