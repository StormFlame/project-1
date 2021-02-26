const body = document.querySelector('body');
const gameOverBtn = document.getElementById('game-over');
const swordEventEl = document.getElementById('get-sword');
const swordDisplay = document.getElementById('sword-display');
const hearts = document.getElementById('stats-bottom').querySelectorAll('.heart');
const killStats = document.getElementById('stats-right').querySelectorAll('.kill-stats');

//-----------------------------------------------------------------

//STATE
let currentLevel = 0;
let vh;
let prcnt;

let totalEnemies;
let enemiesKilled;

let hasSword;
let canAttack;
let canMove;

let alive;

//-----------------------------------------------------------------


//Objects
const player = {
    health: 3,
    damage: 1,
    speed: 50,
    pos: [0,0],
    size: [3, 3],
    moveDirToggle: [1,1,1,1],
    element: document.getElementById('player'),
    dir: [1,0,0,0],
    takeDamage: function(amount){
        this.health -= amount;
        damageVisual(player);
        renderHealth();
        if(this.health <= 0){
            alive = false;
            renderLose();
        }
    },
    attack: function(){
        canAttack = false;
        const setCanAttack = setTimeout(function(){
            canAttack = true;
        },300);

        const width = 1*prcnt;
        const height = 6*wth*prcnt;
        const sizes = [[width,height],[width,height],[height,width],[height,width]];
        const poses_x_one = [0,-1,0,-1];
        const poses_x_two = [1,1,1,0];

        const devisionInts_x = [2,2,1,1];

        const poses_y_one = [-1,0,0,0];
        const poses_y_two = [0,1,1,1];

        const devisionInts_y = [1,1,2,2];

        for(let i = 0; i < 4; i++){
            if(player.dir[i] === 1){
                sword.size = sizes[i];
                
                sword.pos[0] = player.pos[0] + poses_x_one[i]*sword.size[0] + poses_x_two[i]*player.size[0]/devisionInts_x[i];

                sword.pos[1] = player.pos[1] + poses_y_one[i]*sword.size[1] + poses_y_two[i]*player.size[1]/devisionInts_y[i];
            }
        }

        allLevels[currentLevel].enemies.forEach(function(enemy){
            col = checkCollisions(sword.pos, sword.size, enemy.pos, [parseInt(getComputedStyle(enemy.element).width), parseInt(getComputedStyle(enemy.element).height)], false);
                    
                    if(col === true){
                     enemy.takeDamage(player.damage);
                    }
        });

        renderSword();
    }
}

const sword = {
    pos: [0,0],
    size: [0, 0],
    element: document.getElementById('sword')
}

//-----------------------------------------------------------------

//EVENT LISTENERS

//reset the game on click
gameOverBtn.addEventListener('click', function(){
    gameOverBtn.style.visibility = 'hidden';
    resetGame();
});

//call move with keypress key
document.addEventListener('keypress', function(e){
    if(alive === true && canMove === true){
        playerMove(e.key)
    }
});

//call player attack on click
document.addEventListener('click', function(e){
    if(alive === true && hasSword === true && canAttack === true){
        player.attack();
    }
});

//-----------------------------------------------------------------

//CALL START FUNCTIONS
firstInitialize();

//------------------- FUNCTIONS

//INITIALIZATION

function firstInitialize(){

    vh = window.innerHeight/100;
    prcnt = window.innerWidth/120;

    player.size[0] *= prcnt;
    player.size[1] *= prcnt;

    initState();
    //initialize levels
    initLevels();
    initWalls();
    initGateways();

    loadLevel(currentLevel);

    update();
}

function initState(){
    player.pos = [50*prcnt, wth*50*prcnt];
    player.health = 3;

    hasSword = false;
    canAttack = true;
    canMove = true;
    alive = true;
    totalEnemies = 13;
    enemiesKilled = 0;
    currentLevel = 0;
}

//UPDATE
function update(){
    let loadingLevel = false;

    const checkGateways = setInterval (function(){
        gates = allLevels[currentLevel].gateways;

        for(let i = 0; i < gates.length; i++){
            const col = checkCollisions([gates[i].pos_x, gates[i].pos_y], [gates[i].width, gates[i].height], player.pos, player.size, false);
            if(col === true && loadingLevel === false){
                loadingLevel = true;
                unloadLevel(currentLevel);

                player.pos = [gates[i].playerPos[0]*prcnt, gates[i].playerPos[1]*prcnt];

                currentLevel = gates[i].levelIndx;
                loadLevel(currentLevel);
            }
        }
        loadingLevel = false;
    }, 500);

    const checkwin = setInterval(function(){
        if(enemiesKilled === totalEnemies && alive === true){
            renderWin();
        }
    },1000);
}

//RENDER

//render the player
function playerRender(){
    player.element.style.top = player.pos[1]+'px';
    player.element.style.left = player.pos[0]+'px';
    player.element.style.width = player.size[0] + 'px';
    player.element.style.height = player.size[1] + 'px';
}

