//DOM elements
const body = document.body;
const main = document.querySelector('.widgets');
const icon = document.querySelector('.icon')
const details = document.querySelector('.details');


function getRegion(currently) {
	document.querySelector('.region').innerHTML = currently.abbreviation;
}

function getTime() {
  let currentTime = new Date();
  let hour = currentTime.getHours()
  let minute = currentTime.getMinutes();

  //Minute format
  if(minute < 10){
    minute = "0" + minute
  }

  //Time of day
  let greet = '';
  if (hour >= 5 && hour <= 11) {
    greet = 'morning';
  } else if (hour >= 12 && hour <= 17) {
    greet = 'afternoon';
  } 
  else {
    greet = 'evening';
  }
  document.querySelector('.currently__greeting').innerHTML = 'good ' + greet;
  
	// Time setup
	const time = document.querySelector(".time-now");
	const period = document.querySelector(".period");
  if (hour > 12) {
    hour -= 12;
    period.textContent = "pm";
  } else {
    period.textContent = "am";
	}
	time.textContent = `${hour}:${minute}`;
	
	//Update time
	let interval = (60 - (new Date()).getSeconds()) * 1000 + 5;
  setTimeout(getTime,interval)
}


// function getTime(currentHour, currentMinutes) {
// 	if (currentHour >= 5 && currentHour <= 17 ) {
// 		body.classList.add('day');
// 		icon.src = './assets/desktop/icon-sun.svg';
// 		icon.setAttribute("alt", "sun icon");
// 	} else {
// 		body.classList.add('night');
// 		icon.src = './assets/desktop/icon-moon.svg';
// 		icon.setAttribute("alt", "moon icon");
// 		details.style.color = '#fff';
// 		details.style.background = 'rgba(0, 0, 0, 0.75)';
// 	}
// }



// 	function getPeriodOfDay(currentHour) {
	
// //Greeting and icon
// 	let greet = '';
// 	if (currentHour >= 5 && currentHour <= 11) {
// 		greet = 'morning';
// 	} else if (currentHour >= 12 && currentHour <= 17) {
// 		greet = 'afternoon';
// 	} 
// 	else {
// 		greet = 'evening';
// 	}
// 	greeting.appendChild(document.createTextNode(greet));

	
// 	}

function getLocation(ipLocation) {
  const zone = document.querySelector('.country');
  const regionName = ipLocation.region_name;
  const countryCode = ipLocation.country_code;
  zone.innerHTML = `in ${regionName}, ${countryCode}`;
}


function getQuote(quotesArray) {
  let index = Math.floor(Math.random() * quotesArray.length);
	let chosenQuote = quotesArray[index];
	
  document.getElementById("quote").innerHTML = chosenQuote.text;
	
	const author = document.querySelector(".author")
	if (chosenQuote.author == null) {
		author.innerHTML = 'Unknown author'
	} else {
		author.innerHTML = chosenQuote.author;
	}

}


function getDetails(currently) {
  const timeZone = document.getElementById('timezone');
  const dayOfYear = document.getElementById('year-day');
  const weekDay = document.getElementById('week-day');
  const weekNumber = document.getElementById('week-number');

  timeZone.innerHTML = currently.timezone;
  dayOfYear.innerHTML = currently.day_of_year;
  weekDay.innerHTML = currently.day_of_week;
  weekNumber.innerHTML = currently.week_number;
}


Promise
  .all([
    axios.get("https://type.fit/api/quotes"),
    // axios.get(`${'https://cors-anywhere.herokuapp.com/'}https://worldtimeapi.org/api/ip`)
    axios.get('https://worldtimeapi.org/api/ip'), //time based on ip address and info on expanded state
    axios.get("https://freegeoip.app/json/") //city and country under time
  ]).catch(() => null)
  .then(
    axios.spread((quotes, time, location) => {
      // Display quotes
      let quotesArray = quotes.data;
      getQuote(quotesArray);

      //Time now
      let currently = time.data;
      // console.log(currently);
      // let currentTime = new Date(time.data.datetime);
      
      getRegion(currently)
      getDetails(currently);

      //Region
      const ipLocation = location.data;
      getLocation(ipLocation);
    })
  )
  .catch((err) => console.error(err));

getTime();

//Event listeners
//Details button
const expand = document.querySelector('.expand');
function showDetails() {
  main.classList.toggle('transform');

  if (expand.firstChild.nodeValue === "More") {
    expand.firstChild.nodeValue = "Less"
  } else {
    expand.firstChild.nodeValue = "More"
  }

  const arrow = document.querySelector('.arrow');
  arrow.classList.toggle('rotate');
}

//Random quote
document.getElementById('refresh').addEventListener('click', function(){
  axios.get('https://type.fit/api/quotes').then((quotesArray) => {
    getQuote(quotesArray.data)
  }).catch((err) => console.error(err))
})
expand.addEventListener('click', showDetails);