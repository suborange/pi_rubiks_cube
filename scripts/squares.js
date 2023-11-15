// BEFORE SETUP 
let cube_bgcolor; 
// console.log(cube_bgcolor);
// on load get the theme settings to setup
theme = localStorage.getItem('theme');
if (theme) {
    cube_bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--color-dark');  
}
else {
    cube_bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--color-light'); 
}

// let get_pits = localStorage.getItem('pi_digits');

// convert from hex to rgb for the canvas background
let rgb = [
    parseInt(cube_bgcolor.substr(-6,2),16),
    parseInt(cube_bgcolor.substr(-4,2),16),
    parseInt(cube_bgcolor.substr(-2),16)
];


// SETUP AND DRAW
// CREATE FACE AND CUBIE CLASSES TO DRAW
// CREATE TURNING FUNCTIONS FOR EACH FACE
function setup() {
  let canvas = createCanvas(450, 420, WEBGL);
  canvas.parent("canvas_holder");
  frameRate(60);
  // angleMode(DEGREES);
  // BRUTE FORCE CUBE

}


function draw() {
  rgb[0] = parseInt(cube_bgcolor.substr(-6,2),16);
  rgb[1] =parseInt(cube_bgcolor.substr(-4,2),16);
  rgb[2] =parseInt(cube_bgcolor.substr(-2),16);

  background(rgb[0], rgb[1], rgb[2]);

  orbitControl(1,1,0, {freeRotation: true}); //ez pz

}

/** RESOURCES : 
https://www.youtube.com/watch?v=9PGfL4t-uqE 
https://www.youtube.com/watch?v=EGmVulED_4M
https://www.youtube.com/watch?v=8U2gsbNe1Uo&t=441s
*/

// grab my color
// state variables

// get random scrambles to scramble the cube first


// now with scramble, assign pi digits to reach rotation, using my temp logic. 

// have a div to try and explain the rulesets and connections


// BEFORE SETUP 
let cube_bgcolor; 
// console.log(cube_bgcolor);
// on load get the theme settings to setup
theme = localStorage.getItem('theme');
if (theme) {
    cube_bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--color-dark');  
}
else {
    cube_bgcolor = getComputedStyle(document.documentElement).getPropertyValue('--color-light'); 
}

// let get_pits = localStorage.getItem('pi_digits');

// convert from hex to rgb for the canvas background
let rgb = [
    parseInt(cube_bgcolor.substr(-6,2),16),
    parseInt(cube_bgcolor.substr(-4,2),16),
    parseInt(cube_bgcolor.substr(-2),16)
];


// PRE-SETUP VARS AND STUFF

// // SETUP VARIABLES 
// let dim = Number(3);
// // Box[][][] cube = new Box[dim][dim][dim];
// let cube = Array(dim).fill().map(e => Array(dim).fill().map(e => Array(dim).fill(new Cubie()).map(e => e))); 

//let cube = [[[]]]; // fuckin figure this shit out... jesus



let abc = 0;

// GLOBALS
// setup for the vectors and 3d array(matrix)
let dim;
let cube;
let bool = true;
let start = 0;
let end = 1;


