// selectors
const themeToggle = document.getElementById('toggle');

// state variables
let theme = localStorage.getItem('theme');

// // on load
if (theme) {
  document.body.classList.add('dark-mode');
  document.getElementById('ltoggle').innerHTML = "<img class=\"theme\" src=\"img/light_cubef1.png\" title=\"toggle theme\">";      
  // console.log('dark');
}

// function handlers
toggleTheme();

// events
function toggleTheme() {
  themeToggle.addEventListener('click', () => {
    // toggle the body class, changing the css varaibles for light and dark colors
    document.body.classList.toggle('dark-mode');
    // if it is dark mode, set local var and change to dark image
    if (document.body.classList.contains('dark-mode')){
      localStorage.setItem('theme', 'dark-mode'); // {key: value} pair
      document.getElementById('ltoggle').innerHTML = "<img class=\"theme\" src=\"img/light_cubef1.png\" title=\"toggle theme\">";      
      // console.log('dark');

      // set color to dark
      cube_bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--color-dark'); 
      // console.log(cube_bgcolor);
    }
      // else it is light mode, remove local var and change to light image
    else { 
      localStorage.removeItem('theme');
    document.getElementById('ltoggle').innerHTML = "<img class=\"theme\" src=\"img/dark_cubef1.png\" title=\"toggle theme\">";    
      // console.log('light');

      // set color to light
        cube_bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--color-light'); 
      // console.log(cube_bgcolor);
    }
    
  });
}
