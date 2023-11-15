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
// **** DRAW SETUP ****
let get_pits = "#"; // start out with a blank
// concat with the rest of the shizz, so start == 1 really

// let get_pits = localStorage.getItem('pi_digits');

// convert from hex to rgb for the canvas background
let rgb = [
    parseInt(cube_bgcolor.substr(-6, 2), 16),
    parseInt(cube_bgcolor.substr(-4, 2), 16),
    parseInt(cube_bgcolor.substr(-2), 16)
];

var random_digits = [];
for (let iran = 0; iran < 15; iran++) {
    var r = Math.floor(Math.random() * (8 - 2) + 2);
  if (r != random_digits[iran-1]){ // if not duplicate to last number
     random_digits.push(r);
  }

}
console.log("random: ", random_digits);


// PRE-SETUP VARS AND STUFF

// // SETUP VARIABLES 

// GLOBALS
// setup for the vectors and 3d array(matrix)
let dim;
let cube;
let move;
let bool = true;
let start = 0;
let end = 1;
let is_solving = true;  // start as solving
let prev_pit = 0;
let repeat = false;
let scramble = true;

// CONSTANTS 
const BACK = -1;
const FRONT = 1;
const LEFT = -1;
const RIGHT = 1;
const UP = -1;
const DOWN = 1;
const Z_SLICE = 0;
const X_SLICE = 0;
const Y_SLICE = 0;


