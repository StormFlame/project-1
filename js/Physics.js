//PHYSICS ENGINE

//-----------------------------------------------------------------

//check for collision
function checkCollisions(posOne, sizeOne, PosTwo, sizeTwo, returnSides){
    const objOneRadius_x = sizeOne[0]/2;
    const objOneRadius_y = sizeOne[1]/2;
    
    const objTwoRadius_x = sizeTwo[0]/2;
    const objTwoRadius_y = sizeTwo[1]/2;

    const objOneCenter = [posOne[0]+objOneRadius_x, posOne[1]+objOneRadius_y];
    const objTwoCenter = [PosTwo[0]+objTwoRadius_x, PosTwo[1]+objTwoRadius_y];

    const dist = distance(objOneCenter[0], objOneCenter[1], objTwoCenter[0], objTwoCenter[1]);

    const distThreshold_x = objOneRadius_x + objTwoRadius_x;
    const distThreshold_y = objOneRadius_y + objTwoRadius_y;

    let dir = [1,1,1,1];

    if(Math.abs(Math.round(dist[0])) <= distThreshold_x+1 && Math.abs(Math.round(dist[1])) <= distThreshold_y+1){
        if(returnSides === true){

            if(objOneCenter[0] + objOneRadius_x -1 < objTwoCenter[0] - objTwoRadius_x + 5){
                dir[2] = 0;
            }else if(objOneCenter[0] - objOneRadius_x + 1 > objTwoCenter[0] + objTwoRadius_x -5){
                dir[3] = 0;
            }

            if(objOneCenter[1] + objOneRadius_y -1 < objTwoCenter[1] - objTwoRadius_y + 5){
                dir[1] = 0;
            }else if(objOneCenter[1] - objOneRadius_y +1 > objTwoCenter[1] + objTwoRadius_y -5){
                dir[0] = 0;
            }

        }else{
            return true;
        }
    }

    //if on a corner, allow travel in any direction
    if(dir[0] === 0 || dir[1] === 0){
        if(dir[2] === 0 || dir[3] === 0){
            dir = [1,1,1,1];
        }
    }

    return dir;
}

// check keypress key and move player accordingly
function playerMove(key){

    const speedMltplier = (prcnt/player.speed)/2;

    switch(key){
        case 's':
            player.pos[1] += player.speed*speedMltplier * player.moveDirToggle[1];
            player.dir = [0,1,0,0];
        break;
        case 'w':
            player.pos[1] -= player.speed*speedMltplier * player.moveDirToggle[0];
            player.dir = [1,0,0,0];
        break;
        case 'd':
            player.pos[0] += player.speed*speedMltplier * player.moveDirToggle[2];
            player.dir = [0,0,1,0];
        break;
        case 'a':
            player.pos[0] -= player.speed*speedMltplier * player.moveDirToggle[3];
            player.dir = [0,0,0,1];
        break;
    }

    player.moveDirToggle = [1,1,1,1];

     const levelWalls = allLevels[currentLevel].walls;

     for(let i = 0; i < levelWalls.length; i++){

         const dir = checkCollisions(player.pos, player.size, [levelWalls[i].pos_x, levelWalls[i].pos_y], [levelWalls[i].width, levelWalls[i].height], true);

        player.moveDirToggle[0] *= dir[0];
        player.moveDirToggle[1] *= dir[1];
        player.moveDirToggle[2] *= dir[2];
        player.moveDirToggle[3] *= dir[3];
     }

    playerRender();
}

//-----------------------------------------------------------------

//HELPER

//calculate distance helper function
function distance(x_one, y_one, x_two, y_two){
    let x = x_two - x_one;
    let y = y_two - y_one;
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
