// get button to be pressed to call getInput()
document.querySelector("#user_button").addEventListener("click", getInput); // need to split up scripts for html pages
document.querySelector("#info").addEventListener("click", displayInfo);

// get 10000 digits of pi for now
const url ="https://uploadbeta.com/api/pi/?cached&n="

let get_pits;

function displayInfo() {
    document.querySelector('#validation').innerHTML = `<h2 class=" info ">  
    I wondered if a Rubik's cube can be solved through randomness and infinity.
    <br><span class="pi ">&pi;</span> is an "infinite" decimal. So using all the digits of 0-9, 
    I related them to a corresponding Rubik's cube rotation moves:
    <br>The digit '3' relates to the 'Down' move notation for a Rubik's cube.
    <br>The digit '4' relates to the 'Right' move notation, and so on for all digits.
    <br>This project will go through all the <span class="pi ">&pi;</span> digits, one at a time, rotating the cube to the corresponding digit given.
    The hope is to see if infinite randomness can end up solving a Rubik's cube someday.
    This might take millions, to billions of digits, and soon an official website will be made to run this 24/7.
    For now, this project runs locally, only for you to see, but I hope it interests and can entertain you until then!.
    <br>Thanks for stopping by and checking it out!
    </h2>`;
}

// create a function with a button
async function getInput() {
  // validate input
  if(!inputIsValid()) {
    // invalid input. make invisible    
    document.querySelector("#getpi").innerHTML = "";
    return;
  }

  // valid input, can remove validation message on correct input
  document.querySelector("#validation").innerHTML = "";
  
  
  // get user input for one of the colors to update
  let pi_input = document.querySelector("#user_input").value; // should be a number
  console.log(pi_input);
  // validate input for numbers only, 0-9
  let isnum = /^\d+$/.test(pi_input);
  if (!isnum){
    document.querySelector("#validation").innerHTML = "Invalid input. Only numbers allowed";
    console.log("invalid");
    document.querySelector("#getpi").innerHTML = "";
    return;
  }
  // pi_input = Number(pi_input);
  // cap the pi digits to 1000 for now
  if(Number(pi_input) > 1000) {
    pi_input = 1000;
  }
  // set min to 10 digits
  else if (Number(pi_input) < 10) {
    pi_input = 10;
  }

  // fetch the pi digits from 0 - {pi_input} for global var, for cube.js to use.
  // will be a very large string of all digits. 
      get_pits = await fetchPi(url, pi_input);

  // store locally
  localStorage.setItem('pi_digits', get_pits);


  // then make visible the button to find out if these amount of digits can solve a rubiks cube
  // document.querySelector("#getpi")innerHTML += ;
  document.querySelector("#getpi").innerHTML = `<h2 class=\"subtitle dmargin\" id=\"qpi\"> Is it possible to solve a Rubik's cube with ${pi_input} digits?</h2> <br>   
     <button class=\"button_big\" id=\"user_button\"> find out now! </button> <br><br> `;

}

// is the user input valid?
function inputIsValid() {
  let isValid = false;
  if (!document.querySelector("#user_input").value == "") {
    isValid = true;    
  }
  else document.querySelector("#validation").innerHTML = "Input is blank";
  console.log(isValid);
  return isValid;
}

// fetching function
async function fetchPi(url, digits){
  url = url.concat(digits);
  // console.log(url);
  let response = await fetch(url); // fetch the url data. although this is not json?
  let pi = await response.json();
  // get rid of the initial 0 and 3, start with 1415...
  pi = pi.substring(1);
  pi_first ="3"; // display 3, then decimal for
  document.querySelector('#validation').innerHTML = `<h2 class=" validation dmargin  ">Scroll down to find out!</h2><span class="pi ">&pi;</span>: ${pi_first}.${pi.substring(1)}`;
  console.log("pi: ".concat(pi));
  return pi; // return pi as a string, for substring

}




// EXTRA
// get local storage setup with justification options
// find the div header with the id 'jdiv'
// now find a way to toggle through all three options. changing back and forth between them all