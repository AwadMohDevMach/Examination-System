
// select element 
let countSpan = document.querySelector(".count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let bullets = document.querySelector(".bullets");
let quizErea = document.querySelector(".quiz-erea");
let answeresArea = document.querySelector(".answeres-area");
let submitButton = document.querySelector(".submit-button");
let reasultsContainer = document.querySelector(".reasults");
let countdownElement = document.querySelector(".countdown")


// set options

let currentIndex = 0;
let rightAnswers = 0;
let countdownInterval;


function getQestions(){

    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function(){
     if(this.readyState === 4 && this.status === 200){

        let questionsObject = JSON.parse(this.responseText);
        let qustionsCount = questionsObject.length;

        // create bulltse + set qustions count 
        createBillets(qustionsCount);


        // add Question data 
        addQstionsData(questionsObject[currentIndex], qustionsCount);

        // start function countdown 
        countdown(150,qustionsCount)

        // click on submit 
        submitButton.onclick = ()=>{

            // get right answer
            let theRightAnswer = questionsObject[currentIndex].right_answer;
            
            // increase index
            currentIndex++;

            // click the answer 
            clickAnswer(theRightAnswer , qustionsCount);

            // remove previos qustions 
            quizErea.innerHTML = "";
            answeresArea.innerHTML = "";

                    // add Question data 
        addQstionsData(questionsObject[currentIndex], qustionsCount);


        clearInterval(countdownInterval)
        countdown(150,qustionsCount)

        // handle bullets class 
        handleBullets();


        // show reasults
        showReasults(qustionsCount);
        };
     };
    };
    myRequest.open("Get", "html_questions.json",true);
    myRequest.send();

};
getQestions();

function createBillets(num){
    countSpan.innerHTML = num;

    // create spans 
    for (let i=0; i<num; i++){
        // create bullet
        let theBullet = document.createElement("span");

        // check is first span 
        if(i === 0){
            theBullet.className = "on";
        }

        // appens bullets to main bullet container
        bulletsSpanContainer.appendChild(theBullet);

    };
};
function addQstionsData( obj , count){
    
    if(currentIndex < count){
         // ctrate Ht qustions tittle 

    let QuestionsTittle = document.createElement("h2");

    // create questin text
    let qustionText = document.createTextNode(obj["tittle"]);

    // append text to h2
    QuestionsTittle.appendChild(qustionText);

    // append the h2 to the qize area 
    quizErea.appendChild(QuestionsTittle);

    // create the answers
    
    for (let i =1; i<= 4; i++){

        // create main answer div
        let mainDiv = document.createElement("div");

        // add class to main div
        mainDiv.className = "answer";

        // create radio input 
        let radioInput = document.createElement("input");

        // add type + name + id + data-atribute 

        radioInput.name = "qustion";
        radioInput.type = "radio";
        radioInput.id = `answer_${i}`;
        radioInput.dataset.answer = obj[`answer_${i}`];

        //make first option selected
        if(i === 1){
            radioInput.checked = true;
        } 

        // craete lable
        let theLable = document.createElement("label");

        // add for attribute 
        theLable.htmlFor = `answer_${i}`;

        // create lable text 
        let theLableText = document.createTextNode(obj[`answer_${i}`]);

        // add the text to lable 
        theLable.appendChild(theLableText);

        // append input + lable to main div
        mainDiv.appendChild(radioInput);
        mainDiv.appendChild(theLable);

        // append all divs to answers area
        answeresArea.appendChild(mainDiv);
    };
    };
};

function clickAnswer(Aanswer , count){
    
    let answers = document.getElementsByName("qustion");

    let theChosenAnswer ;
    for(let i=0; i<answers.length; i++){
        if(answers[i].checked){
            theChosenAnswer = answers[i].dataset.answer;
        }
    }

    if(Aanswer === theChosenAnswer){
        rightAnswers++;
        console.log("good")
    }
}

function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span");

    let arrayOfSpan = Array.from(bulletsSpans);

    arrayOfSpan.forEach((span , index) =>{
        if(currentIndex === index){
            span.className ="on";
        };
    });
};

function showReasults(count){
    let theReasults;
    if(currentIndex === count){
        quizErea.remove();
        answeresArea.remove();
        submitButton.remove();
        bullets.remove();

        if(rightAnswers > (count/2) && rightAnswers < count){
            theReasults = `<span class="good">good</span> , ${rightAnswers} from ${count} is good`;
        }else if(rightAnswers === count){
            theReasults = `<span class="perfect">perfect</span> , All answers is good`;

        }else{
            theReasults = `<span class="bad">bad</span> , ${rightAnswers} from ${count} `;
        };
        reasultsContainer.innerHTML = theReasults;
    };
};

function countdown(duration,count){
    if(currentIndex < count){
        let minuts , seconds;
        countdownInterval = setInterval(function(){
            minuts = parseInt(duration / 60)
            seconds = parseInt(duration % 60)
            
            minuts = minuts < 10 ?`0${minuts}`: minuts;
            seconds = seconds < 10 ?`0${seconds}`: seconds;

            countdownElement.innerHTML = `${minuts}:${seconds}`;
            if(--duration < 0){
                clearInterval(countdownInterval)
                submitButton.click()
            }

        }, 1000)
    }
}