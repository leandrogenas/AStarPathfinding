import { aStarStart } from "./astar.js";
import { bestFirstStart } from "./bestfirst.js";

//CANVAS VARIABLES
let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d");
let boxSize = 30;
let boxes = Math.floor(600 / boxSize);
canvas.addEventListener('click', handleClick);
c.globalAlpha = 0.8;

//ROWS AND COLUMNS VARIABLES
let destinationRow;
let destinationCol;
let startCol;
let startRow;

//GENERAL VARIABLES
let typeOfClick;
let blockedItens = new Set();
let iterableBlockedItens = new Set();
let contStart = new Array();
let contEnd = new Array();
let endI = 0;
let startI = 0;
let allNodes;

function drawBox() {
  c.beginPath();
  c.fillStyle = "white";
  c.lineWidth = 3;
  c.strokeStyle = 'black';
  for (let row = 0; row < boxes; row++) {
    for (let column = 0; column < boxes; column++) {
      let x = column * boxSize;
      let y = row * boxSize;
      c.rect(x, y, boxSize, boxSize);
      c.fill();
      c.stroke();
    }
  }
  c.closePath();

}

const buttonStart = document.getElementById('start');
buttonStart.addEventListener('click', () => {
  typeOfClick = 1;
});

const buttonEnd = document.getElementById('end');
buttonEnd.addEventListener('click', () => {
  typeOfClick = 2;
});

const buttonBlocked = document.getElementById('block');
buttonBlocked.addEventListener('click', () => {
  typeOfClick = 3;
});

const buttonClear = document.getElementById('clear');
buttonClear.addEventListener('click', () => {
  location.reload(true);
});



function handleClick(e) {
  if(typeOfClick === 1){
    if(startI === 0) {
      c.fillStyle = "red";
      c.fillRect(Math.floor(e.offsetX / boxSize) * boxSize,
      Math.floor(e.offsetY / boxSize) * boxSize,
      boxSize, boxSize);
      startRow = (Math.floor(e.y / boxSize));
      startCol = (Math.floor(e.x / boxSize));


      let row = (e.offsetX);
      let col = (e.offsetY);
      let matrix = [row, col];
      contStart.push(matrix);

      startI++;
    } else {
      c.fillStyle = "white";
      c.clearRect(Math.floor(contStart[0][0]/ boxSize) * boxSize,
      Math.floor(contStart[0][1] / boxSize) * boxSize,
      boxSize, boxSize);
      c.stroke();
      contStart = new Array();
      startI--;
    }
  }
  else if(typeOfClick === 2){
    if(endI === 0) {
      c.fillStyle = "yellow";
      c.fillRect(Math.floor(e.offsetX / boxSize) * boxSize,
      Math.floor(e.offsetY / boxSize) * boxSize,
      boxSize, boxSize);

      let row = (e.offsetX);
      let col = (e.offsetY);
      let matrix = [row, col];
      contEnd.push(matrix)
      destinationRow = (Math.floor(e.y / boxSize));
      destinationCol = (Math.floor(e.x / boxSize));

      endI++;
    } else {
      c.fillStyle = "white";
      c.clearRect(Math.floor(contEnd[0][0]/ boxSize) * boxSize,
      Math.floor(contEnd[0][1] / boxSize) * boxSize,
      boxSize, boxSize);
      c.stroke();
      contEnd = new Array();
      endI--;
    }
  }
  else if(typeOfClick === 3){
    c.fillStyle = "black";

    c.fillRect(Math.floor(e.offsetX / boxSize) * boxSize,
    Math.floor(e.offsetY / boxSize) * boxSize,
    boxSize, boxSize);

    let row = (Math.floor(e.y / boxSize));
    let col = (Math.floor(e.x / boxSize));
    let matrix = [row, col];
    blockedItens.add(matrix);
  }

}

drawBox();

const buttonBestFirst = document.getElementById('bestFirst');
buttonBestFirst.addEventListener('click', () => {
  if(allNodes == undefined) {
    allNodes = bestFirstStart(startRow, startCol, destinationRow, destinationCol, blockedItens);
  } else {
    clearAllNodes();
    allNodes = bestFirstStart(startRow, startCol, destinationRow, destinationCol, blockedItens);
  }
});

const buttonAStar = document.getElementById('aStar');
buttonAStar.addEventListener('click', () => {
  if(allNodes == undefined) {
    allNodes = aStarStart(startRow, startCol, destinationRow, destinationCol, blockedItens);
  } else {
    clearAllNodes();
    allNodes = aStarStart(startRow, startCol, destinationRow, destinationCol, blockedItens);
  }
});

const clearPath = document.getElementById('clearMadePath');
clearPath.addEventListener('click', () => {
  clearAllNodes();
});

function clearAllNodes() {
  c.globalAlpha = 1;
  c.fillStyle =  "white";
  iterableBlockedItens = Array.from(blockedItens);

  if(allNodes != undefined) {
    allNodes.map(item => {
      c.fillRect(item.col * boxSize, item.row * boxSize, boxSize, boxSize);
      c.stroke();
    });
    
    iterableBlockedItens.map(item => {
      c.fillRect(item[1] * boxSize, item[0] * boxSize, boxSize, boxSize);
      c.stroke();
    });
    drawAllNodes();
  }
}

function drawAllNodes() {
  c.globalAlpha = 0.8;
  iterableBlockedItens = Array.from(blockedItens);

  iterableBlockedItens.map(item => {
    c.fillStyle =  "black";
    c.fillRect(item[1] * boxSize, item[0] * boxSize, boxSize, boxSize);
  });

  c.fillStyle = "yellow";
  c.fillRect(destinationCol * boxSize, destinationRow * boxSize, boxSize, boxSize);
  
  c.fillStyle = "red";
  c.fillRect(startCol * boxSize, startRow * boxSize, boxSize, boxSize);
}

