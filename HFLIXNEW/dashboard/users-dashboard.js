//console.log("log-dash-js");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import { getFirestore, collection, addDoc, doc, updateDoc, query, where, getDocs, onSnapshot, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import { firebaseConfig } from "/firebase-config.js";


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const user = auth.currentUser;


const noSubDiv = document.getElementById('noCurrentSub');
const spotifyDiv = document.getElementById('spotifyDiv');
const showmaxDiv = document.getElementById('showmaxDiv');
const netflixDiv = document.getElementById('netflixDiv');
const exploreMoreSub = document.getElementById('exploreMoreSub');

const spotifyStartDate = document.getElementById('spotifyStartDate');
const spotifyEndDateDom = document.getElementById('spotifyEndDate');
const spotifydaysLeft = document.getElementById('spotifydaysLeft');
const spotifyProfileNoDiv = document.getElementById('spotifyProfileNoDiv');
const spotifyLoginEmail = document.getElementById("spotifyLoginEmail");
const spotifyLoginPassword = document.getElementById("spotifyLoginPassword");
const spotifyaccountDom = document.getElementById("spotifyaccountDom")

const showmaxStartDate = document.getElementById('showmaxStartDate');
const showmaxEndDateDom = document.getElementById('showmaxEndDate');
const showmaxdaysLeft = document.getElementById('showmaxdaysLeft');
const showmaxProfileNoDiv = document.getElementById('showmaxProfileNoDiv');
const showmaxLoginEmail = document.getElementById("showmaxLoginEmail");
const showmaxLoginPassword = document.getElementById("showmaxLoginPassword");
const showmaxaccountDom = document.getElementById("showmaxaccountDom")

const netflixStartDate = document.getElementById('netflixStartDate');
const netflixEndDateDom = document.getElementById('netflixEndDate');
const netflixdaysLeft = document.getElementById('netflixdaysLeft');
const netflixLoginEmail = document.getElementById("netflixLoginEmail");
const netflixLoginPassword = document.getElementById("netflixLoginPassword");
const netflixaccountDom = document.getElementById("netflixaccountDom")


/* Button of The Sub Page*/
const purchaseBtn1 = document.getElementById('purchaseBtn1');

const purchaseBtn2 = document.getElementById('purchaseBtn2');

const purchaseBtn3 = document.getElementById('purchaseBtn3');


/*function exportingCallback(callback) {
  console.log(callback + 'from function exporting callback')
}*/

const overlayForLoader = document.querySelector(".overlayForLoader");



function showLoader() {
  overlayForLoader.classList.remove('hidden');
}


