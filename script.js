const inputSlider=document.querySelector("[data-lengthSlider]")
const lengthDisplay = document.querySelector("[data-lengthNumber]")
const passwordDisplay=document.querySelector("[data-passwordDisplay]")
const copyBtn=document.querySelector("[data-copy]")
const copyMsg=document.querySelector("[data-copyMsg]")
const uppercaseCheck=document.querySelector('#upperCase')
const lowercaseCheck=document.querySelector('#lowerCase')
const numberCheck= document.querySelector('#number')
const symbolCheck= document.querySelector('#symbols')
const indicator=document.querySelector("[data-indicator]")
const generateBtn =document.querySelector(".generateButton")
const allCheckBox=document.querySelectorAll("input[type=checkbox]")

const symbol='~`!@#$%^&*()_-=+{}[]|:;"<,.>?/'
let password="";
let passwordLength=8;
let checkCount=0;
//set strength color
handleSlider();
setIndicator("#ccc");
//set password length and reflect password length on screen only 
console.log('start');
function handleSlider(){
    console.log('handle start');
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)+"% 100%")
}
function setIndicator(color){
    console.log('indicator');
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}
// ek random integer find krta hai
function getRandomInteger(min,max){
    console.log('gnerate');
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
    const randomNum=getRandomInteger(0,symbol.length)
    return symbol.charAt(randomNum);
}

function calculateStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSymbol=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numberCheck.checked) hasNum=true;
    if(symbolCheck.checked) hasSymbol=true;

    if(hasUpper && hasLower && (hasNum || hasSymbol) && passwordLength>=8){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && password>=6){
        setIndicator("#ff0");

    }
    else{
        setIndicator("#f00");
    }
}
//jo bhi contnet hai usko copy krta hai
async function copyContent(){
    console.log('copy');
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText="Failed";
    }

    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active")
    }, 2000);
}
function shufflePassword(array){
    console.log('shuffling');
    //fisher yates method == kisi array ke uper aply krke suffle kr skte ho array ko
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((e)=>(str+=e));
    return str;
}

// ager koi bhi change hota hai to starting se count krdega ki kitne checked hai   
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked) {
            checkCount++;
        }
    })

    //special condition
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    } 

}

// y function ek ek check box ko check krta hai ki koi change hora hai ya nhi ager hora hia to uper wala fun call hoga
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange)
})

//jab bhi slider ki value change hogi usko pass ki length m dalega or screen p show krega using handleslider functin
inputSlider.addEventListener('input',(e) =>{
    passwordLength = e.target.value;
    handleSlider();
})

//jab bhi copy  clik krge to y check krega ki input empty hai ya nhi ager nh hai to copy wla fun call hoga  
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();  
    }
})


generateBtn.addEventListener('click',()=>{
    //ager ek bhi check box tick nhi hia
    if(checkCount<=0) return;
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // find new password
    
    //remove old password
    password="";

    let funArr=[];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase); 
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numberCheck.checked){
        funArr.push(generateRandomNumber);
    }
    if(symbolCheck.checked){
        funArr.push(generateSymbol);
    }
    //conplusary add
    for(let i=0;i<funArr.length;i++){
        password +=funArr[i]();  
    }
    //remaining 
    let rem=passwordLength-funArr.length
    console.log(rem)
    for(let i=0;i<rem;i++){
        let randomIndex=getRandomInteger(0,funArr.length)
        password +=funArr[randomIndex]();  
    }
    
    //shuffle the pass
    console.log('start');
    password=shufflePassword(Array.from(password));
    console.log('s done');

    passwordDisplay.value=password;
    console.log(passwordLength)
    console.log('print');
    //check the strength of password
    calculateStrength();
})


