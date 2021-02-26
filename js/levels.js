//CONSTANTS
const fh = parseInt((100/window.innerWidth)*window.innerHeight);
const wth = fh/100;

const allLevels = [];

//STATE
let walls;
let gateways;

//CLASSES

class Gateway{
    constructor(pos_x, pos_y, width, height, playerPos, levelIndx, element){
        this.pos_x = pos_x;
        this.pos_y = pos_y;
        this.width = width;
        this.height = height;
        this.playerPos = playerPos;
        this.levelIndx = levelIndx;
        this.element = element;
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
    pos_x: [0, 0, 99, 0, 55, 0, 80, 10, 0, 20],
    pos_y: [0, 0, 0, fh, 0, wth*60, wth*60, wth*80, 0, 0],
    width: [100, 1, 1, 100, 45, 10, 20, 90, 20, 25],
    height: [1, fh, fh, 1, 40*wth, wth*40, wth*40, wth*20, wth*40, wth*20]
    //(0-3 corners), 4:top-right 5:botton-left 6:botton-left 7:botton-bar 8:top-left 9:top-left-middle
}

const LevelTwoWalls = {
    pos_x: [0, 0, 99, 0, 90, 90, 0, 0, 20, 40, 60, 60, 60, 70, 70],
    pos_y: [0, 0, 0, fh, 0, wth*60, 0, wth*90, wth*45, wth*45, wth*45, wth*25, wth*65, wth*35, wth*55],
    width: [100, 1, 1, 100, 10, 10, 80, 90, 5, 5, 5, 5, 5, 5, 5],
    height: [1, fh, fh, 1, wth*40, wth*40, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10]
    //borders(0-3) 4:right-middle-top 5:bottom-right 6:top-bar 7:top-bar 8:center-left 9:center-middle-left 10:center-middle-right 11:center-right-top 12:center-right-bottom 13:right-center-top 14:right-center-bottom
}

const LevelThreeWalls = {
    pos_x: [0, 0, 99, 0, 0, 90, 0, 90, 50, 50, 20, 20, 20, 35, 35, 35, 75, 75, 75],
    pos_y: [0, 0, 0, fh, 0, 0, wth*70, wth*70, 0, wth*90, wth*15, wth*45, wth*75, wth*15, wth*45, wth*75, wth*15, wth*45, wth*75],
    width: [100, 1, 1, 100, 10, 10, 10, 10, 15, 15, 5, 5, 5, 5, 5, 5, 5, 5, 5],
    height: [1, fh, fh, 1, wth*30, wth*30, wth*30, wth*30, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10, wth*10]
    //border(0-3) 4:top-left 5:top-right 6:bottom-left 7:bottom-right 8:top-middle-right 9:bottom-middle-right 10-19(obstacles)
}

const LevelFourWalls = {
    pos_x: [0, 0, 99, 0, 90, 90, 0, 50, 50, 8, 8, 8],
    pos_y: [0, 0, 0, fh, 0, wth*60, wth*90, wth*23, wth*63, wth*8, wth*43, wth*78],
    width: [100, 1, 1, 100, 10, 10, 75, 20, 20, 20, 20, 20],
    height: [1, fh, fh, 1, wth*40, wth*40, wth*10, wth*5, wth*5, wth*5, wth*5, wth*5]
    //(0-3 corners), 4:top-right 5:botton-right 6:bottom-flat-> obstacles
}

const LevelFiveWalls = {
    pos_x: [0, 0, 99, 0, 0, 60],
    pos_y: [0, 0, 0, fh, wth*40, wth*40],
    width: [100, 1, 1, 100, 40, 40],
    height: [1, fh, fh, 1, wth*60, wth*60]
    //(0-3 corners), 4:top-right 5:botton-right 6:bottom-flat-> obstacles
}

//Gateways
const LevelOneGateways ={
    pos_x: [0, 45, 20],
    pos_y: [wth*40, 0, 7],
    width: [2, 10, 5],
    height: [wth*20, wth*3.5, wth*8],
    playerPos: [[94,wth*46], [45, wth*92], [48, wth*50]],
    levelIndx: [1, 2, 4]
}

const LevelTwoGateways ={
    pos_x: [98, 80],
    pos_y: [wth*40, 0],
    width: [2, 10],
    height: [wth*20, wth*3.5],
    playerPos: [[3, wth*47], [80, wth*90]],
    levelIndx: [0, 3]
}

const LevelThreeGateways ={
    pos_x: [40,0],
    pos_y: [98*wth, wth*30],
    width: [10, 2],
    height: [4*wth, wth*40],
    playerPos: [[49, wth*5],[92, wth*50]],
    levelIndx: [0,3]
}

const LevelFourGateways ={
    pos_x: [98, 77.5],
    pos_y: [wth*40, wth*98],
    width: [2, 10],
    height: [wth*20, wth*3.5],
    playerPos: [[5,wth*50], [84, wth*5],],
    levelIndx: [2, 1]
}

const LevelFiveGateways ={
    pos_x: [40],
    pos_y: [wth*75],
    width: [20],
    height: [wth*100],
    playerPos: [[22, wth*25]],
    levelIndx: [0]
}

//-----------FUNCTIONS

//INITIALIZE

function initLevels(){
    const level_One = new Level([ ], [ [ ] ], [ ]);
    const level_Two = new Level([tektite], [ [ [10,20], [70,70] ] ], [5]);
    const level_Three = new Level([octorok], [ [[45,20], [70,70]] ], [4]);
    const level_Four = new Level([octorok], [ [[30, 5], [45,80]] ], [4]);
    const level_Five = new Level([ ], [ [ ] ], [ ]);

    walls = [LevelOneWalls, LevelTwoWalls, LevelThreeWalls, LevelFourWalls, LevelFiveWalls];
    gateways = [LevelOneGateways, LevelTwoGateways, LevelThreeGateways, LevelFourGateways, LevelFiveGateways];

    allLevels.push(level_One);
    allLevels.push(level_Two);
    allLevels.push(level_Three);
    allLevels.push(level_Four);
    allLevels.push(level_Five);

    for(let i = 1; i < allLevels.length-1; i++){
        for(let j = 0; j < allLevels[i].spawnAreas.length; j++){
            for(let s = 0; s < 2; s++){
                for(let q = 0; q < 2; q++){
                    if(q === 0){
                        allLevels[i].spawnAreas[j][s][q] *= prcnt;
                    }else if(q === 1){
                        allLevels[i].spawnAreas[j][s][q] *= wth*prcnt;
                    }
                }
            }
        }
    }
}

function initWalls(){
    for(let i = 0; i < allLevels.length; i++){
        wall = walls[i];

        for(let j = 0; j < wall.pos_x.length; j++){
            wall.pos_x[j] *= prcnt;
            wall.pos_y[j] *= prcnt;
            wall.width[j] *= prcnt;
            wall.height[j] *= prcnt;
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
            gates.pos_x[j] *= prcnt;
            gates.pos_y[j] *= prcnt;
            gates.width[j] *= prcnt;
            gates.height[j] *= prcnt;

            const div = document.createElement('div');

            const gate = new Gateway(gates.pos_x[j], gates.pos_y[j], gates.width[j], gates.height[j], gates.playerPos[j], gates.levelIndx[j], div);
            allLevels[i].gateways.push(gate);
        }
    }
}
//------

function loadLevel(indx){
    const level = allLevels[indx];
    for(let i = 0; i<level.enemiesToSpawn.length;i++){

        for(let j = 0; j < level.enemiesAmount[i]; j++){
            enemy = spawnEnemies(level.spawnAreas[i], level.enemiesToSpawn[i].size, level.enemiesToSpawn[i], indx, i);

            enemy.behavior();
            level.enemies.push(enemy);
        }
    }

    playerRender();
    renderWalls(indx, 'wall');
    renderGateways(indx);
    renderEnemies(indx);
    renderHealth();
    renderAttackStats();

    if(indx === 4 && hasSword === false){
        renderWalls(indx, 'wall-sword-event');
        const callSword = setTimeout(function(){
            canMove = false;
            canAttack = false;
            getSword();
        }, 1000);
    }

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

    for(let q = 0; q < allLevels[indx].gateways.length; q++){
        allLevels[indx].gateways[q].element.remove();
    }

}
