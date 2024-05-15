//console.log('payment-code.js is working')

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection, addDoc, doc, updateDoc, query, where, getDocs, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const user = auth.currentUser;
const paymentSuccessfulModal = document.getElementById('paymentSuccessfulModal');

const purchaseBtn1 = document.getElementById('purchaseBtn1');
const purchaseBtn1Loading = document.getElementById('purchaseBtn1Loading');

const purchaseBtn2 = document.getElementById('purchaseBtn2');

const purchaseBtn3 = document.getElementById('purchaseBtn3');



/* Payment Modal */
const body = document.querySelector(".body")
const paymtModal = document.querySelector(".paymtModal");
const overlay = document.querySelector(".overlay");
const openPayMtModal = function() {
  paymtModal.classList.remove("hidden");
  overlay.classList.remove("hidden");
  body.classList.add("bodyForModal")
};
  /*to make tge pg scrollable first*/
const openPgScroll = function() {
  body.classList.remove("bodyForModal")
}
const closePayMtModal = function() {
  paymtModal.classList.add("hidden")
  overlay.classList.add("hidden");
  body.classList.remove("bodyForModal");
};



function netflixBtnLoading() {
  purchaseBtn1.classList.add('hidden');
  purchaseBtn1Loading.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', (event) => {
  /*to make tge pg scrollable first*/
  openPgScroll();
  //netflix
  purchaseBtn1.addEventListener('click', netflixfunction);
  
  //showmax
  purchaseBtn2.addEventListener('click', showmaxfunction);
  
  //Spotify
  purchaseBtn3.addEventListener('click', spotifyfunction);
  
})


function netflixfunction() {
  //to make it accessible to all
  onAuthStateChanged(auth, (user) => {
    if (user) {
      
      payWithPaystack(user);
      
    } else {
      window.location.href = "/acctcreation/signup.html";
      //console.log("User is not authenticated. from the dom content code in payment");
    }
  });
}


//Netflix payment Code
function payWithPaystack(user) {
  
  const amount = 2500;
  
  let handler = PaystackPop.setup({
    key: 'pk_live_7638b08781b117a253f8a3018a23725dbc713f83', // Replace with your public key
    email: user.email,
    amount: amount.valueOf() * 100,
      // label: "Optional string that replaces customer email"
    plan: 'PLN_4gua1f2jky90s67',
    onClose: function() {
      alert('Window closed.');
    },
    callback: function(response) {
      
      let message = 'Payment complete! Reference: ' + response.reference;
      alert(message);
      
      //creating a timestamp
      const time = new Date();
      let timestamp = time.toISOString();
      
      queryForDocumentsa(user, db, timestamp);
    }
  });

  handler.openIframe();
}



//netflix forestoreDB code
async function queryForDocumentsa(user, db, timestamp) {
  try {
    // Create a reference to the cities collection
    const usersRef = collection(db, "users");
    
    // Create a query against the collection.
    const q = query(usersRef, where("uid", "==", user.uid));
    
    // Execute the query and get the snapshot of the result, to retive the query document 
    const querySnapshot = await getDocs(q);
    
    // Iterate through the documents in the snapshot
    querySnapshot.forEach(async (doc) => {
      //console.log(doc.id, " => ", doc.data());
    
    // Update a specific field in the document
    const docRef = doc.ref; // Get reference to the document
    await updateDoc(docRef, { netflixSubStatus: true }); 
    await updateDoc(docRef, { successfullNetflixSubTimeStamp: timestamp
    });
    purchaseBtn1.classList.add('hidden');
    purchaseBtn1Loading.classList.add('hidden');
      alert('Payment Successful');
      
      openPayMtModal();
    });
  } catch (e) {
    //console.log("changine substate error" + e)
  }
   
}






//Showmax Code
function showmaxfunction() {
  //to make it accessible to all
  onAuthStateChanged(auth, (user) => {
    if (user) {

      const userEmail = user.email;
      alert(userEmail)
      //console.log(userEmail + 'this js from payment code place');
      payWithPaystack2(user);

    } else {
      window.location.href = "/acctcreation/signup.html";
      //console.log("User is not authenticated. from the dom content code in payment");
    }
  });
}