// SETUP AND DRAW
// CREATE FACE AND CUBIE CLASSES TO DRAW
// CREATE TURNING FUNCTIONS FOR EACH FACE
function setup() {
  let canvas = createCanvas(450, 420, WEBGL);
  canvas.parent("canvas_holder");
  frameRate(60);
  // angleMode(DEGREES);
  // BRUTE FORCE CUBE

  // FACE
  class Face {
    normal; // normal vector
    // COLORS FOR FILL (color type did not work)
    red;
    green;
    blue;

    constructor(n,r,g,b){
      this.normal = n;
      this.red=r;
      this.green=g;
      this.blue=b;
    }

    // TURN FACES
    turnZ(angle) {
      let vz = createVector();
      vz.x = round(this.normal.x * cos(angle) - this.normal.y * sin(angle));
      vz.y = round(this.normal.x * sin(angle) + this.normal.y * cos(angle));
      vz.z = round(this.normal.z);
      this.normal = vz; 
    }

    turnY(angle)
    {
      let vy = createVector();
      vy.x = round(this.normal.x * cos(angle) - this.normal.z * sin(angle));
      vy.z = round(this.normal.x * sin(angle) + this.normal.z * cos(angle));
      vy.y = round(this.normal.y);
      this.normal = vy;      
    }

    turnX(angle) {
      let vx = createVector();
      vx.y = round(this.normal.y * cos(angle) - this.normal.z * sin(angle));
      vx.z = round(this.normal.y * sin(angle) + this.normal.z * cos(angle));
      vx.x = round(this.normal.x);
      this.normal = vx;
    }

    // DISPLAY COLORS ON CUBE - these params work correctly for me
    showColor() {
      push();
      noStroke();
      fill(Number(this.red), Number(this.green), Number(this.blue));
      rectMode(CENTER);
      translate(30*this.normal.x , 30*this.normal.y, 30*this.normal.z);
      if (abs(this.normal.x )) {
        rotateY(HALF_PI);
      }
      else if (this.normal.y ) {
        rotateX(HALF_PI);        
      }
      // console.log(this.normal.x , this.normal.y, this.normal.z); seems to be working fine.. 
      square(0,0,60);
      pop();
    }     
  } // end face

  // CUBIE
  class Cubie {
    vector3; // to store vector positions hopefully
    matrix; // to store transformation matrix
    matrix_next;
    // index of each axis
    xi;
    yi;
    zi;
    length;
    faces = Array(6); // array for the 6 total faces
    r = 255;
    g = 255;
    b = 255;

    // constructor(x,y,z,l) {
    //   this.vector3 = createVector(x,y,z); 
    constructor(m,l,x,y,z) {
      this.matrix = m;
      this.length = l;
      this.xi = x;
      this.yi = y;
      this.zi = z;     

      // each cubie will have information for all 6 faces
      this.faces[0] = new Face(createVector(0,0,-1), 0,0,255); // BACK - pass a new vector? and blue
      this.faces[1] = new Face(createVector(0,0,1), 0,255,0); // FRONT - green
      this.faces[2] = new Face(createVector(0,1, 0), 255,255,255); // UP - white
      this.faces[3] = new Face(createVector(0,-1,0), 255,255,0); // DOWN - yellow
      this.faces[4] = new Face(createVector(1,0,0), 255, 140,0); // LEFT - orange
      this.faces[5] = new Face(createVector(-1,0,0), 255,0,0); // RIGHT - red      
    }    

    // show the cubie, translate to center, and show face colors
    show() {
      noFill();
      // fill(this.r, this.g,this.b);


      stroke(0);
      strokeWeight(5);

      push();
      translate(this.matrix.x, this.matrix.y, this.matrix.z);
      box(this.length);
      for (let f of this.faces) {
        f.showColor();
      }      
      pop();

    } 

    update(newx,newy,newz){
      this.xi=newx;
      this.yi=newy;
      this.zi=newz;      
    }
    turnZfaces(angle) {
      for (let f of this.faces) {
        f.turnZ(angle);
      }    
    }

  } // end cubie



// SETUP VARIABLES 

dim = Number(3);
// Box[][][] cube = new Box[dim][dim][dim];
// cube = Array(dim).fill().map(e => Array(dim).fill().map(e => Array(dim).fill("3").map(e => e)));
  cube = Array(dim*dim*dim).fill(); // 1D array of matrices

  index = 0;
  // ATTEMPT 1
  // for every cubie, make a cube with correct length and offset to center
  for (let _X = 0, xx=-1; _X < dim; _X++,xx++){
    // console.log(_X);
    for (let _Y = 0, yy=-1; _Y < dim; _Y++, yy++){
      // console.log(_Y);
      for (let _Z = 0, zz=-1; _Z < dim; _Z++, zz++){
        // console.log(_Z);        
        let _len = 60;
        let offset = (dim -1) * _len * 0.5;
        let x = _X * _len - offset;
        let y = _Y * _len - offset;
        let z = _Z * _len - offset;
        let m = createVector(x,y,z);      
        // console.log("making matrix:", m, " \nwith index", index);
        // send the matrix, length, and the indexs for x,y,z
        cube[index] = new Cubie(m, _len, xx, yy, zz);
        console.log("x: ", cube[index].xi, "y: ", cube[index].yi, "z: ", cube[index].zi);
        index++;

        // cube[_X][_Y][_Z] = new Cubie(x,y,z, _len);
      }

    }

  }
  // cube[0].r = 255; cube[0].g = 0; cube[0].b = 0;
  // cube[1].r = 255; cube[1].g = 255; cube[1].b = 0;
  // cube[2].r = 255; cube[2].g = 0; cube[2].b = 255;
  // cube[4].r = 255; cube[4].g = 0; cube[4].b = 0;
  // cube[5].r = 255; cube[5].g = 255; cube[5].b = 0;
  // cube[3].r = 255; cube[3].g = 0; cube[3].b = 255;
  // cube[6].r = 255; cube[6].g = 0; cube[6].b = 0;
  // cube[7].r = 255; cube[7].g = 255; cube[7].b = 0;
  // cube[8].r = 255; cube[8].g = 0; cube[8].b = 255;
  // cube[9].r = 0; cube[9].g = 255; cube[9].b = 255;
  // cube[23].r = 0; cube[23].g = 100; cube[23].b = 255;
  // // ATTEMPT 2 WITH MATRIX?
  // for (let _X = -1; _X <= 1; _X++){
  //   for (let _Y = -1; _Y <= 1; _Y++){
  //     for (let _Z = -1; _Z <= 1; _Z++){
  //       let m = createVector(_X*50,_Y*50,_Z*50);

  //       console.log(m);
  //       cube[index] = new Cubie(m);
  //       index++;
  //     }
  //   }
  // }


} // end setup

