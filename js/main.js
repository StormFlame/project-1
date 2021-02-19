//CONSTANTS
const MOVE_SPEED = 5;
const PLAYER = document.getElementById('player');

//-----------------------------------------------------------------

//CLASSES

class Wall{
    constructor(pos_x, pos_y, width, height){
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = width;
        this.height = height;
        WALLS.push(this);
    }
}

//-----------------------------------------------------------------

//EVENT LISTENERS

//call move with keypress key
document.addEventListener('keypress', function(e){move(e.key)});

//-----------------------------------------------------------------

//CALL START FUNCTIONS
initialize();
initializeWalls();

//------------------- FUNCTIONS

//INITIALIZATION

function initialize(){
     player_X = 500;
     player_Y = 100;
    //MOVE_UP, MOVE_DOWN, MOVE_RIGHT, MOVE_LEFT
    moveDirToggle = [1,1,1,1];
}

function initializeWalls(){
    walls = document.querySelectorAll('.wall');
    walls.forEach(function(wall){
        const elem = getComputedStyle(wall);
        new Wall(parseInt(elem.top), parseInt(elem.left), parseInt(elem.width), parseInt(elem.height));
    });
}

//RENDER

//render the player
function playerRender(){
    PLAYER.style.top = player_Y+'px';
    PLAYER.style.left = player_X+'px';
    checkCollisions();
}