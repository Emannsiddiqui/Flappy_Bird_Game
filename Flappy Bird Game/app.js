//declaring variables
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context; 

//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12 ratio
let birdHeight = 24;
//setting the coordinate on which the bird will be placed wrt canvas
let birdX = boardWidth/8; //360/8 = 45 = X position
let birdY = boardHeight/2; //640/2 =  320 = Y position
let birdImg;

//pipes
let pipeArr = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//concept
let speedX = -2; //pipes moving left speed
let speedY = 0; //bird jumping speed -> bird is not jumping
let moveDown = 0.4; //to move the bird downwards

let gameOver = false;
let score =0;

//bird object
let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing

    //draw flappy bird
    //context.fillStyle = "green";
    //context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load Images
    birdImg = new Image(); //image object
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }
    topPipeImg = new Image(); //top pipe image object
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image(); //bottom pipe Image object
    bottomPipeImg.src = "./bottompipe.png";


    requestAnimationFrame(update);
    //change interval of pipes after every 1.5s
    setInterval(placePipes, 1500); //1500ms = 1.5s 
    document.addEventListener("keydown", moveBird);
    document.addEventListener("click", moveBird);
}

//function for updating the canvas frame
function update() {
    requestAnimationFrame(update);
    if(gameOver){
        return;
    }
    context.clearRect(0, 0, boardWidth, boardHeight); //to clear the previous frames

    //bird 
    speedY += moveDown;
    bird.y = Math.max(bird.y += speedY, 0); //moves bird upwards & apply limit to make bird stay under the canvas
    //to create the bird over and over again for each frame
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height); 

    if(bird.y > board.height){
        gameOver = true;
    }

    //pipes
    for(let i = 0; i<pipeArr.length; i++){
        let pipe = pipeArr[i];
        pipe.x += speedX; //updating pipes or shifting pipes
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if(!pipe.passed &&bird.x > pipe.x + pipe.width) {
            score += 0.5; //so it updates to 1 (bc there are 2 pipes! so 0.5 * 2 = 1)
            pipe.passed = true;
        }

        if(detectCollision(bird, pipe)){
            gameOver = true;
        }

        //clear pipes
        while( pipeArr.length > 0 && pipeArr[0].x < -pipeWidth){
            pipeArr.shift(); //removes first element from the array
        }
    }
    
    //displaying scores
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45); //x pos: 5, y pos: 45

    if(gameOver){
        context.fillText("GAME OVER!", 37, 300);
    }
}

//function for placing pipes
function placePipes(){
    if(gameOver){
        return;
    }
    //creating random pipe var
    //(0-1) * pipeHeight/2
    // if 0 -> (pipeHeight/4)
    //if 1 -> -128 -256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    //so the height ranges from 1 or 3 quarters shifting upwards
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2); 
    let openingSpace = board.height/4; //640/4 = 160


    //Top pipe object
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //checks whether the bird has passed the pipe or not
    }
    pipeArr.push(topPipe);

    
    //bottom pipe object
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false //checks whether the bird has passed t
         
    }
    pipeArr.push(bottomPipe);
}

//making bird move fx
//requires parameter that is a key
function moveBird(e){
    if(e.type === "click" || e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        speedY = -6;

        //reset game
        if(gameOver){
            bird.y = birdY;
            pipeArr = [];
            score = 0;
            gameOver = false;
        }
    }
}
//function to mak the bird hit and fall
function detectCollision(a, b){
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}