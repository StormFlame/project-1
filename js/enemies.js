//CLASSES

class Enemy{
    constructor(pos, health, damage, element, levelIndx, amountIndx, enemyObj){
        this.pos = pos;
        this.health = health;
        this.damage = damage;
        this.element = element;
        this.levelIndx = levelIndx;
        this.amountIndx = amountIndx;
        this.enemyObj = enemyObj;
        this.running = false;
    }

    takeDamage(amount){
        this.health -= amount;

        if(this.health <= 0){
            this.die();
        }
    }

    die(){
        const level = allLevels[this.levelIndx];
        level.enemiesAmount[this.amountIndx] -= 1;
        level.enemies.splice(level.enemies.indexOf(this), 1);
        this.element.remove();
    }

    behavior(){
        const inter = setInterval(() =>{
            if(!this.running){
                this.enemyObj.behavior(this);
                this.running = true;
            }
        }, RndmRange(800, 3000, true));
    }
}

class projectile{
    constructor(pos, dir, levelIndx, projObj, dmgAmount){
        this.pos = pos;
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
    damage: 1,
    className: 'tektite',
    behavior: function tektiteBehavior(tektite){

        //curve function a
        const a = RndmRange(135, 300, false);
    
        const spawnAreas = allLevels[tektite.levelIndx].spawnAreas[0];
    
        const axis = RndmRange(-1,1, true);
        let dir = RndmRange(-1,1, true);
    
        let x = 0;
        let y = axis === 0 ? tektite.pos[1] : tektite.pos[0];

        const speed = 10;
        const moveAmount = 200;
        const inter = 40;
    
        let dest = getDestination();
    
        let clear = false;
    
        //move tektite along curve
        const move = setInterval(function(){

            const clear = () =>{
                clearInterval(move);
                tektite.running = false;
            }
            
            x += speed;
    
            if(axis === 0){
    
                if(dir === 0){
                    if(tektite.pos[0] < dest[0]){
                        tektite.pos[0] += speed;
        
                    }else{
                        clear();
                    }
                }else{
                    if(tektite.pos[0] > dest[0]){
                        tektite.pos[0] -= speed;
                    }else{
                        clear();
                    }
                }
    
                tektite.pos[1] = y-curve(x);
    
            }else{
    
                if(dir === 0){
                    if(tektite.pos[1] > dest[1]){
                        tektite.pos[1] -= speed;
        
                    }else{
                        clear();
                    }
                }else{
                    if(tektite.pos[1] < dest[1]){
                        tektite.pos[1] += speed;
                    }else{
                        clear();
                    }
                }
    
                tektite.pos[0] = y-curve(x);
            }
    
            renderEnemies(tektite.levelIndx);
    
        }, inter);
    
        //curve function
        function curve(x){
            return -(x*x)/a + x
        }
    
        //get move location
        function getDestination(){
            const poses = [[tektite.pos[0] + moveAmount, tektite.pos[1] - curve(moveAmount)],[tektite.pos[0] - moveAmount, tektite.pos[1] - curve(moveAmount)],[tektite.pos[0] + curve(moveAmount), tektite.pos[1] - moveAmount],[tektite.pos[0] + curve(moveAmount), tektite.pos[1] + moveAmount]];
            let output;
            if(axis === 0){

                if(dir === 0 && allLevels[tektite.levelIndx].spawnAreas[tektite.amountIndx][1][0] > poses[0][0]){
                    output = poses[0];
                }else{
                    output = poses[1]
                    dir = -1;
                }
                
                if(dir === -1 && allLevels[tektite.levelIndx].spawnAreas[tektite.amountIndx][0][0] < poses[1][0]){
                    output = poses[1];
                }else{
                    output = poses[0]
                    dir = 0;
                };

            }else{

                if(dir === 0 && allLevels[tektite.levelIndx].spawnAreas[tektite.amountIndx][0][1] < poses[2][1]){
                    output = poses[2];
                }else{
                    output = poses[3]
                    dir = -1;
                }

                if(dir === -1 && allLevels[tektite.levelIndx].spawnAreas[tektite.amountIndx][1][1] > poses[3][1]){
                    output = poses[3];
                }else{
                    output = poses[2]
                    dir = 0;
                }
            }
    
            return output;
        }
    }
}

const octorok = {
    health: 2,
    damage: 1,
    className: 'octorok',
    behavior: function octorokBehavior(octorok){
        const inter = 40;
        const speed = 4;

        let canAttack = false;

        //UP, DOWN, RIGHT, LEFT
        const dir = [0,0,0,0];
        let dirIndx = RndmRange(0, 4, true)
        dir[dirIndx] = 1;

        const move = setInterval(function(){

            walls = allLevels[octorok.levelIndx].walls;

            for(let i = 0; i < walls.length; i++){

                if(!checkBorder(dirIndx, walls[i])){
                    setDirection(dirIndx);
                }
            }

            if(!canAttack){
                checkForPlayer();
            }

            octorok.pos[1] -= speed * dir[0];
            octorok.pos[1] += speed * dir[1];
            octorok.pos[0] += speed * dir[2];
            octorok.pos[0] -= speed * dir[3];

            renderEnemies(octorok.levelIndx);

        }, inter);

        const changeDirInterval = setInterval(function(){
            setDirection(dirIndx);
            canAttack = false;
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

            const width = parseInt(getComputedStyle(octorok.element).width);
            const height = parseInt(getComputedStyle(octorok.element).height);

            if(indx === 0){
                x = octorok.pos[1] - speed;
                col = checkCollisions([octorok.pos[0], x], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(allLevels[octorok.levelIndx].spawnAreas[octorok.amountIndx][0][1] < x && col !== true){
                    return true;
                }
            }else if(indx === 1){
                x = octorok.pos[1] + speed;
                col = checkCollisions([octorok.pos[0], x], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(allLevels[octorok.levelIndx].spawnAreas[octorok.amountIndx][1][1] > x && col !== true){
                    return true;
                }
            }else if(indx === 2){
                x = octorok.pos[0] + speed;
                col = checkCollisions([x, octorok.pos[1]], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(allLevels[octorok.levelIndx].spawnAreas[octorok.amountIndx][1][0] > x && col !== true){
                    return true;
                }
            }else if(indx === 3){
                x = octorok.pos[0] - speed;
                col = checkCollisions([x, octorok.pos[1]], [width, height], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(allLevels[octorok.levelIndx].spawnAreas[octorok.amountIndx][0][0] < x && col !== true){
                    return true;
                }
            }

            return false;
        }

        function checkForPlayer(){
            if(dirIndx === 0){
                const col = checkCollisions([octorok.pos[0], octorok.pos[1] - 600], [parseInt(getComputedStyle(octorok.element).width), 600], player.pos, player.size, false);
                if(col === true){
                    canAttack = true;
                    const proj = new projectile([octorok.pos[0]+15, octorok.pos[1]-30], [1,0,0,0], octorok.levelIndx, rock, octorok.damage);
                    allLevels[octorok.levelIndx].projectiles.push(proj);
                }
            }
        }
    }
}

const rock = {
    className: 'rock',
    behavior: function rockMove(rock){
        const inter = 25;
        const speed = 5;
        const move = setInterval(function(){
            rock.pos[1] -= rock.dir[0] * speed;
            rock.pos[1] += rock.dir[1] * speed;
            rock.pos[0] += rock.dir[2] * speed;
            rock.pos[0] -= rock.dir[3] * speed;

            checkForCollission();

            renderProjectiles(rock.levelIndx);

        }, inter);

        function checkForCollission(){
            const walls = allLevels[rock.levelIndx].walls;
            let col;
            
            for(let i = 0; i < walls.length; i++){
                elem = getComputedStyle(rock.element);
                col = checkCollisions(rock.pos, [parseInt(elem.width), parseInt(elem.height)], [wall.pos_x, wall.pos_y], [wall.width, wall.height], false);
                if(col === true){
                    rock.die();
                }
            }

            col = checkCollisions(rock.pos, [parseInt(elem.width), parseInt(elem.height)], player.pos, player.size, false);

            if(col === true){
                player.takeDamage(rock.damage);
                rock.die();
            }

        }
    }
}