//--------------------stats

//render health
function renderHealth(){

    hearts.forEach(function(heart){
        heart.style.backgroundColor = 'white';
    });

    for(let i = 0; i < player.health; i++){
        hearts[i].style.backgroundColor = 'red';
    }
}

//render attack stats
function renderAttackStats(){
    killStats[0].innerHTML = 'Total Enemies: ' + totalEnemies;
    killStats[1].innerHTML = 'Enemies killed: ' + enemiesKilled;
    killStats[2].innerHTML = 'Remaining: ' + (totalEnemies-enemiesKilled);
}

//---------

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

//hide the sword
function unrenderSword(){
    sword.element.style.visibility = 'hidden';
}

//render current level walls
function renderWalls(indx, className){
    allLevels[indx].walls.forEach(function(wall){
        wall.element.className = 'wall';
        wall.element.style.top = wall.pos_y + 'px';
        wall.element.style.left = wall.pos_x + 'px';
        wall.element.style.width = wall.width + 'px';
        wall.element.style.height = wall.height + 'px';

        wall.element.className = className;
        document.getElementById('walls').appendChild(wall.element);
    });
}

//render gateways
function renderGateways(indx){
    allLevels[indx].gateways.forEach(function(gates){
            const div = gates.element;
            div.style.top = gates.pos_y + 'px';
            div.style.left = gates.pos_x + 'px';
            div.style.width = gates.width + 'px';
            div.style.height = gates.height + 'px';
            div.style.backgroundColor = 'black';
            div.style.position = 'absolute';
            div.style.zIndex = 3;

            document.getElementById('gateways').appendChild(div);
    });
}

//render the current level enemies
function renderEnemies(indx){

    allLevels[indx].enemies.forEach(function(enemy){
            enemy.element.style.top = enemy.pos[1] + 'px';
            enemy.element.style.left = enemy.pos[0] + 'px';
            enemy.element.style.width = enemy.size[0] + 'px';
            enemy.element.style.height = enemy.size[1] + 'px';

            document.getElementById('enemies').appendChild(enemy.element);

    });
}

//PROJECTILES
function spawnProjectile(obj){
    const div = document.createElement('div');
    div.className = obj.projObj.className;
    obj.size = [rock.size[0]*prcnt, rock.size[1]*prcnt];

    return div;   
}

function renderProjectiles (indx){
    allLevels[indx].projectiles.forEach(function(projectile){
        projectile.element.style.top = projectile.pos[1] + 'px';
        projectile.element.style.left = projectile.pos[0] + 'px';
        projectile.element.style.width = projectile.size[0] + 'px';
        projectile.element.style.height = projectile.size[1] + 'px';

        body.appendChild(projectile.element);
    });
}

//WIN/LOSE

function renderWin(){
    gameOverBtn.querySelector('h1').innerText = 'You Win!';
    gameOverBtn.style.visibility = 'visible';
}

function renderLose(){
    gameOverBtn.querySelector('h1').innerText = 'Game Over';
    gameOverBtn.style.visibility = 'visible';
}

function renderSwordEvent(strng, end){
    const h1 = swordEventEl.querySelector('h1');
    if(end === false){
        swordEventEl.style.visibility = 'visible';
        h1.innerHTML += strng;
    }else{
        const endEvent = setTimeout(function(){
            swordEventEl.style.visibility = 'hidden';
            h1.innerHTML = '';
            hasSword = true;
            canAttack = true;
            canMove = true;
            swordDisplay.style.visibility = 'visible';
        },1000);
    }
}

//----------------LEVELS

//LEVEL SETUP
function spawnEnemies(pos, size, enemyType, lvlIndx, amountIndx){

    const pos_x = RndmRange(pos[0][0], pos[1][0], true);
    const pos_y = RndmRange(pos[0][1], pos[1][1], true);

    const div = document.createElement('div');
    div.className = enemyType.className;

    const enemy = new Enemy([pos_x, pos_y], [size[0]*prcnt, size[1]*prcnt], enemyType.health, enemyType.damage, div, lvlIndx, amountIndx, enemyType);

    return enemy;
}
//-------

//reset

function resetGame(){
    swordDisplay.style.visibility = 'hidden';
    unloadLevel(currentLevel);
    initState();
    loadLevel(currentLevel);
}

//GAME EVENTS
function getSword(){
    const say = "Its dangerous to go alone!. . . take this!"
    const chars = say.split('');

    let i = 0;
    const announce = setInterval(function(){
        if(i >= chars.length){
            renderSwordEvent('', true);
            clearInterval(announce);
        }else{
            renderSwordEvent(chars[i], false)
            i++;
        }
    },150);

}

//VISUALS
function damageVisual(obj){
    const col = obj.element.style.backgroundColor;
    obj.element.style.backgroundColor = 'black';
    const setBGColor = setTimeout(function(){
        obj.element.style.backgroundColor = col;
    }, 300);
}