//Showmax Payment Function 
function payWithPaystack2(user ) {
  
  const amount = 1799;
  const userEmail = user.email;
  
  let handler = PaystackPop.setup({
    key: 'pk_live_7638b08781b117a253f8a3018a23725dbc713f83', // Replace with your public key
      email: userEmail,
      amount: amount.valueOf() * 100, // the amount value is multiplied by 100 to convert to the lowest currency unit
      plan: 'PLN_0sjqpfz0acs3jii',
      currency: 'NGN',
    // label: "Optional string that replaces customer email"
    onClose: function(){
      alert('Window closed.');
    },
    callback: function(response){
      
      let message = 'Payment complete! Reference: ' + response.reference;
      alert(message);
      
      // Creating a timestamp
      const time = new Date();
      let timestamp = time.toISOString();
      
      //yourFunction(timestamp, user);
      queryForDocumentsb(user, db, timestamp);
    }
  });

  handler.openIframe();
}


//Showmax code to write to firestoreDB
async function queryForDocumentsb(user, db, timestamp) {
  
  const userUid = user.uid
  try {
    // Create a reference to the cities collection
    const usersRef = collection(db, "users");
    
    // Create a query against the collection.
    const q = query(usersRef, where("uid", "==", userUid));
    
    // Execute the query and get the snapshot of the result, to retive the query document 
    const querySnapshot = await getDocs(q);
    
    // Iterate through the documents in the snapshot
    querySnapshot.forEach(async (doc) => {

      //console.log(doc.id, " => ", doc.data());
      // Update a specific field in the document
      const docRef = doc.ref; // Get reference to the document
    
      await updateDoc(docRef, { showmaxSubStatus: true }); 
      await updateDoc(docRef, { successfullShowmaxSubTimeStamp: timestamp
      });
      
    alert('paymentSuccessful');
    openPayMtModal();
    });
  } catch (e) {
    //console.log("changine substate error" + e)
  }
   
}


//Spotify Code
function spotifyfunction() {
  //to make it accessible to all
  onAuthStateChanged(auth, (user) => {
    if (user) {

      payWithPaystack3(user);

    } else {
      window.location.href = "/acctcreation/signup.html";
      //console.log("User is not authenticated. from the dom content code in payment");
    }
  });
}

 function payWithPaystack3(user) {
  //payment amount
  const amount = 600;


  let handler = PaystackPop.setup({
    
    key: 'pk_live_7638b08781b117a253f8a3018a23725dbc713f83', // Replace with your public key
    email: user.email,
    amount: amount.valueOf() * 100,
    // label: "Optional string that replaces customer email"
    plan: 'PLN_syzmmtdrjnbr9k8',
    onClose: function() {
      
      alert(' Payment Cancelled');
    },
    callback: function(response) {
      
      let message = 'Payment complete! Reference: ' + response.reference;
      alert(message);
      //creating a timestamp
      const time = new Date();
      let timestamp = time.toISOString();
      
      queryForDocumentsc(user, db, timestamp);
      
      
    }
    
  });

  handler.openIframe();
}


//spotify FirestoreDB wroting code 
async function queryForDocumentsc(user, db, timestamp) {
  
    
  try {
    // Create a reference to the cities collection
    const usersRef = collection(db, "users");
    
    // Create a query against the collection.
    const q = query(usersRef, where("uid", "==", user.uid));
    
    // Execute the query and get the snapshot of the result, to retive the query document 
    const querySnapshot = await getDocs(q);
    
    // Iterate through the documents in the snapshot
    querySnapshot.forEach(async (doc) => {

      //console.log(doc.id, " => ", doc.data());
      // Update a specific field in the document
      const docRef = doc.ref; // Get reference to the document
    
      await updateDoc(docRef, { spotifySubStatus: true }); 
      await updateDoc(docRef, { successfullSpotifySubTimeStamp: timestamp
      });
      alert('paymentSuccessful');
      
      openPayMtModal();
      
      
    });
  } catch (e) {
    
    //console.log("changine substate error" + e)
  }
   
   
}