// SETUP AND DRAW
// CREATE FACE AND CUBIE CLASSES TO DRAW
// CREATE TURNING FUNCTIONS FOR EACH FACE
function setup() {

    // *** FACE ***
    class Face {
        normal; // normal vector
        // COLORS FOR FILL (color type did not work)
        red;
        green;
        blue;

        // **** CONSTRUCTOR ****
        constructor(n, r, g, b) {
            this.normal = n;
            this.red = r;
            this.green = g;
            this.blue = b;
        }

        // **** FUNCTIONS *****  
        // TURN FACES
        turnZ(angle) {
            let vz = createVector();
            vz.x = round(this.normal.x * cos(angle) - this.normal.y * sin(angle));
            vz.y = round(this.normal.x * sin(angle) + this.normal.y * cos(angle));
            vz.z = round(this.normal.z);
            this.normal = vz;
        }

        turnY(angle) {
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
            translate(30 * this.normal.x, 30 * this.normal.y, 30 * this.normal.z);
            if (abs(this.normal.x)) {
                rotateY(HALF_PI);
            }
            else if (this.normal.y) {
                rotateX(HALF_PI);
            }
            // console.log(this.normal.x , this.normal.y, this.normal.z); seems to be working fine.. 
            square(0, 0, 60);
            pop();
        }
    } // end face

    // *** CUBIE ***
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

        // **** CONSTRUCTOR **** 
        constructor(m, l, x, y, z) {
            this.matrix = m;
            this.length = l;
            this.xi = x;
            this.yi = y;
            this.zi = z;

            // each cubie will have information for all 6 faces
            this.faces[0] = new Face(createVector(0, 0, -1), 0, 0, 255); // BACK - pass a new vector? and blue
            this.faces[1] = new Face(createVector(0, 0, 1), 0, 255, 0); // FRONT - green
            this.faces[2] = new Face(createVector(0, 1, 0), 255, 255, 255); // UP - white
            this.faces[3] = new Face(createVector(0, -1, 0), 255, 255, 0); // DOWN - yellow
            this.faces[4] = new Face(createVector(1, 0, 0), 255, 140, 0); // LEFT - orange
            this.faces[5] = new Face(createVector(-1, 0, 0), 255, 0, 0); // RIGHT - red      
        }

        // show the cubie, translate to center, and show face colors
        show() {
            noFill();
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

        // **** FUNCTIONS *****  
        update(newx, newy, newz) {
            this.xi = newx;
            this.yi = newy;
            this.zi = newz;
        }

        turnZfaces(angle) {
            for (let f of this.faces) {
                f.turnZ(angle);
            }
        }

        turnYfaces(angle) {
            for (let f of this.faces) {
                f.turnY(angle);
            }
        }

        turnXfaces(angle) {
            for (let f of this.faces) {
                f.turnX(angle);
            }
        }


    } // end cubie

    // **** MOVE ****
    class Move {
        angle = 0;
        x = 0;
        y = 0;
        z = 0;
        dir;
        animate = false;

        constructor(x, y, z, dir) {
            this.x = x;
            this.y = y;
            this.z = z;
            this.dir = dir;

        }

        // ***** FUNCTIONS *****
        start() {
            this.animate = true;
        }

        update() {
            if (this.animate) {
                this.angle += this.dir * 0.1;
                if (abs(this.angle) > HALF_PI) {
                    this.angle = 0;
                    this.animate = false;
                    console.log("animating", this.angle);
                    // FIGURE OUT THIS ANGLE AND DIRECTION SHIT
                    rotateZaxis(this.angle, this.z);

                }
            }
        }

    }// END MOVE CLASS

    // *** END CLASSES  ****

    // *** PRECANVAS ***

    let tempits = localStorage.getItem('pi_digits');
    if (tempits) {
        // console.log("|",tempits,"|");
        get_pits += tempits;
        get_pits += "##"; // add two for ending? something along this line. 
    }
    else {
        get_pits = "314159";
    }

    console.log(`get pits: | ${get_pits} |`);

  document.querySelector("#display_digits").innerHTML = `${get_pits.length-2}`;


    // **** START CANVAS AND SETUP ****

    let canvas = createCanvas(450, 420, WEBGL);
    canvas.parent("canvas_holder");
    frameRate(60);


    // SETUP VARIABLES 

    dim = Number(3);
    cube = Array(dim * dim * dim).fill(); // 1D array of matrices
    index = 0;
    // ATTEMPT 1
    // for every cubie, make a cube with correct length and offset to center
    for (let _X = 0, xx = -1; _X < dim; _X++, xx++) {
        for (let _Y = 0, yy = -1; _Y < dim; _Y++, yy++) {
            for (let _Z = 0, zz = -1; _Z < dim; _Z++, zz++) {
                let _len = 60;
                let offset = (dim - 1) * _len * 0.5;
                let x = _X * _len - offset;
                let y = _Y * _len - offset;
                let z = _Z * _len - offset;
                let m = createVector(x, y, z);

                cube[index] = new Cubie(m, _len, xx, yy, zz);
                // console.log("x: ", cube[index].xi, "y: ", cube[index].yi, "z: ", cube[index].zi);
                index++;
            }
        }
    }
    index = 0;
    // z face, clockwise
    // move = new Move(0,0,1,-1); 
    // // if (frameCount > 200 && frameCount % 200 == 0){
    //   move.start();
    //   console.log("starting", frameCount);
    // // }





} // end setup

// X AXIS ONLY
function rotateXaxis(angle, axis_index) {

    for (let i = 0; i < cube.length; i++) {
        // in z axis plane, the front?  
        qb = cube[i];
        if (qb.xi == axis_index) { // 0 == back, 1 = middle, 2 == front 


            qb.matrix_next = createVector();
            // rotate?
            qb.matrix_next.y = round(qb.matrix.y * cos(angle) - qb.matrix.z * sin(angle));
            qb.matrix_next.z = round(qb.matrix.y * sin(angle) + qb.matrix.z * cos(angle));
            qb.matrix_next.x = round(qb.matrix.x);
            // translate?
            qb.matrix = qb.matrix_next;

            qb.update((qb.matrix.x / 60), (qb.matrix.y / 60), (qb.matrix.z / 60));
            qb.turnXfaces(angle);
        } // end if axis    

    }
} // end X turn  