// X AXIS ONLY
function rotateXaxis(angle, axis_index){
  abc=0;
  for (let i = 0; i < cube.length; i++){
    // in z axis plane, the front?  
    qb = cube[i];
    if (qb.xi == axis_index) { // 0 == back, 1 = middle, 2 == front 
      // if (abc < 1){
      //    console.log("index",qb.xi);
      //   console.log("before - matrix: ", qb.matrix);
      //   console.log("x: ", qb.xi, "y: ", qb.yi, "z: ", qb.zi);
      //   abc++;
      // }

      qb.matrix_next = createVector();
      // rotate?
      qb.matrix_next.y = round(qb.matrix.y * cos(angle) - qb.matrix.z * sin(angle));
      qb.matrix_next.z = round(qb.matrix.y * sin(angle) + qb.matrix.z * cos(angle));
      qb.matrix_next.x = round(qb.matrix.x);
      // translate?
      qb.matrix = qb.matrix_next; 
      // if (abc < 2){
      //   console.log("after -matrix: ", qb.matrix);
      //   console.log("x: ", qb.xi, "y: ", qb.yi, "z: ", qb.zi);
      //   abc++;
      // }        
      qb.update((qb.matrix.x / 60), (qb.matrix.y / 60), (qb.matrix.z /60));        
    } // end if axis    

  }  
} // end X turn  



// Y AXIS ONLY
function rotateYaxis(angle, axis_index){
  abc=0;
  for (let i = 0; i < cube.length; i++){
    // in z axis plane, the front?  
    qb = cube[i];
    if (qb.yi == axis_index) { // 0 == back, 1 = middle, 2 == front 
      // if (abc < 1){
      //   console.log("index",qb.yi);
      //   console.log("before - matrix: ", qb.matrix);
      //   abc++;
      // }


      qb.matrix_next = createVector();
      qb.matrix_next.x = round(qb.matrix.x * cos(angle) - qb.matrix.z * sin(angle));
      qb.matrix_next.z = round(qb.matrix.x * sin(angle) + qb.matrix.z * cos(angle));
      qb.matrix_next.y = round(qb.matrix.y);
      qb.matrix = qb.matrix_next; 
      // if (abc < 2){
      //   console.log("after -matrix: ", qb.matrix);
      //   console.log("x: ", qb.xi, "y: ", qb.yi, "z: ", qb.zi);
      //   abc++;
      // } 
      qb.update((qb.matrix.x / 60), (qb.matrix.y / 60), (qb.matrix.z /60));            
    } // end if axis     

  }  
} // end Y turn



