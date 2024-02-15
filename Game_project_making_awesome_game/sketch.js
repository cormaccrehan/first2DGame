/*

The Game Project 5 - Bring it all together

*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;
var collectable;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var game_score
var flagpole
var lives
var runAgain
var gameChar_height
var bullet_x
var bullet_y

function setup() {
    createCanvas(1024, 576);
    floorPos_y = height * 3 / 4;
    lives = 4
    if (lives > 0) {
        startGame();
    }
}

function startGame() {
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    bullet_x = 182;
    bullet_y = floorPos_y - 30
    
    // Variable to control the background scrolling.
    scrollPos = 0;


    // Variable to store the real position of the gameChar in the game
    // world. Needed for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    // Boolean variables to control the movement of the game character.
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    runAgain = false;

    // Initialise arrays of scenery objects.
    
    trees_x = [100, 240, 370, 500]
    clouds = [{
            x_pos: 10,
            size: 0.5,
            y_pos: 0
        },
        {
            x_pos: 500,
            size: 0.7,
            y_pos: 0
        },
        {
            x_pos: 300,
            size: 0.7,
            y_pos: 30
        },
        {
            x_pos: 800,
            size: 0.7,
            y_pos: 30
        },

    ]

    mountains = [{
        x_pos: 100,
        size: 1,
        y_pos: 0
    }]


    collectable = [{
            x_pos: 810,
            y_pos: floorPos_y,
            isFound: false
        },
        {
            x_pos: 500,
            y_pos: floorPos_y,
            isFound: false
        }
    ]

    canyons = [{
            x_pos: 680,
            width: 25
        },
        {
            x_pos: 1000,
            width: 20
        },
        {
            x_pos: 1300,
            width: 20
        }

    ]
    
    flagpole = {
        x_pos: 1500,
        isReached: false
    }

    game_score = 0;
    lives--;

}

function draw() {


    if (lives == 0) {
        fill(0)
        textSize(100)
        text("game over", width / 2 - 250, height / 2)
        textSize(20)
        text("Press spacebar to continue", width / 2 - 150, height / 2 + 50)

        return
    }

    if (flagpole.isReached) {

        if (runAgain) {


            fill(0)
            textSize(100)
            text("level complete", width / 2 - 250, height / 2)
            textSize(20)
            text("Press spacebar to continue", width / 2 - 150, height / 2 + 50)
            return
        }
        runAgain = true;
    }

    background(100, 155, 255); // fill the sky blue

    noStroke();
    fill(0, 155, 0);
    rect(0, floorPos_y, width, height / 4); // draw some green ground

    push();
    translate(scrollPos, 0);
    drawEnemy();
    drawClouds();
    drawMountains();
    drawTrees();
    
    for (var i = 0; i < collectable.length; i++) {
        if (collectable[i].isFound == false) {
            drawCollectable(collectable[i]);
            checkCollectable(collectable[i]);
        }
    }

    for (var i = 0; i < canyons.length; i++) {

        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

    if (isPlummeting == true)

    {
        gameChar_y += 5
    }

    //Call flagpole function
    renderFlagpole()

    pop()

    //jump
    if (isFalling && floorPos_y == gameChar_y) {
        gameChar_y -= 100;
        isFalling = true;
    }

    //gravity
    if (gameChar_y < floorPos_y) {
        gameChar_y += 5;
        isFalling = true;
    }

    //landing
    if (gameChar_y == floorPos_y) {
        isFalling = false;
    }

    //Calling gameCharacter function

    drawGameChar();

    
    //Call function to shoot bullet
    drawBullet();

    gameChar_hit();

    //game score
    textSize(15)
    fill(255);
    noStroke();
    text("score:  " + game_score, 20, 20)

    //lives
    textSize(15)
    fill(255);
    noStroke();
    text("lives:  " + lives, 20, 70)

    //lives drawing
    for (i = 0; i < lives; i++) {
        fill(255, 20, 147)
        ellipse(110 + 40 * i, 65, 15, 20)
        ellipse(100 + 40 * i, 65, 15, 20)
        triangle(95 + 40 * i, 65, 115 + 40 * i, 65, 105 + 40 * i, 95)
    }

    // Logic to make the game character move or the background scroll.
    if (isLeft) 
        {
        if (gameChar_x > width * 0.2) {
            gameChar_x -= 5;
        } else {
            scrollPos += 5;
        }
    }

    if (isRight) {
        if (gameChar_x < width * 0.8) {
            gameChar_x += 5;
        } else {
            scrollPos -= 5; // negative for moving against the background
        }

        if (flagpole.isReached != true) {
            checkFlagpole();
        }
    }


    // Update real position of gameChar for collision detection.
    gameChar_world_x = gameChar_x - scrollPos;

    if (gameChar_y > canvas.height && lives > 0) {
        startGame();
    }

    if (bullet_x == 1497) {
        bullet_x = 182;
    }
    if (bullet_x < 1500) {
        shootBullet();
    }


    if (bullet_x == gameChar_x && bullet_y > gameChar_y - 32 && bullet_y < gameChar_y)
    {
        lives--;
        bullet_x = 182
    }
    return
}

// Draw clouds.
function drawClouds() {
    for (var i = 0; i < clouds.length; i++) {
        fill(255, 255, 255)
        ellipse(clouds[i].x_pos + 200 * clouds[i].size, clouds[i].y_pos + 100 * clouds[i].size, 100 * clouds[i].size, 50 * clouds[i].size)

        ellipse(clouds[i].x_pos + 250 * clouds[i].size, clouds[i].y_pos + 100 * clouds[i].size, 100 * clouds[i].size, 50 * clouds[i].size)

        ellipse(clouds[i].x_pos + 150 * clouds[i].size, clouds[i].y_pos + 100 * clouds[i].size, 100 * clouds[i].size, 50 * clouds[i].size)

        ellipse(clouds[i].x_pos + 175 * clouds[i].size, clouds[i].y_pos + 75 * clouds[i].size, 75 * clouds[i].size, 50 * clouds[i].size)

        ellipse(clouds[i].x_pos + 225 * clouds[i].size, clouds[i].y_pos + 75 * clouds[i].size, 75 * clouds[i].size, 50 * clouds[i].size)

    }
}

// Draw mountains.
function drawMountains() {
    for (var i = 0; i < mountains.length; i++)

    {
        // middle mountain
        strokeWeight(2);
        stroke(51);
        fill(220, 220, 220);
        triangle(mountains[i].x_pos + 400,
            432, mountains[i].x_pos + 600,
            432, mountains[i].x_pos + 500,
            250);


        //left mountains[i]
        triangle(mountains[i].x_pos + 300, 432, mountains[i].x_pos + 500, 432, mountains[i].x_pos + 400, 200);
        //right mountains[i]
        triangle(mountains[i].x_pos + 500, 432, mountains[i].x_pos + 700, 432, mountains[i].x_pos + 600, 200);


        // middle ice cap
        noStroke();
        fill(255, 255, 255);
        triangle(mountains[i].x_pos + 495, 260, mountains[i].x_pos + 515, 280, mountains[i].x_pos + 500, 250);
        triangle(mountains[i].x_pos + 477, 295, mountains[i].x_pos + 505, 270, mountains[i].x_pos + 500, 250);
        // left ice cap
        triangle(mountains[i].x_pos + 440, 300, mountains[i].x_pos + 424, 260, mountains[i].x_pos + 400, 250);
        triangle(mountains[i].x_pos + 360, 300, mountains[i].x_pos + 424, 260, mountains[i].x_pos + 400, 200);
        // Right ice cap
        triangle(mountains[i].x_pos + 575, 260, mountains[i].x_pos + 595, 280, mountains[i].x_pos + 600, 200);
        triangle(mountains[i].x_pos + 595, 260, mountains[i].x_pos + 632, 280, mountains[i].x_pos + 600, 200);

    }

}
// Draw trees.
function drawTrees() {

    for (var i = 0; i < trees_x.length; i++) {
        strokeWeight(1)
        fill(160, 82, 45)
        rect(trees_x[i] + 50, floorPos_y - 150, 30, 150)

        noStroke();
        fill(127, 255, 0)
        ellipse(trees_x[i] + 65, floorPos_y - 135, 100, 100)
        fill(123, 255, 45)
        ellipse(trees_x[i] + 100, floorPos_y - 135, 50, 50)
        ellipse(trees_x[i] + 90, floorPos_y - 105, 50, 50)
        ellipse(trees_x[i] + 30, floorPos_y - 150, 50, 50)
        ellipse(trees_x[i] + 50, floorPos_y - 170, 50, 50)
        ellipse(trees_x[i] + 30, floorPos_y - 110, 50, 50)
        ellipse(trees_x[i] + 80, floorPos_y - 170, 60, 50)
        ellipse(trees_x[i] + 70, floorPos_y - 130, 70, 30)
    }

}

// ---------------------
// Key control functions
// ---------------------

function keyPressed()

{
    //next level logic
    if (flagpole.isReached && key == ' ') {
        nextLevel();
        return
    } else if (lives == 0 && key == ' ') {
        returnToStart();
        return
    }
    
    console.log("press" + keyCode);
    console.log("press" + key);


    if (keyCode == 37) {
        isLeft = true;;
        ''
    }
    if (keyCode == 39) {
        isRight = true;
    }

    if (keyCode == 32) {
        isFalling = true;
    }

}

function keyReleased() {

    console.log("release" + keyCode);
    console.log("release" + key);


    if (keyCode == 37) {
        isLeft = false;

    }
    if (keyCode == 39) {
        isRight = false;

    }

    if (keyCode == 32) {
        isFalling = false;
    }

}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {
    // draw game character


    if (isLeft && isFalling) {
        // jumping-left code


        //body
        fill(0, 0, 255)
        rect(gameChar_x, gameChar_y - 35, 10, 15)

        //Right leg
        fill(255, 0, 0)
        rect(gameChar_x + 5, gameChar_y - 25, 5, 12)
        //left leg
        rect(gameChar_x, gameChar_y - 25, 5, 9)
        //head
        fill(255, 228, 196)
        ellipse(gameChar_x + 4, gameChar_y - 40, 10, 12)

        //left arm
        fill(0, 0, 255)
        stroke(1)
        rect(gameChar_x + 3, gameChar_y - 35, 5, 10)

        //eye
        ellipse(gameChar_x + 1, gameChar_y - 41, 1, 1)


    } else if (isRight && isFalling) {
        // jumping-right code
        //body
        fill(0, 0, 255)
        rect(gameChar_x, gameChar_y - 35, 10, 15)

        //Right leg
        fill(255, 0, 0)
        rect(gameChar_x + 5, gameChar_y - 25, 5, 9)
        //left leg
        rect(gameChar_x, gameChar_y - 25, 5, 12)
        //head
        fill(255, 228, 196)
        ellipse(gameChar_x + 4, gameChar_y - 40, 10, 12)

        //left arm
        fill(0, 0, 255)
        stroke(1)
        rect(gameChar_x, gameChar_y - 35, 5, 10)

        //eye
        ellipse(gameChar_x + 7, gameChar_y - 41, 1, 1)


    } else if (isLeft) {
        // walking left code



        fill(255, 0, 0)
        //Right leg
        rect(gameChar_x + 5, gameChar_y - 15, 5, 18)
        //left leg
        rect(gameChar_x, gameChar_y - 15, 5, 15)

        //body
        fill(0, 0, 255)
        rect(gameChar_x, gameChar_y - 25, 10, 15)
        //head
        fill(255, 228, 196)
        ellipse(gameChar_x + 4, gameChar_y - 30, 10, 12)

        //left arm
        fill(0, 0, 255)
        stroke(1)
        rect(gameChar_x + 3, gameChar_y - 25, 5, 10)

        //eye
        ellipse(gameChar_x + 1, gameChar_y - 31, 1, 1)

    } else if (isRight) {
        // walking right code




        //right
        fill(255, 0, 0)
        //Right leg
        rect(gameChar_x + 5, gameChar_y - 15, 5, 15)
        //left leg
        rect(gameChar_x, gameChar_y - 15, 5, 18)

        //body
        fill(0, 0, 255)
        rect(gameChar_x, gameChar_y - 25, 10, 15)
        //head
        fill(255, 228, 196)
        ellipse(gameChar_x + 4, gameChar_y - 30, 10, 12)
        //left arm
        fill(0, 0, 255)

        //right arm
        stroke(1)
        rect(gameChar_x, gameChar_y - 25, 5, 10)
        //eye
        ellipse(gameChar_x + 7, gameChar_y - 31, 1, 1)


    } else if (isFalling || isPlummeting) {
        // jumping facing forwards code

        //body
        fill(0, 0, 255)
        rect(gameChar_x - 5, gameChar_y - 30, 15, 15)
        //head
        fill(255, 228, 196)
        ellipse(gameChar_x + 2, gameChar_y - 35, 10, 10)
        //left arm
        fill(0, 0, 255)
        rect(gameChar_x - 13, gameChar_y - 31, 30, 5)
        fill(255, 0, 0)
        //Right leg
        rect(gameChar_x + 5, gameChar_y - 20, 5, 12)
        //left leg
        rect(gameChar_x - 5, gameChar_y - 20, 5, 12)

        fill(0, 0, 0)
        ellipse(gameChar_x + 5, gameChar_y - 33, 1, 1)
        ellipse(gameChar_x, gameChar_y - 33, 1, 1)


    } else {
        // standing front facing code

        fill(255, 0, 0)
        //Right leg
        rect(gameChar_x + 5, gameChar_y - 15, 5, 18)
        //left leg
        rect(gameChar_x - 5, gameChar_y - 15, 5, 18)

        //body
        fill(0, 0, 255)
        rect(gameChar_x - 5, gameChar_y - 25, 15, 15)
        //head
        fill(255, 228, 196)
        ellipse(gameChar_x + 2, gameChar_y - 30, 10, 10)
        //left arm
        fill(0, 0, 255)
        rect(gameChar_x - 10, gameChar_y - 25, 5, 10)
        //right arm
        rect(gameChar_x + 10, gameChar_y - 25, 5, 10)

        //eye
        ellipse(gameChar_x + 5, gameChar_y - 31, 1, 1)
        ellipse(gameChar_x, gameChar_y - 31, 1, 1)
    }

}

function drawBullet() {
    stroke(0);
    fill(255, 140, 0);
    ellipse(bullet_x, bullet_y, 6, 6);
}

function shootBullet() {
    bullet_x += 5;
}

function gameChar_hit() {
    if (bullet_x == gameChar_x && bullet_y == gameChar_height) {
        lives--;
        return true;
    } else {
        return false;
    }
}

function drawEnemy()

{
    //body
    fill(128, 0, 128);
    rect(100, floorPos_y - 50, 30, 40);
    //legs
    rect(100, floorPos_y - 50, 12, 50);
    rect(118, floorPos_y - 50, 12, 50);
    //right arm
    rect(100, floorPos_y - 35, 50, 10);
    //left arm
    rect(95, floorPos_y - 35, 10, 18);
    //left eye
    fill(255)
    triangle(100, floorPos_y - 40, 115, floorPos_y - 40, 108, floorPos_y - 30);
    //right eye
    fill(255);
    triangle(115, floorPos_y - 40, 130, floorPos_y - 40, 123, floorPos_y - 30);
    //pupil
    fill(0);
    rect(109, floorPos_y - 38, 3, 3);
    rect(124, floorPos_y - 38, 3, 3);
    //gun
    fill(0);
    rect(150, floorPos_y - 35, 10, 20);
    rect(150, floorPos_y - 35, 25, 10);
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)

{
    //     for(var i = 0; i < canyons.length; i++)

    fill(100, 155, 255);
    ellipse(t_canyon.x_pos, 440, t_canyon.width + 85, 20)
    ellipse(t_canyon.x_pos, 455, t_canyon.width + 100, 20)
    ellipse(t_canyon.x_pos, 470, t_canyon.width + 50, 50)
    ellipse(t_canyon.x_pos, 500, t_canyon.width + 50, 50)
    ellipse(t_canyon.x_pos, 530, t_canyon.width + 80, 40)
    rect(t_canyon.x_pos - 40, 530, 80, t_canyon.width + 44)

    strokeWeight(12.0);
    strokeCap(ROUND);
    line(300, 200, 100, 20);
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon) {
    if (gameChar_world_x > t_canyon.x_pos - t_canyon.width && gameChar_world_x < t_canyon.x_pos + t_canyon.width && gameChar_y >= floorPos_y) {
        isPlummeting = true;
    }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable) {
    strokeWeight(2);
    stroke(51);
    fill(260, 40, 130);
    quad(t_collectable.x_pos + 10, t_collectable.y_pos - 30, t_collectable.x_pos, t_collectable.y_pos - 20, t_collectable.x_pos + 10, t_collectable.y_pos, t_collectable.x_pos + 20, t_collectable.y_pos - 20)
    noStroke();
    fill(255);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable) {
    var d = dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos);


    if (d < 10) {
        t_collectable.isFound = true;
        game_score += 1
    }
}


function renderFlagpole() {
    push();
    stroke(0, 0, 0);
    strokeWeight(5);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
    
    if (flagpole.isReached) {
        noStroke();
        fill(255, 255, 0);
        rect(flagpole.x_pos, floorPos_y - 200, 30, 30);
    } else {
        noStroke();
        fill(255, 255, 0);
        rect(flagpole.x_pos, floorPos_y, 30, 30);
    }
    pop();
}

function checkFlagpole() {
    console.log("check flagpole")

    d = abs(gameChar_world_x - flagpole.x_pos);
    if (d < 10) {
        flagpole.isReached = true;
    }
}