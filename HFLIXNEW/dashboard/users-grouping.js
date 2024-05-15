//console.log("users -grouping js file is working");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection, addDoc, doc, updateDoc, query, where, getDocs, onSnapshot, getDoc, arrayUnion, increment } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "/firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const user = auth.currentUser;

const netflixLoginEmail = document.getElementById("netflixLoginEmail");
const netflixLoginPassword = document.getElementById("netflixLoginPassword");
const netflixUserPosition = document.getElementById("netflixUserPosition");

const showmaxLoginEmail = document.getElementById("showmaxLoginEmail");
const showmaxLoginPassword = document.getElementById("showmaxLoginPassword");
const showmaxUserPosition = document.getElementById("showmaxUserPosition");
const overlayForLoader = document.querySelector(".overlayForLoader");

document.addEventListener('DOMContentLoaded', (event) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      queryDocuments1(user, db)

    } else {

    }
  });
})


async function queryDocuments1(user, db) {
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
      const docRef = doc.ref;

      // Get reference to the document
      const netflixSubStatus = doc.data().netflixSubStatus;
      const showmaxSubStatus = doc.data().showmaxSubStatus;
      const spotifySubStatus = doc.data().spotifySubStatus;

      //console.log("this is from users-grouping.js" + netflixSubStatus + showmaxSubStatus + spotifySubStatus)

      assignUsersToGroup(netflixSubStatus, showmaxSubStatus, spotifySubStatus, user);

    });
  } catch (e) {
    //console.log("error from user-grouping js" + e)
  }
}