// Y AXIS ONLY
function rotateYaxis(angle, axis_index) {

    for (let i = 0; i < cube.length; i++) {
        // in z axis plane, the front?  
        qb = cube[i];
        if (qb.yi == axis_index) { // 0 == back, 1 = middle, 2 == front 


            qb.matrix_next = createVector();
            qb.matrix_next.x = round(qb.matrix.x * cos(angle) - qb.matrix.z * sin(angle));
            qb.matrix_next.z = round(qb.matrix.x * sin(angle) + qb.matrix.z * cos(angle));
            qb.matrix_next.y = round(qb.matrix.y);
            qb.matrix = qb.matrix_next;

            qb.update((qb.matrix.x / 60), (qb.matrix.y / 60), (qb.matrix.z / 60));
            qb.turnYfaces(angle);
        } // end if axis     

    }
} // end Y turn


// Z AXIS ONLY
function rotateZaxis(angle, axis_index) {

    console.log("starting rotation Z", frameCount);
    for (let i = 0; i < cube.length; i++) {
        // in z axis plane, the front?  
        qb = cube[i];
        if (qb.zi == axis_index) { // 0 == back, 1 = middle, 2 == front 

            qb.matrix_next = createVector();
            qb.matrix_next.x = round(qb.matrix.x * cos(angle) - qb.matrix.y * sin(angle));
            qb.matrix_next.y = round(qb.matrix.x * sin(angle) + qb.matrix.y * cos(angle));
            qb.matrix_next.z = round(qb.matrix.z);
            qb.matrix = qb.matrix_next;

            qb.update((qb.matrix.x / 60), (qb.matrix.y / 60), (qb.matrix.z / 60));
            qb.turnZfaces(angle);
        } // end if axis

    }
} // end Z turn




// **** DRAW ****


