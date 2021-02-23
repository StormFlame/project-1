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
        }, RndmRange(1500, 4000, true));
    }
}


//OBJECTS

const tektite = {
    health: 2,
    damage: 1,
    className: 'tektite',
    behavior: function tektiteBehavior(tektite){
        console.log(tektite);
        //curve function a
        const a = RndmRange(135, 300, false);
    
        const spawnAreas = allLevels[tektite.levelIndx].spawnAreas[0];
    
        const axis = RndmRange(-1,2, true);
        const dir = RndmRange(-1,2, true);
    
        let x = 0;
        let y = axis > 0 ? tektite.pos[1] : tektite.pos[0];
    
        let dest = getDestination();
    
        let clear = false;
    
        //move tektite along curve
        const move = setInterval(function(){

            const clear = () =>{
                clearInterval(move);
                tektite.running = false;
            }
            
            x += 5;
    
            if(axis > 0){
    
                if(dir > 0){
                    if(tektite.pos[0] < dest[0]){
                        tektite.pos[0] += 5;
        
                    }else{
                        clear();
                    }
                }else{
                    if(tektite.pos[0] > dest[0]){
                        tektite.pos[0] -= 5;
                    }else{
                        clear();
                    }
                }
    
                tektite.pos[1] = y-curve(x);
    
            }else{
    
                if(dir > 0){
                    if(tektite.pos[1] > dest[1]){
                        tektite.pos[1] -= 5;
        
                    }else{
                        clear();
                    }
                }else{
                    if(tektite.pos[1] < dest[1]){
                        tektite.pos[1] += 5;
                    }else{
                        clear();
                    }
                }
    
                tektite.pos[0] = y-curve(x);
            }
    
            renderEnemies(tektite.levelIndx);
    
        }, 50);
    
        //curve function
        function curve(x){
            return -(x*x)/a + x
        }
    
        //get move location
        function getDestination(){
            let output;
            if(axis > 0){
                if(dir > 0){
                    output = [tektite.pos[0] + 200, tektite.pos[1] - curve(200)]
                }else{
                    output = [tektite.pos[0] - 200, tektite.pos[1] - curve(200)]
                }
            }else{
                if(dir > 0){
                    output = [tektite.pos[0] + curve(200), tektite.pos[1] - 200]
                }else{
                    output = [tektite.pos[0] + curve(200), tektite.pos[1] + 200]
                }
            }
    
            return output;
        }
    }
}
