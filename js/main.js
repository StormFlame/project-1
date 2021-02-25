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
    size: [80, 80],
    moveDirToggle: [1,1,1,1],
    element: document.getElementById('player'),
    dir: [1,0,0,0],
    takeDamage: function(amount){
        this.health -= amount;
        if(this.health <= 0){
            console.log('die');
        }
    },
    attack: function(){
        const sizes = [[30,60],[30,60],[60,30],[60,30]];
        const poses_x_one = [0,-1,0,-1]; //[1,-2,0,-1];
        const poses_x_two = [1,1,1,0];

        const devisionInts_x = [2,2,1,1];

        const poses_y_one = [-1,0,0,0];//[-1,0,1,-2];
        const poses_y_two = [0,1,1,1];

        const devisionInts_y = [1,1,2,2];

        allLevels[currentLevel].enemies.forEach(function(enemy){
            for(let i = 0; i < 4; i++){
                if(player.dir[i] === 1){
                    sword.size = sizes[i];
                    sword.pos[0] = player.pos[0] + poses_x_one[i]*sword.size[0] + poses_x_two[i]*player.size[0]/devisionInts_x[i];

                    sword.pos[1] = player.pos[1] + poses_y_one[i]*sword.size[1] + poses_y_two[i]*player.size[1]/devisionInts_y[i];

                    col = checkCollisions(sword.pos, sword.size, enemy.pos, [parseInt(getComputedStyle(enemy.element).width), parseInt(getComputedStyle(enemy.element).height)], false);
                    
                    if(col === true){
                     enemy.takeDamage(player.damage);
                    }

                    renderSword();
                }
            }
        });
    }
}

const sword = {
    pos: [0,0],
    size: [10, 30],
    element: document.getElementById('sword')
}

//-----------------------------------------------------------------

//EVENT LISTENERS

//call move with keypress key
document.addEventListener('keypress', function(e){playerMove(e.key)});
document.addEventListener('click', function(e){
    player.attack();
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
    initWalls();
    initGateways();

    loadLevel(currentLevel);

    update();
}

//UPDATE
function update(){

    const checkGateways = setInterval (() => {
        gates = allLevels[currentLevel].gateways;

        for(let i = 0; i < gates.length; i++){
            const col = checkCollisions([gates[i].pos_x, gates[i].pos_y], [gates[i].width, gates[i].height], player.pos, player.size, false);
            if(col === true){
                unloadLevel(currentLevel);

                player.pos = gates[i].playerPos;

                currentLevel = gates[i].levelIndx;
                loadLevel(currentLevel);
            }
        }
    }, 1000);
}

//RENDER

//render the player
function playerRender(){
    player.element.style.top = player.pos[1]+'px';
    player.element.style.left = player.pos[0]+'px';
}

//render player sword
function renderSword(){
    sword.element.style.top = sword.pos[1] + 'px';
    sword.element.style.left = sword.pos[0] + 'px';
    sword.element.style.width = sword.size[0] + 'px';
    sword.element.style.height = sword.size[1] + 'px';
    sword.element.style.visibility = 'visible';

    setTimeout(() => {
        unrenderSword();
    }, 100);
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

//hide the sword
function unrenderSword(){
    sword.element.style.visibility = 'hidden';
}


//render the current level enemies
function renderEnemies(indx){

    allLevels[indx].enemies.forEach(function(enemy){
            enemy.element.style.top = enemy.pos[1] + 'px';
            enemy.element.style.left = enemy.pos[0] + 'px';

            body.appendChild(enemy.element);

        //     enemy.element.addEventListener('click', function(e){
        //     enemy.takeDamage(1);
        // });
    });
}

function spawnProjectile(obj){
    const div = document.createElement('div');
    div.className = obj.projObj.className;

    return div;   
}

function renderProjectiles (indx){
    allLevels[indx].projectiles.forEach(function(projectile){
        projectile.element.style.top = projectile.pos[1] + 'px';
        projectile.element.style.left = projectile.pos[0] + 'px';

        body.appendChild(projectile.element);
    });
}

//----------------LEVELS

//LEVEL SETUP
function spawnEnemies(pos, enemyType, lvlIndx, amountIndx){

    const pos_x = RndmRange(pos[0][0], pos[1][0], true);
    const pos_y = RndmRange(pos[0][1], pos[1][1], true);

    const div = document.createElement('div');
    div.className = enemyType.className;

    const enemy = new Enemy([pos_x, pos_y], enemyType.health, enemyType.damage, div, lvlIndx, amountIndx, enemyType);

    return enemy;
}
//-------

