//testing vars
const spawn = document.getElementById('spawn');
const render = document.getElementById('render');
const unrender = document.getElementById('unrender');
//end testing vars

const body = document.querySelector('body');

//-----------------------------------------------------------------

//STATE
let currentLevel = 0;

//-----------------------------------------------------------------


//Objects
const player = {
    health: 6,
    damage: 1,
    speed: 5,
    pos: [0,0],
    size: [100, 100],
    moveDirToggle: [1,1,1,1],
    element: document.getElementById('player'),
}

//-----------------------------------------------------------------

//EVENT LISTENERS

//call move with keypress key
document.addEventListener('keypress', function(e){playerMove(e.key)});

spawn.addEventListener('click', function(e){
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

//------------------- FUNCTIONS

//INITIALIZATION

function initialize(){

    player.pos = [80,100];

    //initialize levels
    initLevels();
    renderWalls(currentLevel);
    playerRender();
}

//RENDER

//render the player
function playerRender(){
    player.element.style.top = player.pos[1]+'px';
    player.element.style.left = player.pos[0]+'px';
}

//render current level walls
function renderWalls(indx){
    allLevels[indx].walls.forEach(function(wall){
        wall.element.className = 'wall';
        wall.element.style.top = wall.pos_y + 'px';
        wall.element.style.left = wall.pos_x + 'px';
        wall.element.style.width = wall.width + 'px';
        wall.element.style.height = wall.height + 'px';
        body.appendChild(wall.element);
    });
}

//render the current level enemies
function renderEnemies(indx){

    allLevels[indx].enemies.forEach(function(enemy){
            enemy.element.style.top = enemy.pos[1] + 'px';
            enemy.element.style.left = enemy.pos[0] + 'px';

            body.appendChild(enemy.element);

            enemy.element.addEventListener('click', function(e){
            enemy.takeDamage(1);
        });
    });
}

//----------------LEVELS

//LEVEL SETUP
function spawnEnemies(pos, enemyType, lvlIndx, amountIndx){

    const pos_x = RndmRange(pos[0][0], pos[1][0], true);
    const pos_y = RndmRange(pos[0][1], pos[1][1], true);

    const div = document.createElement('div');
    div.className = enemyType.className;

    const enemy = new Enemy([pos_x, pos_y], enemyType.health, enemyType.damage, div, lvlIndx, amountIndx, enemyType.behavior);

    return enemy;
}
//-------

//LEVEL EXIT

function unloadLevel(indx){
    for(let i = 0; i<allLevels[indx].enemies.length; i++){
        allLevels[indx].enemies[i].element.remove();
    }
    allLevels[indx].enemies = [];
}