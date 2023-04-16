const usertab = document.getElementById("tab1");
const searchtab = document.getElementById("tab2");
const usercontainer = document.getElementById("weathercontainer")
const grantasscesscontainer = document.getElementById("grantlocationcont")
const searchform = document.getElementById("formcont")
const loadingscreen = document.getElementById("loadingcont")
const userinfocontainer = document.getElementById("weatherinfo")
const text = document.getElementById("allowaccesstogetweatherinfo");
let myerr = document.getElementById("myerror")


let currenttab = usertab;
let APIkey = "450fd1466e7afa95a87e98b3a6968763";
currenttab.classList.add("current-tab");

getfromsessionstorage();

function switchtab(clickedtab){

    if(clickedtab!=currenttab){

        currenttab.classList.remove("current-tab")
        currenttab = clickedtab;
        currenttab.classList.add("current-tab")

        if(!searchform.classList.contains("active")){

            searchform.classList.add("active") 
            userinfocontainer.classList.remove("active")
            grantasscesscontainer.classList.remove("active")
        }
        else{

            searchform.classList.remove("active")
            // grantasscesscontainer.classList.add("active")    
            userinfocontainer.classList.remove("active")
            myerr.classList.remove("active");



            getfromsessionstorage();
        }
    }
}

usertab.addEventListener('click',()=>{

    switchtab(usertab);
})
searchtab.addEventListener('click',()=>{

    switchtab(searchtab);
})

// this function check if coordinates are already present in session storage
function getfromsessionstorage(){

    const localcoordinates = sessionStorage.getItem("user-coordinates")

    // console.log(localcoordinates); // this is a string 
    if(!localcoordinates){

        grantasscesscontainer.classList.add("active")
    }
    else{

        const coordinates = JSON.parse(localcoordinates);

        // console.log(coordinates) // this is a object
        fetchuserweatherinfo(coordinates);
    }
}

async function fetchuserweatherinfo(coordinates){

    const lat = coordinates.lat;
    const lon = coordinates.lon;

    grantasscesscontainer.classList.remove("active")
    loadingscreen.classList.add("active")

    // api call

    try{

        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`)

        const data = await response.json();

        loadingscreen.classList.remove("active")
        userinfocontainer.classList.add("active")

        renderweatherinfo(data);
    }
    catch(err){

        
    }
}

function renderweatherinfo(weatherinfo){

    const cityname = document.getElementById("cityname")
    const countryicon = document.getElementById("countryicon")
    const desc = document.getElementById("weatherdescription")
    const weathericon = document.getElementById("weathericon")
    const temp = document.getElementById("showtemp")
    const descnotmain = document.getElementById("showdescnotmain")
    const tempfeelslike = document.getElementById("feelslike")
    const windspeed = document.getElementById("winddisp")
    const humidity = document.getElementById("humiddisp")
    const cloudiness = document.getElementById("cloudsdisp")

    cityname.innerText = weatherinfo?.name;
    countryicon.src = `https://flagcdn.com/144x108/${weatherinfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherinfo?.weather?.[0]?.main;
    descnotmain.innerText = weatherinfo?.weather?.[0]?.description;
    weathericon.src = `http://openweathermap.org/img/w/${weatherinfo?.weather?.[0]?.icon}.png`;
    let maintemp = weatherinfo?.main?.temp
    let feelsliketemp = weatherinfo?.main?.feels_like;
    temp.innerText = Math.floor(parseInt(maintemp)-273.15)+"°C";
    tempfeelslike.innerText ="Feels Like    "+Math.floor(parseInt(feelsliketemp)-273.15)+"°C";
    windspeed.innerText = weatherinfo?.wind?.speed+"m/s";
    humidity.innerText = weatherinfo?.main?.humidity+"%";
    cloudiness.innerText = weatherinfo?.clouds?.all+"%";
}

function getlocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
      messageText.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

function showPosition(position){

    const usercoordinates = {

        lat:position.coords.latitude,
        lon:position.coords.longitude
    }

    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates))
    fetchuserweatherinfo(usercoordinates);
}


const grantasscessbutton = document.getElementById("btn");
grantasscessbutton.addEventListener('click',getlocation);

const searchinput = document.getElementById("city");

searchform.addEventListener('submit',(e)=>{

    e.preventDefault();

    let cityname = searchinput.value;

    if(cityname===""){

        return;
    }

    else{

        fetchsearchweatherinfo(cityname);
    }
    
})

async function fetchsearchweatherinfo(city){

    loadingscreen.classList.add("active");
    userinfocontainer.classList.remove("active");
    grantasscesscontainer.classList.remove("active");


    try{


        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}`);

        if(res.status==404){

            console.log("hello error")
            loadingscreen.classList.remove("active")
            userinfocontainer.classList.remove("active")
            myerr.classList.add("active");
        }

        else{

            myerr.classList.remove("active");

            const data = await res.json();
            
            loadingscreen.classList.remove("active")
            userinfocontainer.classList.add("active")
            
            renderweatherinfo(data);
        }
    }

    catch(err){

        console.log(err)
    }
}

