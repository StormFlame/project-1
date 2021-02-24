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
