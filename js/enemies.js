//CLASSES

class Enemy{
    constructor(pos, health, damage, element, levelIndx){
        this.position = pos;
        this.health = health;
        this.damage = damage;
        this.element = element;
        this.levelIndx = levelIndx;
    }

    takeDamage(amount){
        this.health -= amount;

        if(this.health <= 0){
            this.die();
        }
    }

    die(){
        const level = allLevels[this.levelIndx];
        level.enemiesAmount -= 1;
        level.enemies.splice(level.enemies.indexOf(this), 1);
        this.element.remove();
    }
}


//OBJECTS

const Froggy = {
    health: 2,
    damage: 1,
    className: 'froggy'
}