//CONSTANTS
const allLevels = [];

//CLASSES

class Level{
    constructor(enemiesToSpawn, spawnAreas, enemiesAmount){
        this.enemiesToSpawn = enemiesToSpawn;
        this.spawnAreas = spawnAreas;
        this.enemiesAmount = enemiesAmount;
        this.enemies = [];
    }
}

//OBJECTS

const level_One = new Level([Froggy], [ [ [100,100], [500,500] ] ], [5]);


//-----------FUNCTIONS


//INITIALIZE

    function initLevels(){
        
        allLevels.push(level_One);
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
