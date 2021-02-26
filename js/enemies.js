//CLASSES

class Enemy{
    constructor(pos, size, health, damage, element, levelIndx, amountIndx, enemyObj){
        this.pos = pos;
        this.size = size;
        this.health = health;
        this.damage = damage;
        this.element = element;
        this.levelIndx = levelIndx;
        this.amountIndx = amountIndx;
        this.enemyObj = enemyObj;
        this.running = false;
        this.alive = true;
    }

    takeDamage(amount){
        this.health -= amount;
        damageVisual(this);

        if(this.health <= 0){
            this.die();
        }
    }

    die(){
        const level = allLevels[this.levelIndx];
        level.enemiesAmount[this.amountIndx] -= 1;
        level.enemies.splice(level.enemies.indexOf(this), 1);
        this.element.remove();
        enemiesKilled++;
        this.alive = false;
        renderAttackStats();
    }

    behavior(){
        const inter = setInterval(() =>{
            if(!this.running && this.levelIndx === currentLevel && this.alive === true){
                this.enemyObj.behavior(this);
                this.running = true;
            }
        }, RndmRange(800, 3000, true));
    }
}

class projectile{
    constructor(pos, size, dir, levelIndx, projObj, dmgAmount){
        this.pos = pos;
        this.size = size;
        this.dir = dir;
        this.levelIndx = levelIndx;
        this.projObj = projObj;
        this.damage = dmgAmount;

        this.element = spawnProjectile(this);

        this.move();
    }

    move(){
        this.projObj.behavior(this);
    };

    die(){
        const projs = allLevels[this.levelIndx].projectiles; 
        projs.splice(projs.indexOf(this), 1);
        this.element.remove();
    }
}


//OBJECTS

const tektite = {
    health: 2,
    size: [3,3],
    damage: 1,
    range: 5,
    className: 'tektite',
    behavior: function tektiteBehavior(tektiteInst){

        //curve function a
        const a = RndmRange(135, 300, false);
    
        const spawnAreas = allLevels[tektiteInst.levelIndx].spawnAreas[0];
    
        const axis = RndmRange(-1,1, true);
        let dir = RndmRange(-1,1, true);
    
        let x = 0;
        let y = axis === 0 ? tektiteInst.pos[1] : tektiteInst.pos[0];

        const speed = 10;
        const moveAmount = window.innerHeight/10;
        const inter = 40;
    
        let dest = getDestination();
    
        let clear = false;
    
        //move tektite along curve
        const move = setInterval(function(){

            const clear = () =>{
                attack();
                clearInterval(move);
                tektiteInst.running = false;
            }
            
            x += speed;
    
            if(axis === 0){
    
                if(dir === 0){
                    if(tektiteInst.pos[0] < dest[0]){
                        tektiteInst.pos[0] += speed;
        
                    }else{
                        clear();
                    }
                }else{
                    if(tektiteInst.pos[0] > dest[0]){
                        tektiteInst.pos[0] -= speed;
                    }else{
                        clear();
                    }
                }
    
                tektiteInst.pos[1] = y-curve(x);
    
            }else{
    
                if(dir === 0){
                    if(tektiteInst.pos[1] > dest[1]){
                        tektiteInst.pos[1] -= speed;
        
                    }else{
                        clear();
                    }
                }else{
                    if(tektiteInst.pos[1] < dest[1]){
                        tektiteInst.pos[1] += speed;
                    }else{
                        clear();
                    }
                }
    
                tektiteInst.pos[0] = y-curve(x);
            }
    
            renderEnemies(tektiteInst.levelIndx);
    
        }, inter);
        //curve function
        function curve(x){
            return -(x*x)/a + x
        }
    
        //get move location
        function getDestination(){
            const poses = [[tektiteInst.pos[0] + moveAmount, tektiteInst.pos[1] - curve(moveAmount)],[tektiteInst.pos[0] - moveAmount, tektiteInst.pos[1] - curve(moveAmount)],[tektiteInst.pos[0] + curve(moveAmount), tektiteInst.pos[1] - moveAmount],[tektiteInst.pos[0] + curve(moveAmount), tektiteInst.pos[1] + moveAmount]];
            let output;
            if(axis === 0){

                if(dir === 0 && allLevels[tektiteInst.levelIndx].spawnAreas[tektiteInst.amountIndx][1][0] > poses[0][0]){
                    output = poses[0];
                }else{
                    output = poses[1]
                    dir = -1;
                }
                
                if(dir === -1 && allLevels[tektiteInst.levelIndx].spawnAreas[tektiteInst.amountIndx][0][0] < poses[1][0]){
                    output = poses[1];
                }else{
                    output = poses[0]
                    dir = 0;
                };

            }else{

                if(dir === 0 && allLevels[tektiteInst.levelIndx].spawnAreas[tektiteInst.amountIndx][0][1] < poses[2][1]){
                    output = poses[2];
                }else{
                    output = poses[3]
                    dir = -1;
                }

                if(dir === -1 && allLevels[tektiteInst.levelIndx].spawnAreas[tektiteInst.amountIndx][1][1] > poses[3][1]){
                    output = poses[3];
                }else{
                    output = poses[2]
                    dir = 0;
                }
            }
    
            return output;
        }

        function attack(){
            const playerDist = distance(tektiteInst.pos[0], tektiteInst.pos[1], player.pos[0], player.pos[1]);
            if(Math.abs(playerDist[0]) < tektite.range*prcnt && Math.abs(playerDist[1]) < tektite.range*prcnt*wth){
                player.takeDamage(tektite.damage);
            }
        }
    }
}

