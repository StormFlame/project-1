//CONSTANTS
const allLevels = [];

//STATE
let walls;

//CLASSES

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
        this.enemies = [];
        this.walls = [];
    }
}

//OBJECTS

const LevelOneWalls = {
    pos_x: [0, 200],
    pos_y: [0, 200],
    width: [500, 50],
    height: [70, 50]
}

const LevelTwoWalls = {
    pos_x: [20],
    pos_y: [500],
    width: [500],
    height: [70]
}

const level_One = new Level([Froggy], [ [ [100,100], [500,500] ] ], [5]);
walls = [LevelOneWalls, LevelTwoWalls];


//-----------FUNCTIONS


//INITIALIZE

function initLevels(){
    allLevels.push(level_One);

    //initialize walls
    initWalls(currentLevel);
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

//------

function loadLevel(indx){

    const level = allLevels[indx];
    for(let i = 0; i<level.enemiesToSpawn.length;i++){

        for(let j = 0; j < level.enemiesAmount[i]; j++){
            enemy = spawnEnemies(level.spawnAreas[i], level.enemiesToSpawn[i], indx);
            level.enemies.push(enemy);
        }
    }
    renderEnemies(indx);
}
