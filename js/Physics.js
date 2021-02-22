//PHYSICS ENGINE FOUNDATION

//-----------------------------------------------------------------

//VARIABLES
let player_X;
let player_Y;
//MOVE_UP, MOVE_DOWN, MOVE_RIGHT, MOVE_LEFT
let moveDirToggle;


let levelWalls;
//-----------------------------------------------------------------

//check for collision
function checkCollisions(){
    levelWalls = allLevels[currentLevel].walls;
    let dir = [1,1,1,1];
    for(let i = 0; i < levelWalls.length; i++){
        //get player and wall radius(width/2);
        const playerRadius = parseInt(getComputedStyle(PLAYER).width)/2;
        const wallRadius_x = levelWalls[i].width/2;
        const wallRadius_y = levelWalls[i].height/2;

        const dist = distance(player_X+playerRadius, player_Y+playerRadius, levelWalls[i].pos_x+wallRadius_x, levelWalls[i].pos_y+wallRadius_y);
        
        //set threshholds for collision(player radius + wall radius)
        const distThreshold_x = playerRadius + wallRadius_x;
        const distThreshold_y = playerRadius + wallRadius_y;

        //check quadrant of collision and stop movement accordingly
        if(Math.abs(dist[0]) <= distThreshold_x && Math.abs(dist[1]) <= distThreshold_y){

            //check top
            if(dist[1] >= distThreshold_y-1 && dist[1] <= distThreshold_y){
                dir[1] = 0;

            //check bottom
            }else if(dist[1] <= -distThreshold_y+1 && dist[1] >= -distThreshold_y){
                dir[0] = 0;
            }

            //check right
            if(dist[0] <= -distThreshold_x+1 && dist[0] >= -distThreshold_x){
                 dir[3] = 0;

            //check left
            }else if(dist[0] >= distThreshold_x-1 && dist[0] <= distThreshold_x){
                dir[2] = 0;
            }
        }
    }
    moveDirToggle = dir;
}

// check keypress key and move player accordingly
function move(key){
    switch(key){
        case 's':
            player_Y += MOVE_SPEED * moveDirToggle[1];
        break;
        case 'w':
            player_Y -= MOVE_SPEED * moveDirToggle[0];
        break;
        case 'd':
            player_X += MOVE_SPEED * moveDirToggle[2];
        break;
        case 'a':
            player_X -= MOVE_SPEED * moveDirToggle[3];
        break;
    }
    playerRender();
}

//-----------------------------------------------------------------

//HELPER

//calculate distance helper function
function distance(x_one, y_one, x_two, y_two){
    x = x_two - x_one;
    y = y_two - y_one;
    return [x,y];
}