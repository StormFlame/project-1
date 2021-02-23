//PHYSICS ENGINE

//-----------------------------------------------------------------

//check for collision
function checkCollisions(posOne, sizeOne, PosTwo, sizeTwo, returnSides){
    const objOneRadius_x = sizeOne[0]/2;
    const objOneRadius_y = sizeOne[1]/2;
    
    const objTwoRadius_x = sizeTwo[0]/2;
    const objTwoRadius_y = sizeTwo[1]/2;

    const dist = distance(posOne[0]+objOneRadius_x, posOne[1]+objOneRadius_y, PosTwo[0]+objTwoRadius_x, PosTwo[1]+objTwoRadius_y);

    const distThreshold_x = objOneRadius_x + objTwoRadius_x;
    const distThreshold_y = objOneRadius_y + objTwoRadius_y;

    let dir = [1,1,1,1];

    if(Math.abs(dist[0]) <= distThreshold_x && Math.abs(dist[1]) <= distThreshold_y){
        if(returnSides){
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
        }else{
            return true;
        }
    }

    return dir;
}

// check keypress key and move player accordingly
function playerMove(key){

    player.moveDirToggle = [1,1,1,1];

    const levelWalls = allLevels[currentLevel].walls;

    for(let i = 0; i < levelWalls.length; i++){

        const dir = checkCollisions(player.pos, player.size, [levelWalls[i].pos_x, levelWalls[i].pos_y], [levelWalls[i].width, levelWalls[i].height], true);

        player.moveDirToggle[0] *= dir[0];
        player.moveDirToggle[1] *= dir[1];
        player.moveDirToggle[2] *= dir[2];
        player.moveDirToggle[3] *= dir[3];
    }

    switch(key){
        case 's':
            player.pos[1] += player.speed * player.moveDirToggle[1];
        break;
        case 'w':
            player.pos[1] -= player.speed * player.moveDirToggle[0];
        break;
        case 'd':
            player.pos[0] += player.speed * player.moveDirToggle[2];
        break;
        case 'a':
            player.pos[0] -= player.speed * player.moveDirToggle[3];
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

function RndmRange(min, max, returnInt){
    if(returnInt){
        output = Math.floor(Math.random() * (max - min) + min);
    }else{
        output = Math.random() * (max - min) + min;
    }

    return output;
}
