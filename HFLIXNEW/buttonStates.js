const purchaseBtn1 = document.getElementById('purchaseBtn1');
const purchaseBtn1SubActive = document.getElementById('purchaseBtn1SubActive');

const purchaseBtn2 = document.getElementById('purchaseBtn2');
const purchaseBtn2SubActive = document.getElementById('purchaseBtn2SubActive');

const purchaseBtn3 = document.getElementById('purchaseBtn3');
const purchaseBtn3SubActive = document.getElementById('purchaseBtn3SubActive');


const queryresult = sessionStorage.getItem('queryresult');

function buttonStatesJsFile( callback ) {
  document.addEventListener('DOMContentLoaded', function() {
   // console.log(queryresult);
  //  console.log(sessionStorage);
    callback(true);
    if (queryresult) {
      const parsedResult = JSON.parse(queryresult);
      updateButtonsUi(parsedResult);
    } else {
  
    }
  
  
    function updateButtonsUi(parsedResult) {
      parsedResult.forEach((doc) => {
        //console.log(JSON.stringify(doc) + 'doc');
  
        const netflixSubStatus = doc.data.netflixSubStatus;
        const showmaxSubStatus = doc.data.showmaxSubStatus;
        const spotifySubStatus = doc.data.spotifySubStatus;
  
        //console.log(netflixSubStatus);
  
        if (netflixSubStatus) {
          purchaseBtn1.classList.add('hidden');
          purchaseBtn1SubActive.classList.remove('hidden');
        } else {
          purchaseBtn1.classList.remove('hidden');
          purchaseBtn1SubActive.classList.add('hidden');
        }
        if (showmaxSubStatus) {
          purchaseBtn2.classList.add('hidden');
          purchaseBtn2SubActive.classList.remove('hidden');
        } else {
          purchaseBtn2.classList.remove('hidden');
          purchaseBtn2SubActive.classList.add('hidden');
        }
        if (spotifySubStatus) {
          purchaseBtn3.classList.add('hidden');
          purchaseBtn3SubActive.classList.remove('hidden');
        } else {
          purchaseBtn3.classList.remove('hidden');
          purchaseBtn3SubActive.classList.add('hidden');
        }
        
        
  
      });
    }
  
  
  });
}

export{ buttonStatesJsFile };