document.addEventListener('DOMContentLoaded', (event) => {

  //showLoader()
  onAuthStateChanged(auth, (user) => {

    if (user) {

      queryForDocuments(user, db)

    } else {
      // user sef no suppose see this
      noSubDiv.style.display = "block";
      spotifyDiv.style.display = "none";
      showmaxDiv.style.display = "none";
      netflixDiv.style.display = "none";
      exploreMoreSub.style.display = "none"
    }
  });


  /*function passingCallback( callback) {
    const passedCallback = callback;
    console.log(passedCallback + 'Passed Callback');
  }*/



  async function queryForDocuments(user, db) {
    try {
      // Check if the query result is already stored in session storage
      const queryResultString = sessionStorage.getItem('queryResult');

      if (queryResultString) {

        //console.log('at the loader now, first')
        handleQueryResult(queryresult);
        //console.log('at tge loader now first 1')
        //await hideLoader();

      } else {
        // Create a reference to the cities collection
        const usersRef = collection(db, "users");

        // Create a query against the collection.
        const q = query(usersRef, where("uid", "==", user.uid));

        // Execute the query and get the snapshot of the result, to retive the query document 
        const querySnapshot = await getDocs(q);


        //convert query result to an array of objects
        const queryresult = [];
        // Iterate through the documents in the snapshot



        /*Promise.all(querySnapshot.docs.map(async (doc) => {
          queryresult.push({
            id: doc.id, data: doc.data()
          });
          
          
          console.log('atvthe loader now 2b')
          //await hideLoader();
        } ))*/


        querySnapshot.forEach((doc) => {
          queryresult.push({
            id: doc.id,
            data: doc.data()
          });

          //storing query result in session storage as a JSON string 

          //console.log(doc.id, " => ", doc.data());

          sessionStorage.setItem('queryresult', JSON.stringify(queryresult))

          //console.log('at the loader now')
          handleQueryResult(queryresult, );
        });
      }

    } catch (e) {
      //console.log("changine substate error" + e)
    }

  }



  function calculateEndDate(subscriptionTimeStamp) {
    const [year, month, day] = subscriptionTimeStamp.split("-").map(Number);
    let endDate = new Date(year, month - 1, day);
    endDate.setMonth(endDate.getMonth() + 1);

    if (endDate.getMonth() !== ((month - 1 + 1) % 12)) {
      endDate.setDate(0);
    }

    return endDate;
  }

  function hideLoader() {
    overlayForLoader.classList.add('hidden');
  }

  function handleQueryResult(queryresult, callback) {
    //console.log("queryresult:" + queryresult)

    queryresult.forEach((doc) => {

      try {

        const netflixSubStatus = doc.data.netflixSubStatus;
        const showmaxSubStatus = doc.data.showmaxSubStatus;
        const spotifySubStatus = doc.data.spotifySubStatus;

       // console.log(netflixSubStatus + 'netflixSubStatus')
        if (netflixSubStatus) {

          if (doc.data.successfullNetflixSubTimeStamp) {

            const successfullNetflixSubTimeStamp = doc.data.successfullNetflixSubTimeStamp.split("T")[0];
            const netflixEndDate = calculateEndDate(successfullNetflixSubTimeStamp);
            const currentDate = new Date().getTime()

            if (currentDate >= netflixEndDate.getTime()) {
              netflixdaysLeft.innerHTML = "Subscription Ended";
              netflixStartDate.style.display = 'none';
              netflixEndDateDom.style.display = 'none';
              netflixProfileNoDiv.style.display = 'none';
              netflixLoginEmail.style.display = 'none';
              netflixLoginPassword.style.display = 'none';
              netflixaccountDom.style.display = 'none';
            } else {
              updateSubscriptionUI(netflixEndDate, "Netflix", successfullNetflixSubTimeStamp);
            }
          } else {
            //console.error("Netflix subscription timestamp is undefined");
          }
          netflixDiv.style.display = "block";
        } else {
          netflixDiv.style.display = "none";
        }


        if (spotifySubStatus) {

          if (doc.data.successfullSpotifySubTimeStamp) {

            const successfullSpotifySubTimeStamp = doc.data.successfullSpotifySubTimeStamp.split("T")[0];
            const spotifyEndDate = calculateEndDate(successfullSpotifySubTimeStamp);
            const currentDate = new Date().getTime()

            if (currentDate >= spotifyEndDate.getTime()) {
              spotifydaysLeft.innerHTML = "Subscription Ended";
              spotifyStartDate.style.display = 'none';
              spotifyEndDateDom.style.display = 'none';
              spotifyProfileNoDiv.style.display = 'none';
              spotifyLoginEmail.style.display = 'none';
              spotifyLoginPassword.style.display = 'none';
              spotifyaccountDom.style.display = 'none';
            } else {
              updateSubscriptionUI(spotifyEndDate, "Spotify", successfullSpotifySubTimeStamp);
            }
          }

          spotifyDiv.style.display = "block"
        } else {
          spotifyDiv.style.display = "none"
        }


        if (showmaxSubStatus) {
          if (doc.data.successfullShowmaxSubTimeStamp) {

            const successfullShowmaxSubTimeStamp = doc.data.successfullShowmaxSubTimeStamp.split("T")[0];
            const showmaxEndDate = calculateEndDate(successfullShowmaxSubTimeStamp);
            const currentDate = new Date().getTime();
            // for users sub after 30 days
            if (currentDate >= showmaxEndDate.getTime()) {
              showmaxdaysLeft.innerHTML = "Subscription Ended"
              showmaxStartDate.style.display = 'none';
              showmaxEndDateDom.style.display = 'none';
              showmaxProfileNoDiv.style.display = 'none';
              showmaxLoginEmail.style.display = 'none';
              showmaxLoginPassword.style.display = 'none';
              showmaxaccountDom.style.display = 'none'
            } else {

              updateSubscriptionUI(showmaxEndDate, "Showmax", successfullShowmaxSubTimeStamp);
            }
          }

          showmaxDiv.style.display = "block";
        } else {
          showmaxDiv.style.display = "none";
        }


        //console.log("Netflix Sub Status:", netflixSubStatus, "Showmax Sub Status:", showmaxSubStatus, "Spotify Sub Status:", spotifySubStatus);


        if (netflixSubStatus || showmaxSubStatus || spotifySubStatus) {
          noSubDiv.style.display = "none";
          exploreMoreSub.style.display = "block";
          //showmaxDiv.style.display = "none";
        } else {
          noSubDiv.style.display = "block";
          exploreMoreSub.style.display = "none";
          //showmaxDiv.style.display = "none";
        }


        function updateSubscriptionUI(endDate, subscriptionType, startTimeStamp) {
          const daysLeftElementId = subscriptionType.toLowerCase() + "daysLeft";
          const startDateElementId = subscriptionType.toLowerCase() + "StartDate";
          const endDateElementId = subscriptionType.toLowerCase() + "EndDate";

          const daysLeftElement = document.getElementById(daysLeftElementId);
          const startDateElement = document.getElementById(startDateElementId);
          const endDateElement = document.getElementById(endDateElementId);

          if (daysLeftElement && startDateElement && endDateElement) {
            const differenceMs = endDate.getTime() - new Date().getTime();
            const daysLeft = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
            const hoursLeft = Math.floor((differenceMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesLeft = Math.floor((differenceMs % (1000 * 60 * 60)) / (1000 * 60));
            const secondsLeft = Math.floor((differenceMs % (1000 * 60)) / 1000);

            const daysLeftString = `${daysLeft}days ${hoursLeft}hrs ${minutesLeft}mins ${secondsLeft}secs`;

            daysLeftElement.innerHTML = daysLeftString;
            startDateElement.innerHTML = startTimeStamp;
            endDateElement.innerHTML = endDate.toISOString().split("T")[0];

            setInterval(() => updateSubscriptionUI(endDate, subscriptionType, startTimeStamp), 1000);
          } else {
            //console.log('ui components not present');
          }
        }

        //console.log('hideloadee from yry block' + hideLoader);
        overlayForLoader.classList.add('hidden');
        //hideLoader();
      } catch (error) {
       // console.log('showloader from try else block')
        //showLoader();
       // console.log(error, "error from user-dashboard or something");
      //  console.error("An error occurred:", error);
     //   console.error("Error object:", error);

      }

    });


  }

});