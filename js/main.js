//CONSTANTS
const MOVE_SPEED = 5;
const PLAYER = document.getElementById('player');
const spawn = document.getElementById('spawn');
const render = document.getElementById('render');
const unrender = document.getElementById('unrender');

//-----------------------------------------------------------------

//CLASSES

class Wall{
    constructor(pos_x, pos_y, width, height){
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = width;
        this.height = height;
    }
}

//-----------------------------------------------------------------

//EVENT LISTENERS

//call move with keypress key
document.addEventListener('keypress', function(e){move(e.key)});

spawn.addEventListener('click', function(e){
    initLevels();
    loadLevel(0);
});

render.addEventListener('click', function(e){
    loadLevel(0);
});

unrender.addEventListener('click', function(e){
    unloadLevel(0);
});

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
    walls.forEach(function(wallEl){
        const elem = getComputedStyle(wallEl);
        const wall = new Wall(parseInt(elem.top), parseInt(elem.left), parseInt(elem.width), parseInt(elem.height));
        WALLS.push(wall);
    });
}

//RENDER

//render the player
function playerRender(){
    PLAYER.style.top = player_Y+'px';
    PLAYER.style.left = player_X+'px';
    checkCollisions();
}

function renderEnemies(indx){

    allLevels[indx].enemies.forEach(function(enemy){
        enemy.element.style.top = enemy.position[1] + 'px';
        enemy.element.style.left = enemy.position[0] + 'px';

        document.querySelector('body').appendChild(enemy.element);
        enemy.element.addEventListener('click', function(e){
            enemy.takeDamage(1);
        });
    });
}

//HELPER

function RndmRange(min, max){
    output = Math.floor(Math.random() * (max - min) + min);
    return output;
}

//----------------LEVELS

//LEVEL SETUP
function spawnEnemies(pos, enemyType, indx){

    const pos_x = RndmRange(pos[0][0], pos[1][0]);
    const pos_y = RndmRange(pos[0][1], pos[1][1]);

    const div = document.createElement('div');
    div.className = enemyType.className;

    const enemy = new Enemy([pos_x, pos_y], enemyType.health, enemyType.damage, div, indx);

    return enemy;
}
//-------

//LEVEL EXIT

function unloadLevel(indx){
    allLevels[indx].enemies.forEach(function(enemy){
        enemy.element.remove();
    });
}