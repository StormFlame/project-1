//CLASSES

class Enemy{
    constructor(pos, health, damage, element, levelIndx, amountIndx, behaviorfunct){
        this.pos = pos;
        this.health = health;
        this.damage = damage;
        this.element = element;
        this.levelIndx = levelIndx;
        this.amountIndx = amountIndx;
        this.behaviorfunct = behaviorfunct;
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
            this.behaviorfunct(this);
        }, RndmRange(1500, 4000, true));
    }
}


//OBJECTS

const tektite = {
    health: 2,
    damage: 1,
    className: 'tektite',
    behavior: tektiteBehavior
}

//FUNCTIONS

function tektiteBehavior(tektite){

    //curve function a
    a = RndmRange(160, 400, false);

    const spawnAreas = allLevels[tektite.levelIndx].spawnAreas[0];

    //move vars
    let x = 0;
    let y = tektite.pos[1];

    const dir = RndmRange(-1,2, true);

    let dest = getLocation();

    //move tektite along curve
    const move = setInterval(function(){

        x += 10;

        if(dir > 0){
            if(Math.abs(tektite.pos[0]) < Math.abs(dest)){

                //set tektite position
                tektite.pos[0] += 10;

            }else{
                clearInterval(move);
            }

        }else{
                if(tektite.pos[0] > Math.abs(dest)){

                    //set tektite position
                    tektite.pos[0] -= 10;
                }else{
                    clearInterval(move);
                }
            }

        tektite.pos[1] = y-curve(x);
        renderEnemies(tektite.levelIndx);

    }, 40);

    //curve function
    function curve(x){
        //return -(x*x)/a + a*x;
        return -(x*x)/a + x
    }

    //get move location
    function getLocation(){
        const destPlus = RndmRange(100, 200);
        let output = tektite.pos[0];

        if(dir > 0){
            output += destPlus;
        }else{
            output -= destPlus;
        }

        if(output > spawnAreas[0][0] && output < spawnAreas[1][0]){
            return output;
        }else{
            return RndmRange(spawnAreas[0][0], spawnAreas[1][0]);
        }
    }
}
