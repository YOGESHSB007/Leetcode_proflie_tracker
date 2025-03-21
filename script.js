document.addEventListener("DOMContentLoaded", function () {
  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-cards");

  
  

  function validateUsername(username) {
    if (username.trim() === "") {
      alert("Username should not be empty");
      return false;
    }

    // const regex = /^[a-zA-Z0-9]{1,15}$/;
    // const isMatching = regex.test(username);
    // if (!isMatching) {
    //   alert("Invalid Username");
    // }
    return true ;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`  
    try {
      searchButton.textContent = "Searching...";
      searchButton.disabled = true;

      const response = await fetch(url)
    //   const proxyUrl = 'https://cors-anywhere.herokuapp.com/';  
    //   const targetUrl = "https://leetcode.com/graphql/";
    //   const myHeaders = new Headers();
    //   myHeaders.append("content-type", "application/json");

    //   const graphql = JSON.stringify({
    //     query: "\n query userSessionProgress($username: String!) {\n allQuestionsCount {\n ...difficulty\n count\n }\n ...matchedUser\n (username: ${username}) {\n ...submitStats\n ...acSubmissionNum\n difficulty {\n ...count\n submissions\n }\n }\n totalSubmissionNum {\n difficulty {\n ...count\n submissions\n }\n }\n }\n}\n",
    //     variables: { " username": `${username}` }
    //   });

    //   const requestOptions = {
    //     method: "POST",
    //     headers: myHeaders,
    //     body: graphql,
    //     redirect: "follow",
    //   };

    //   const response = await fetch(proxyUrl+targetUrl, requestOptions);
      if (!response.ok) {
        throw new Error("Unable to fetch the User details!");
      }

      const data = await response.json();
      console.log("Logging data: ", data.easySolved);
      displayUserData(data)
    } catch (error) {
      statsContainer.innerHTML = "<p>No dsadata Found</p>";
    } finally {
      searchButton.textContent = "Search";
      searchButton.disabled = false;
      
    }
  }

  function updateProgress(solved ,total , label ,circle){
    
    const progressDegree = (solved/total)*100 
    console.log(progressDegree)
    circle.style.setProperty("--progress-degree",`${progressDegree}%`)
    label.textContent = `${solved}/${total}`;
  }

  function updateCards(ranking, acceptanceRate, contributionPoints , reputation){
    cardStatsContainer.innerHTML = `
    <div class="w-[300px]   rounded-xl bg-amber-400">
    <h1 class="p-3 text-1xl font-medium">ranking : ${ranking}  </h1>
    </div>
    <div class="w-[300px]   rounded-xl bg-amber-400">
      <h1 class="p-3 text-1xl font-medium">acceptanceRate : ${acceptanceRate}% </h1>
    </div>
    <div class="w-[300px] rounded-xl bg-amber-400">
      <h1 class="p-3 text-1xl font-medium">contributionPoints : ${contributionPoints} </h1>
    </div>
    <div class="w-[300px]   rounded-xl bg-amber-400">
      <h1 class="p-3 text-1xl font-medium">reputation : ${reputation} </h1>
    </div>`
  }

  function displayUserData(data){
    const totalQues = data.totalQuestions;
    const totalEasyQues = data.totalEasy;
    const totalMidQues = data.totalMedium;
    const totalHardQues = data.totalHard;

    const totalSolved = data.totalSolved;
    const totalEasySolved = data.easySolved;
    const totalMidSolved = data.mediumSolved;
    const totalHardSolved = data.hardSolved;
    const ranking = data.ranking;
    const acceptanceRate = data.acceptanceRate;
    const contribution = data.contributionPoints;
    const reputation = data.reputation;

    updateProgress(totalEasySolved, totalEasyQues,easyLabel,easyProgressCircle)
    updateProgress(totalMidSolved, totalMidQues,mediumLabel,mediumProgressCircle)
    updateProgress(totalHardSolved, totalHardQues,hardLabel,hardProgressCircle)
    updateCards(ranking, acceptanceRate, contribution, reputation)




  }

  searchButton.addEventListener("click", function () {
    const username = usernameInput.value;
    console.log("loggin username: ", username);
    if (validateUsername(username)) {
      fetchUserDetails(username)
    }
  });
});
