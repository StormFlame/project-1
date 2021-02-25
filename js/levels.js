//CONSTANTS
const allLevels = [];

//STATE
let walls;
let gateways;

//CLASSES

class Gateway{
    constructor(pos_x, pos_y, width, height, playerPos, levelIndx){
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = width;
        this.height = height;
        this.playerPos = playerPos;
        this.levelIndx = levelIndx;
    }
}

class Wall{
    constructor(pos_x, pos_y, width, height, element){
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = width;
        this.height = height;
        this.element = element;
    }
}

class Level{
    constructor(enemiesToSpawn, spawnAreas, enemiesAmount){
        this.enemiesToSpawn = enemiesToSpawn;
        this.spawnAreas = spawnAreas;
        this.enemiesAmount = enemiesAmount;

        this.gateways = [];
        this.enemies = [];
        this.walls = [];
        this.projectiles = [];
    }
}

//OBJECTS

//walls
const LevelOneWalls = {
    pos_x: [ 200, 300],
    pos_y: [200, 500],
    width: [50, 100],
    height: [50, 250]
}


const LevelTwoWalls = {
    pos_x: [20],
    pos_y: [500],
    width: [500],
    height: [70]
}

//Gateways
const LevelOneGateways ={
    pos_x: [10],
    pos_y: [200],
    width: [30],
    height: [150],
    playerPos: [[800,500]],
    levelIndx: [1]
}

const LevelTwoGateways ={
    pos_x: [1500],
    pos_y: [300],
    width: [30],
    height: [150],
    playerPos: [[700, 200]],
    levelIndx: [0]
}

const level_One = new Level([octorok], [ [[300,300], [900,900]] ], [4]);
const level_Two = new Level([tektite], [ [ [10,10], [1652,694] ] ], [5]);


walls = [LevelOneWalls, LevelTwoWalls];
gateways = [LevelOneGateways, LevelTwoGateways];


//-----------FUNCTIONS

//INITIALIZE

function initLevels(){
    allLevels.push(level_One);
    allLevels.push(level_Two);
}

function initWalls(){
    for(let i = 0; i < allLevels.length; i++){
        wall = walls[i];

        for(let j = 0; j < wall.pos_x.length; j++){
            const div = document.createElement('div');
            const wallObj = new Wall(wall.pos_x[j], wall.pos_y[j], wall.width[j], wall.height[j], div);
            allLevels[i].walls.push(wallObj);
        }
    }
}

function initGateways(){
    for(let i = 0; i < allLevels.length; i++){
        gates = gateways[i];

        for(let j = 0; j < gates.pos_x.length; j++){
            const gate = new Gateway(gates.pos_x[j], gates.pos_y[j], gates.width[j], gates.height[j], gates.playerPos[j], gates.levelIndx[j]);
            allLevels[i].gateways.push(gate);

            const div = document.createElement('div');
            div.style.top = gates.pos_y[j] + 'px';
            div.style.left = gates.pos_x[j] + 'px';
            div.style.width = gates.width[j] + 'px';
            div.style.height = gates.height[j] + 'px';
            div.style.backgroundColor = 'red';
            div.style.position = 'absolute';

            document.querySelector('body').appendChild(div);
        }
    }
}
//------

function loadLevel(indx){
    const level = allLevels[indx];
    for(let i = 0; i<level.enemiesToSpawn.length;i++){

        for(let j = 0; j < level.enemiesAmount[i]; j++){
            enemy = spawnEnemies(level.spawnAreas[i], level.enemiesToSpawn[i], indx, i);
            enemy.behavior();
            level.enemies.push(enemy);
        }
    }

    playerRender();
    renderWalls(indx);
    renderEnemies(indx);
}

function unloadLevel(indx){
    for(let i = 0; i<allLevels[indx].enemies.length; i++){
        allLevels[indx].enemies[i].element.remove();
    }

    allLevels[indx].enemies = [];

    for(let s = 0; s < allLevels[indx].projectiles.length; s++){
        allLevels[indx].projectiles[s].element.remove();
    }

    allLevels[indx].projectiles = [];

    for(let j = 0; j < allLevels[indx].walls.length; j++){
        allLevels[indx].walls[j].element.remove();
    }

}