const octorok = {
    health: 2,
    size: [2.5, 2.5],
    damage: 1,
    className: 'octorok',
    behavior: function octorokBehavior(octorokInst){
        const inter = 50;
        const speed = 1;
        const speedMltplier = (prcnt/speed)/4;

        let canAttack = true;

        //UP, DOWN, RIGHT, LEFT
        let dir = [0,0,0,0];
        let dirIndx = RndmRange(0, 4, true)
        dir[dirIndx] = 1;

        const move = setInterval(function(){
            walls = allLevels[octorokInst.levelIndx].walls;

            for(let i = 0; i < walls.length; i++){

                if(!checkBorder(dirIndx, walls[i])){
                    if(dirIndx === 0){
                        dirIndx = 1;
                        dir = [0,1,0,0];
                    }else if(dirIndx === 1){
                        dirIndx = 0;
                        dir = [1,0,0,0];
                    }
                    else if(dirIndx === 2){
                        dirIndx = 3;
                        dir = [0,0,0,1];
                    }
                    else if(dirIndx === 3){
                        dirIndx = 2;
                        dir = [0,0,1,0];
                    }
                }
            }

            if(canAttack === true){
                checkForPlayer();
            }

            octorokInst.pos[1] -= speed*speedMltplier * dir[0];
            octorokInst.pos[1] += speed*speedMltplier * dir[1];
            octorokInst.pos[0] += speed*speedMltplier * dir[2];
            octorokInst.pos[0] -= speed*speedMltplier * dir[3];

            renderEnemies(octorokInst.levelIndx);

        }, inter);

        const changeDirInterval = setInterval(function(){
            setDirection(dirIndx);
        },RndmRange(1000, 5000));

        function setDirection(indx){
            dir[dirIndx] = 0;

            do{
                dirIndx = RndmRange(0, 4, true);
            }while(dirIndx === indx);

            dir[dirIndx] = 1;
        }

        function checkBorder(indx, wall){
            let x;
            let col;

            const width = parseInt(getComputedStyle(octorokInst.element).width);
            const height = parseInt(getComputedStyle(octorokInst.element).height);

            if(indx === 0){
                x = octorokInst.pos[1] - speed;
                col = checkCollisions([octorokInst.pos[0], x], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(col !== true){
                    return true;
                }
            }else if(indx === 1){
                x = octorokInst.pos[1] + speed;
                col = checkCollisions([octorokInst.pos[0], x], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(col !== true){
                    return true;
                }
            }else if(indx === 2){
                x = octorokInst.pos[0] + speed;
                col = checkCollisions([x, octorokInst.pos[1]], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(col !== true){
                    return true;
                }
            }else if(indx === 3){
                x = octorokInst.pos[0] - speed;
                col = checkCollisions([x, octorokInst.pos[1]], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(col !== true){
                    return true;
                }
            }

            return false;
        }

        function checkForPlayer(){
            const range = 30*prcnt;

            if(dirIndx === 0){
                const col = checkCollisions([octorokInst.pos[0], octorokInst.pos[1] - range], [parseInt(getComputedStyle(octorokInst.element).width), range], player.pos, player.size, false);
                if(col === true){
                    canAttack = false;
                    const proj = new projectile([octorokInst.pos[0]+prcnt*.4, octorokInst.pos[1]-(prcnt*octorok.size[0]/2)], rock.size, [1,0,0,0], octorokInst.levelIndx, rock, octorokInst.damage);
                    allLevels[octorokInst.levelIndx].projectiles.push(proj);
                    setCanAttack();
                }
            }else if(dirIndx === 1){
                const col = checkCollisions([octorokInst.pos[0], octorokInst.pos[1]], [parseInt(getComputedStyle(octorokInst.element).width), range], player.pos, player.size, false);
                if(col === true){
                    canAttack = false;
                    const proj = new projectile([octorokInst.pos[0]+prcnt*.4, octorokInst.pos[1]+(prcnt*octorok.size[0])], rock.size, [0,1,0,0], octorokInst.levelIndx, rock, octorokInst.damage);
                    allLevels[octorokInst.levelIndx].projectiles.push(proj);
                    setCanAttack();
                }
            }else if(dirIndx === 2){
                const col = checkCollisions([octorokInst.pos[0], octorokInst.pos[1]], [range, parseInt(getComputedStyle(octorokInst.element).height)], player.pos, player.size, false);
                if(col === true){
                    canAttack = false;
                    const proj = new projectile([octorokInst.pos[0] + (prcnt*octorok.size[0]), octorokInst.pos[1]+prcnt*.4], rock.size, [0,0,1,0], octorokInst.levelIndx, rock, octorokInst.damage);
                    allLevels[octorokInst.levelIndx].projectiles.push(proj);
                    setCanAttack();
                }
            }else if(dirIndx === 3){
                const col = checkCollisions([octorokInst.pos[0] - range, octorokInst.pos[1]], [range, parseInt(getComputedStyle(octorokInst.element).height)], player.pos, player.size, false);
                if(col === true){
                    canAttack = false;
                    const proj = new projectile([octorokInst.pos[0] - (prcnt*octorok.size[0]/2), octorokInst.pos[1]+prcnt*.4], rock.size, [0,0,0,1], octorokInst.levelIndx, rock, octorokInst.damage);
                    allLevels[octorokInst.levelIndx].projectiles.push(proj);
                    setCanAttack();
                }
            }
        }

        function setCanAttack (){
            setTimeout(function(){
                canAttack = true;
            },3000);
        }
    }
}

const rock = {
    className: 'rock',
    size:[1.8,1.8],
    behavior: function rockMove(rock){
        const inter = 50;
        const speed = 5;
        const speedMltplier = (prcnt/speed)/2;
        const move = setInterval(function(){
            rock.pos[1] -= rock.dir[0]*speedMltplier * speed;
            rock.pos[1] += rock.dir[1]*speedMltplier * speed;
            rock.pos[0] += rock.dir[2]*speedMltplier * speed;
            rock.pos[0] -= rock.dir[3]*speedMltplier * speed;

            renderProjectiles(rock.levelIndx);
            checkForCollission();

        }, inter);

        function checkForCollission(){
            let col;
            
            allLevels[rock.levelIndx].walls.forEach(function(wall){
                elem = getComputedStyle(rock.element);
                col = checkCollisions(rock.pos, [parseInt(elem.width), parseInt(elem.height)], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(col === true){
                    rock.die();
                }
            });

            col = checkCollisions(rock.pos, [parseInt(elem.width), parseInt(elem.height)], player.pos, player.size, false);

            if(col === true){
                player.takeDamage(rock.damage);
                rock.die();
            }

        }
    }
}