async function assignUsersToGroup(netflixSubStatus, showmaxSubStatus, spotifySubStatus, user) {

  // check netflixsubstatus 
  if (netflixSubStatus === true) {

    //check if the user is already in a Netflix Group
    const netflixGroupQuery = collection(db, "netflixGroup");

    const q = query(netflixGroupQuery, where("members", "array-contains", user.uid));

    // Execute the query and get the snapshot of the result, to retive the query document 
    const querySnapshot = await getDocs(q);

    // Iterate through the documents in the snapshot
    querySnapshot.forEach(async (doc) => {
      //console.log(doc.id, " => ", doc.data());
      // Update a specific field in the document
      const docRef = doc.ref;

      // Get reference to the document
      const accountEmail = doc.data().accountEmail;
      const accountPassword = doc.data().accountPassword;
      const members = doc.data().members;

      //getting users position
      const position = members.indexOf(user.uid) + 1;
      //console.log("this is from users-grouping.js" + accountEmail + accountPassword, position)

      //referencing html dom elements 
      netflixLoginEmail.innerHTML = accountEmail;
      netflixLoginPassword.innerHTML = accountPassword;
      netflixUserPosition.innerHTML = position

    })

    if (querySnapshot.empty) {
      //console.log("User is not a member of any group, checking for available groups...");

      //finding a group with less than 4 members
      const availableGroup = collection(db, "netflixGroup")

      const availableGroupquery = query(availableGroup, where('size', '<', 4))

      const availableGroupquerySnapshot = await getDocs(availableGroupquery)

      if (!availableGroupquerySnapshot.empty) {
        //if the availableGroupquerySnapshot is not empty you join a new group.
        //console.log("Joining an available group...");

        const groupDoc = availableGroupquerySnapshot.docs[0];

        const groupId = groupDoc.id;
        const groupDocRef = groupDoc.ref
        // Add the user to the members array of the group and increment the size

        await updateDoc(groupDocRef, {

          members: arrayUnion(user.uid),
          size: increment(1)
        });

        //console.log("User added to Netflix group:", groupId);
        alert('please kindly refresh this page to load your login info')
      } else {
        //console.log("No available Netflix groups to join, creating a new group...")
        // Create a new group
        const newGroupRef = await addDoc(collection(db, "netflixGroup"), {
          members: [user.uid],
          size: 1
        });
      }
    }

  }

  if (showmaxSubStatus === true) {
    //check if the user is already in a Netflix Group
    const showmaxGroupQuery = collection(db, "showmaxGroup");

    const queryb = query(showmaxGroupQuery, where("members", "array-contains", user.uid));

    // Execute the query and get the snapshot of the result, to retive the query document 
    const querySnapshotb = await getDocs(queryb);

    // Iterate through the documents in the snapshot
    querySnapshotb.forEach(async (doc) => {
      //console.log(doc.id, " => ", doc.data());
      // Update a specific field in the document
      const docRef = doc.ref;

      // Get reference to the document
      const accountEmail = doc.data().accountEmail;
      const accountPassword = doc.data().accountPassword;
      const members = doc.data().members
      const currentUserPosition = members.indexOf(user.uid) + 1

      //console.log("this is from users-grouping.js" + accountEmail + accountPassword)

      //referencing hrml dom elements 
      showmaxLoginEmail.innerHTML = accountEmail;
      showmaxLoginPassword.innerHTML = accountPassword;
      showmaxUserPosition.innerHTML = currentUserPosition;

    })

    if (querySnapshotb.empty) {
      //console.log("User is not a member of any group, checking for available groups...");

      //finding a group with less than 4 members
      const availableGroup = collection(db, "showmaxGroup")

      const availableGroupquery = query(availableGroup, where('size', '<', 4))

      const availableGroupquerySnapshot = await getDocs(availableGroupquery)

      if (!availableGroupquerySnapshot.empty) {
        //if the availableGroupquerySnapshot is not empty you join a new group.
       // console.log("Joining an available group...");

        const groupDoc = availableGroupquerySnapshot.docs[0];

        const groupId = groupDoc.id;
        const groupDocRef = groupDoc.ref
        // Add the user to the members array of the group and increment the size

        await updateDoc(groupDocRef, {

          members: arrayUnion(user.uid),
          size: increment(1)
        });

        //console.log("User added to Showmax group:", groupId);
        alert('please kindly refresh this page to load your login info')
      } else {
        //console.log("No available Showmax groups to join, creating a new group...")
        // Create a new group
        const newGroupRef = await addDoc(collection(db, "showmaxGroup"), {
          members: [user.uid],
          size: 1
        });
      }
    }

  }


  if (spotifySubStatus === true) {
    //check if the user is already in a Spotify Group
    const spotifyGroupQuery = collection(db, "spotifyGroup");

    const queryb = query(spotifyGroupQuery, where("members", "array-contains", user.uid));

    // Execute query and get snapshot of the result, to retive the query document 
    const querySnapshotb = await getDocs(queryb);

    // Iterate through the documents in the snapshot
    querySnapshotb.forEach(async (doc) => {
     // console.log(doc.id, " => ", doc.data());
      // Update a specific field in the document
      const docRef = doc.ref;

      // Get reference to the document
      const accountEmail = doc.data().accountEmail;
      const accountPassword = doc.data().accountPassword;
      const members = doc.data().members
      const currentUserPosition = members.indexOf(user.uid) + 1

      //console.log("this is from users-grouping.js" + accountEmail + accountPassword)

      //referencing hrml dom elements 
      spotifyLoginEmail.innerHTML = accountEmail;
      spotifyLoginPassword.innerHTML = accountPassword;
      spotifyUserPosition.innerHTML = currentUserPosition;

    })

    if (querySnapshotb.empty) {
      //console.log("User is not a member of any group, checking for available groups...");

      //finding a group with less than 4 members
      const availableGroup = collection(db, "spotifyGroup")

      const availableGroupquery = query(availableGroup, where('size', '<', 6))

      const availableGroupquerySnapshot = await getDocs(availableGroupquery)

      if (!availableGroupquerySnapshot.empty) {
        //if the availableGroupquerySnapshot is not empty you join a new group.
        //console.log("Joining an available group...");

        const groupDoc = availableGroupquerySnapshot.docs[0];

        const groupId = groupDoc.id;
        const groupDocRef = groupDoc.ref

        await updateDoc(groupDocRef, {

          members: arrayUnion(user.uid),
          size: increment(1)
        });

        //console.log("User added to Spotify group:", groupId);
        alert('please kindly refresh this page to load your login info')
      } else {
        //console.log("No available Spotify groups to join, creating a new group...")
        // Create a new group
        const newGroupRef = await addDoc(collection(db, "spotifyGroup"), {
          members: [user.uid],
          size: 1
        });
      }
    }

  }


  overlayForLoader.classList.add('hidden');
}