function draw() {
    rgb[0] = parseInt(cube_bgcolor.substr(-6, 2), 16);
    rgb[1] = parseInt(cube_bgcolor.substr(-4, 2), 16);
    rgb[2] = parseInt(cube_bgcolor.substr(-2), 16);

    background(rgb[0], rgb[1], rgb[2]);
    // camera controls for free rotation
    orbitControl(1, 1, 0, { freeRotation: true }); //ez pz

    // move.update();


    // ATTEMPT 2
    for (let i = 0; i < cube.length; i++) {
        push();
        // if (cube[i].zi == move.z){
        //   rotateZ(move.angle);
        // }
        cube[i].show();
        pop();
    }

    // before all of this, scramble. then start

    // is_solving = false;
    // scramble
    if (frameCount % 60 == 0 && scramble) {
        


        // if finished scrambling, do it
        if (index >= random_digits.length-1) {
            scramble = false;
            prev_pit = 0; // reset for "solve"
        }
        console.log("random_digits", random_digits);


        if (random_digits[index] >= prev_pit) {
            // if (repeat) {
            //   curr_digit = get_pits.substring(start-1,start);
            //   console.log("repeat move: ", curr_digit);
            // }
            switch (random_digits[index]) {
                // 
                case 2:
                    // UP 
                    console.log("UP MOVE");
                    document.querySelector("#scramble").innerHTML += "U";
                    rotateYaxis(HALF_PI, UP);
                    repeat = false;
                    break;
                case 3:
                    // DOWN 
                    console.log("DOWN MOVE");
                    document.querySelector("#scramble").innerHTML += "D";
                    rotateYaxis(-1 * HALF_PI, DOWN);
                    repeat = false;
                    break;
                case 4:
                    // RIGHT
                    console.log("RIGHT MOVE");
                    document.querySelector("#scramble").innerHTML += "R";
                    rotateXaxis(HALF_PI, RIGHT);
                    repeat = false;
                    break;
                case 5:
                    // LEFT
                    console.log("LEFT MOVE");
                    document.querySelector("#scramble").innerHTML += "L";
                    rotateXaxis(HALF_PI, LEFT);
                    repeat = false;
                    break;
                case 6:
                    // FRONT
                    console.log("FRONT MOVE");
                    document.querySelector("#scramble").innerHTML += "F";
                    rotateZaxis(HALF_PI, FRONT);
                    repeat = false;
                    break;
                case 7:
                    // BACK 
                    console.log("BACK MOVE");
                    document.querySelector("#scramble").innerHTML += "B";
                    rotateZaxis(-1 * HALF_PI, BACK);
                    repeat = false;
                    break;
                default:
                    // console.log("something went wrong here, #: ", curr_pit);
                    // is_solving = false;
                    console.log("index:", index,"repeat, #: ", random_digits[index]);  
                    repeat = true;
                    break;
            }
            // if (repeat) {
            //   curr_digit = get_pits.substring(start,start+1);
            console.log("repeat move: ", random_digits[index]);
            // }        
            // get ready for next move
            prev_pit = random_digits[index];
        } // END CLOCKWISE
        else { // INVERSE, COUNTER-CLOCKWISE MOVES
            // if (repeat) {
            //   curr_digit = get_pits.substring(start-1,start);
            //   console.log("repeat move: ", curr_digit);
            // }
            switch (random_digits[index]) {

                case 2:
                    // UP INVERSE
                    console.log("UP INVERTED MOVE");
                    document.querySelector("#scramble").innerHTML += "U\'";
                    rotateYaxis(-1 * HALF_PI, UP);
                    repeat = false;
                    break;
                case 3:
                    // DOWN INVERSE
                    console.log("DOWN INVERTED MOVE");
                    document.querySelector("#scramble").innerHTML += "D\'";
                    rotateYaxis(HALF_PI, DOWN);
                    repeat = false;
                    break;
                case 4:
                    // RIGHT INVERSE
                    console.log("RIGHT INVERTED MOVE");
                    document.querySelector("#scramble").innerHTML += "R\'";
                    rotateXaxis(-1 * HALF_PI, RIGHT);
                    repeat = false;
                    break;
                case 5:
                    // LEFT INVERSE
                    console.log("LEFT INVERTED MOVE");
                    document.querySelector("#scramble").innerHTML += "L\'";
                    rotateXaxis(-1 * HALF_PI, LEFT);
                    repeat = false;
                    break;
                case 6:
                    // FRONT INVERSE 
                    console.log("FRONT INVERTED MOVE");
                    document.querySelector("#scramble").innerHTML += "F\'";
                    rotateZaxis(-1 * HALF_PI, FRONT);
                    repeat = false;
                    break;
                case 7:
                    // BACK INVERSE
                    console.log("BACK INVERTED MOVE");
                    document.querySelector("#scramble").innerHTML += "B\'";
                    rotateZaxis(HALF_PI, BACK);
                    repeat = false;
                    break;
                default:
                    console.log("index:", index,"repeat, #: ", random_digits[index]);
                    repeat = true; // repeat once?
                    // is_solving = false;
                    break;
            }
            // if (repeat) {
            //   curr_digit = get_pits.substring(start,start+1);
            //   console.log("repeat move: ", curr_digit);
            // }   
            // get ready for next move
            prev_pit = random_digits[index];
        }
        index++; // next scramble
        document.querySelector("#scramble").innerHTML += " ";


    }// end scramble




    // frameCount
    // right now every 2 seconds. 
    // do {
    if (frameCount % 100 == 0 && is_solving && !scramble) {

        // get the pis and numbers and do the switching for each rotation and angle.'

        const curr_pit = get_pits.substring(start, start + 1);

        // repeat last digit?


        // console.log("pits:", get_pits, "length: ", get_pits.length);
        runPi(start, start + 1); // from pi.js
        // REGULAR CLOCKWISE MOVES
        if (curr_pit >= prev_pit) {
            // if (repeat) {
            //   curr_digit = get_pits.substring(start-1,start);
            //   console.log("repeat move: ", curr_digit);
            // }
            switch (curr_pit) {
                // 
                case "2":
                    // UP 
                    console.log("UP MOVE");
                    document.querySelector("#pi_move").innerHTML = "U";
                    rotateYaxis(HALF_PI, UP);
                    repeat = false;
                    break;
                case "3":
                    // DOWN 
                    console.log("DOWN MOVE");
                    document.querySelector("#pi_move").innerHTML = "D";
                    rotateYaxis(-1 * HALF_PI, DOWN);
                    repeat = false;
                    break;
                case "4":
                    // RIGHT
                    console.log("RIGHT MOVE");
                    document.querySelector("#pi_move").innerHTML = "R";
                    rotateXaxis(HALF_PI, RIGHT);
                    repeat = false;
                    break;
                case "5":
                    // LEFT
                    console.log("LEFT MOVE");
                    document.querySelector("#pi_move").innerHTML = "L";
                    rotateXaxis(HALF_PI, LEFT);
                    repeat = false;
                    break;
                case "6":
                    // FRONT
                    console.log("FRONT MOVE");
                    document.querySelector("#pi_move").innerHTML = "F";
                    rotateZaxis(HALF_PI, FRONT);
                    repeat = false;
                    break;
                case "7":
                    // BACK 
                    console.log("BACK MOVE");
                    document.querySelector("#pi_move").innerHTML = "B";
                    rotateZaxis(-1 * HALF_PI, BACK);
                    repeat = false;
                    break;
                default:
                    // console.log("something went wrong here, #: ", curr_pit);
                    // is_solving = false;
                    repeat = true;
                    break;
            }
            // if (repeat) {
            //   curr_digit = get_pits.substring(start,start+1);
            //   console.log("repeat move: ", curr_digit);
            // }        
            // get ready for next move
            prev_pit = curr_pit;
        } // END CLOCKWISE
        else { // INVERSE, COUNTER-CLOCKWISE MOVES
            // if (repeat) {
            //   curr_digit = get_pits.substring(start-1,start);
            //   console.log("repeat move: ", curr_digit);
            // }
            switch (curr_pit) {

                case "2":
                    // UP INVERSE
                    console.log("UP INVERTED MOVE");
                    document.querySelector("#pi_move").innerHTML = "U\'";
                    rotateYaxis(-1 * HALF_PI, UP);
                    repeat = false;
                    break;
                case "3":
                    // DOWN INVERSE
                    console.log("DOWN INVERTED MOVE");
                    document.querySelector("#pi_move").innerHTML = "D\'";
                    rotateYaxis(HALF_PI, DOWN);
                    repeat = false;
                    break;
                case "4":
                    // RIGHT INVERSE
                    console.log("RIGHT INVERTED MOVE");
                    document.querySelector("#pi_move").innerHTML = "R\'";
                    rotateXaxis(-1 * HALF_PI, RIGHT);
                    repeat = false;
                    break;
                case "5":
                    // LEFT INVERSE
                    console.log("LEFT INVERTED MOVE");
                    document.querySelector("#pi_move").innerHTML = "L\'";
                    rotateXaxis(-1 * HALF_PI, LEFT);
                    repeat = false;
                    break;
                case "6":
                    // FRONT INVERSE 
                    console.log("FRONT INVERTED MOVE");
                    document.querySelector("#pi_move").innerHTML = "F\'";
                    rotateZaxis(-1 * HALF_PI, FRONT);
                    repeat = false;
                    break;
                case "7":
                    // BACK INVERSE
                    console.log("BACK INVERTED MOVE");
                    document.querySelector("#pi_move").innerHTML = "B\'";
                    rotateZaxis(HALF_PI, BACK);
                    repeat = false;
                    break;
                default:
                    console.log("repeat, #: ", curr_pit);
                    repeat = true; // repeat once?
                    // is_solving = false;
                    break;
            }
            // if (repeat) {
            //   curr_digit = get_pits.substring(start,start+1);
            //   console.log("repeat move: ", curr_digit);
            // }   
            // get ready for next move
            prev_pit = curr_pit;
        }

        console.log(`pit: ${curr_pit}`)
        // console.log(`start: ${get_pits.substring(start,end)} | end: ${end}`)
        start++; // go to next digit
        end++; // go to next digit

        // check if at the end of the string? might be off by 1?
        if (start >= get_pits.length || end >= get_pits.length) {
            console.log("ending...");
            is_solving = false; // turn false, stop the rotation loop
            // noLoop(); // stop the draw function, should finish this until next draw
            // no luck solving within these digits. 
            // return; // how to stop draw?
        }


    }
    // } while (repeat);



}