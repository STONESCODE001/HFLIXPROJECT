const calculateBtn = document.getElementById('calculateBtn');
const followerCount = parseFloat(document.getElementById('followerCount').value)


calculateBtn.addEventListener('click', (event) => {
  event.preventDefault()

  const followerCount = parseFloat(document.getElementById('followerCount').value);
  const likeCount = parseFloat(document.getElementById('likeCount').value);
  const shareCount = parseFloat(document.getElementById('shareCount').value);
  const commentCount = parseFloat(document.getElementById('commentCount').value);

  const estimatedPayout = document.querySelector('.estimatedPayout')
  const engagementcalc = document.querySelector('.engagementcalc');
  const engagementratecalc = document.querySelector('.engagementratecalc');
  const estimatedPayoutText = document.querySelector('.estimatedPayoutText')

  function validateInputs() {
    if (!followerCount || !likeCount || !commentCount) {

      alert("Fill in the fields before we go ahead");

      return false;
    } else {
      return true;
    }
  }

  if (validateInputs()) {
    runCalculation()
  }


  function runCalculation() {
    estimatedPayoutText.innerHTML = 'Estimated Payout :';

    /* calculating engagement*/
    const totalEngagement = likeCount + commentCount

    /* engagement rate & percentage */
    const engagementRate = totalEngagement / followerCount
    const engagementRatepercent = engagementRate * 100;

    engagementratecalc.innerHTML = 'Engagement rate:  ' + engagementRatepercent.toFixed(2) + '% <br>'

    /* getting the engagement for the whole follower count*/
    const engagement = engagementRatepercent * totalEngagement;

    engagementcalc.innerHTML = 'Engagement:  ' + engagement.toFixed(0);


    /* With a 10% CTR and 5% buy from us */
    const engagementWithCtr = engagement * 0.1 * 0.05;

    /*showmax: 146*/
    const lowestPossiblePay = (engagementWithCtr * 146).toFixed(0);

    /*netflix: 500*/
    const highestPossiblePay = (engagementWithCtr * 500).toFixed(0);

    estimatedPayout.innerHTML = '&#8358 ' + lowestPossiblePay + ' - ' + highestPossiblePay;
  }

})