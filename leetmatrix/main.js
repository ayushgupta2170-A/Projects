
document.addEventListener("DOMContentLoaded",()=>{
    const searchForm=document.getElementById("search-form");
    const usernameInput=document.getElementById("user-input");
    const searchBtn=document.getElementById("search-btn");
    const errorMsg=document.getElementById("error-message");
    const statsContainer=document.querySelector(".stats-container");

    const easyCircle=document.querySelector(".easy-circle");
    const mediumCircle=document.querySelector(".medium-circle");
    const hardCircle=document.querySelector(".hard-circle");

    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const statsCardContainer=document.querySelector(".stats-card");

    function showError(msg){
        errorMsg.textContent=msg;
    }

    function clearError(){
        errorMsg.textContent="";
    }

    function isValidUsername(username){
        if(username===""){
            showError("Username khali nahi hona chahiye!");
            return false;
        }

        const regex=/^[a-zA-Z0-9_-]+$/;

        if(!regex.test(username)){
            showError("Invalid username! Please check it.");
            return false;
        }

        clearError();
        return true;
    }

    function setProgress(solved,total,label,circle){
        const percent=total>0?(solved/total)*100:0;

        circle.style.setProperty("--progress-degree",percent+"%");
        label.textContent=solved+"/"+total;
    }

    async function getLeetCodeData(username){
        const apiUrl=`https://alfa-leetcode-api.onrender.com/${encodeURIComponent(username)}/progress`;

        try{
            searchBtn.disabled=true;
            searchBtn.querySelector("span").textContent="Loading...";
            clearError();

            const res=await fetch(apiUrl);

            if(!res.ok){
                throw new Error("API Error: "+res.status);
            }

            const data=await res.json();

            console.log("API Response:",data);

            if(!data.numAcceptedQuestions||!data.numAcceptedQuestions.numAcceptedQuestions){
                throw new Error("Invalid API response");
            }

            renderData(data);

        }catch(err){
            console.log("Error:",err);
            statsContainer.classList.remove("visible");
            showError("User data nahi mila. Username check karo ya thodi der baad try karo.");
        }finally{
            searchBtn.disabled=false;
            searchBtn.querySelector("span").textContent="Search";
        }
    }

    function renderData(data){
        const solvedList=data.numAcceptedQuestions.numAcceptedQuestions;
        const untouchedList=data.numAcceptedQuestions.numUntouchedQuestions;
        const beatsList=data.numAcceptedQuestions.userSessionBeatsPercentage;

        if(!solvedList||!untouchedList||!beatsList||
           solvedList.length<3||untouchedList.length<3||beatsList.length<3){
            throw new Error("Stats data incomplete");
        }

        const easySolved=solvedList[0].count;
        const easyTotal=easySolved+untouchedList[0].count;

        const mediumSolved=solvedList[1].count;
        const mediumTotal=mediumSolved+untouchedList[1].count;

        const hardSolved=solvedList[2].count;
        const hardTotal=hardSolved+untouchedList[2].count;

        setProgress(easySolved,easyTotal,easyLabel,easyCircle);
        setProgress(mediumSolved,mediumTotal,mediumLabel,mediumCircle);
        setProgress(hardSolved,hardTotal,hardLabel,hardCircle);

        const cards=[
            {level:"Easy Beat",value:beatsList[0].percentage},
            {level:"Medium Beat",value:beatsList[1].percentage},
            {level:"Hard Beat",value:beatsList[2].percentage}
        ];

        statsCardContainer.innerHTML=cards.map(card=>`
            <div class="card">
                <h3>${card.level}</h3>
                <p>${card.value}%</p>
            </div>
        `).join("");

        statsContainer.classList.add("visible");
    }

    searchForm.addEventListener("submit",e=>{
        e.preventDefault();

        const username=usernameInput.value.trim();

        if(isValidUsername(username)){
            getLeetCodeData(username);
        }
    });
});