// Z AXIS ONLY
function rotateZaxis(angle, axis_index){
  abc=0;

  for (let i = 0; i < cube.length; i++){
    // in z axis plane, the front?  
    qb = cube[i];
    if (qb.zi == axis_index) { // 0 == back, 1 = middle, 2 == front 
      // if (abc < 9){
      //    // console.log("index",qb.zi);
      //   // console.log("before matrix - x: ", qb.matrix.x, " - y: ", qb.matrix.y, " - z:", qb.matrix.z);
      //   // console.log("x: ", qb.xi, "y: ", qb.yi, "z: ", qb.zi);
      //   // console.log("x: ", cube[i+6].xi, "y: ", cube[i+6].yi, "z: ", cube[i+6].zi);

      // }

      qb.matrix_next = createVector();
      qb.matrix_next.x = round(qb.matrix.x * cos(angle) - qb.matrix.y * sin(angle));
      qb.matrix_next.y = round(qb.matrix.x * sin(angle) + qb.matrix.y * cos(angle));
      qb.matrix_next.z = round(qb.matrix.z);
      qb.matrix = qb.matrix_next; 

      qb.update((qb.matrix.x / 60), (qb.matrix.y / 60), (qb.matrix.z /60));  
      qb.turnZfaces(angle);
    } // end if axis

  }  
} // end Z turn




let temp = -1;
function draw() {
  rgb[0] = parseInt(cube_bgcolor.substr(-6,2),16);
  rgb[1] =parseInt(cube_bgcolor.substr(-4,2),16);
  rgb[2] =parseInt(cube_bgcolor.substr(-2),16);

  background(rgb[0], rgb[1], rgb[2]);
  // scale(5);
  // rotateX(frameCount * 0.01);
  // rotateY(frameCount * 0.01);
  // box(50);

  // console.log(PI);
  // let camX = map(mouseX, 0, width, 200, -200);
  // let camY = map(mouseY, 0, height, 200, -200);
// lol using a pi constant here to do some math.. whatever.. idk.
  // camera(camX,camY,(height/2) / tan(PI/6),
  //        0,0,0,
  //        0,1,0);

  // camera controls for free rotation
  orbitControl(1,1,0, {freeRotation: true}); //ez pz
// ATTEMPT 1
  // for (let _X = 0; _X < dim; _X++){
  //   // console.log(_X);
  //   for (let _Y = 0; _Y < dim; _Y++){
  //     // console.log(_Y);
  //     for (let _Z = 0; _Z < dim; _Z++){
  //       // console.log(_Z);
  //       cube[_X][_Y][_Z].show();
  //     }
  //   }
  // }

  // ATTEMPT 2
  for (let i = 0; i < cube.length; i++){
        cube[i].show();
  }

  // frameCount
  // right now every 3 seconds. 
  if(frameCount % 180 == 0 && start < 4 ){
    // get the pis and numbers and do the switching for each rotation and angle.
    // switch ( )
    //   {



    //   }

    // if (bool) {
      rotateZaxis(HALF_PI, temp); // BACK INVERTED
      // temp == 0 ? temp = 2 : temp = 0;
      console.log("turning z // ", frameCount);
      bool=false;
     // }
    // else if (!bool) {
    //   rotateXaxis(HALF_PI, temp);
    //   // temp == 0 ? temp = 2 : temp = 0;
    //   console.log("turning x // ", frameCount);
    //   bool=true;

    // }

    start++; // go to next digit
    end++; // go to next digit

  }



}