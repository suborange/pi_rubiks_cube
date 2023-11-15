// TODO
// scramble the cube 
// use pit_digits from local storage. 
// add total digits, and digit numkber (start-ish)
// make a tiny transition going from one number to the next?
// sequence of pi to solvee? shoutout to inspiration link here : https://www.twitch.tv/winningsequence

// scramble then start...


// FUNCTION STARTS
// function startPi(){
//   document.querySelector("#ading_this_script").setAttribute('src', 'src=\"/scripts/cube.js\"');
  
// }

// pass starting and ending values, to eventually loop through. 
//runPi(0,1);

// DEFINE TO CHANGE THE DIGIT AND MOVE NOTATION
function runPi(start,end){
  // find the pi digit, and adjust it as it runs. 

  // console.log("start: ", start, " | end: ", end);
  document.querySelector("#current").innerHTML = `Digit #${start}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Current Move`;
  document.querySelector("#pi_start").innerHTML = `<span class="ends">${get_pits.substring(start-1,end-1)}</span>`;
  document.querySelector("#pi_digit").innerHTML = ` ${get_pits.substring(start,end)} `; // one space enough seperation?
  document.querySelector("#pi_end").innerHTML = `<span class="ends">${get_pits.substring(start+1,end+1)}<span class="ends"></span>`;


  // MAYBE COPY SAME THING, go through array, and gt the corresponding move? to show prev and next move?

  
  // console.log(get_pits.substring(start,end)); 

  // might move to cube.js
  // switch (get_pits.substring(start+1,end+1)) {
  //     case "3":
  //     console.log("starting point")
  //     document.querySelector("#pi_move").innerHTML = `L`;
  //     break;
  // }
  
   // return get_pits.substring(start,end);
 
}