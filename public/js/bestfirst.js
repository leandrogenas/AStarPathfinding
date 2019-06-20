//CANVAS VARIABLES
let canvas = document.getElementById("canvas");
let c = canvas.getContext("2d")
let boxSize = 30;
c.globalAlpha = 0.8;

//ROWS AND COLUMNS VARIABLES
let ROW = 20;
let COL = 20;
let destinationRow;
let destinationCol;
let startCol;
let startRow;

//GENERAL VARIABLES
let closedList = new Array();
let openList = new Array();
let blockedItens = new Set();
let matrix = [];
let allNodes;

//ITEM CLASS
class Item {
  constructor(hCost, row, col, parent) {
    this.hCost = hCost;
    this.row = row;
    this.col = col;
    this.parent = parent;
  }
}


function setHasBlockedItem(row, col){
  let blockOrNot = 1;
  blockedItens.forEach(item => {
    if(item[0] == row && item[1] == col){
      blockOrNot = 0;
    }
  });
  return blockOrNot;
}

function generateMatrix() {
  for (let y = 0; y < ROW; y++) {
    matrix[y] = [];
    for (let x = 0; x < COL; x++) {
      if(setHasBlockedItem(y, x)){
        matrix[y][x] = 1;
      } else {
        matrix[y][x] = 0;
      }
    }
  }
  let item = createItem(startRow, startCol, 0)
  insertIntoOpenList(item);
}

function getHCost(row, col) { //MANHATAN HEURISTIC
  return (Math.abs(row - destinationRow) + Math.abs(col - destinationCol));
}


export function bestFirstStart(startR, startC, destinationR, destinationC, blockedI) {

  startRow = startR;
  startCol = startC;
  destinationRow = destinationR;
  destinationCol = destinationC;
  blockedItens = blockedI;
  generateMatrix();


  while (openList.length !== 0) {
    let bestItem = getBestOpen();
    if (isDestination(bestItem.row, bestItem.col)) {
      console.log("Finished, found destination");
      allNodes =  [...new Set([...openList, ...closedList])];
      createPath(bestItem);
      break;
    }

    removeFromOpenList(bestItem);
    insertIntoClosedList(bestItem);
    let neighbors = getNeighbors(bestItem)
    for (let i = 0; i < neighbors.length; i++) {
      let cost = bestItem.hCost + neighbors[i].hCost;

      let neighborRecord = isInClosedList(neighbors[i]);
      if (neighborRecord && cost >= neighborRecord.hCost){
        continue;
      }

      neighborRecord = isInOpenList(neighbors[i]);
      if (!neighborRecord) {
        insertIntoOpenList(neighbors[i]);
      } else if (cost < neighborRecord.hCost) {
        neighborRecord.parent = bestItem;
        neighborRecord.hCost = cost + neighborRecord.hCost;
      }
    }
    if(openList.length == 0){
      console.log("Couldn't find a path with best-first");
      return;
    }
  }
  return allNodes;
}


function isValid(row, col) {
  return ((row >= 0) && (row < ROW) && (col >= 0) && (col < COL));
}

function isDestination(row, col) {
  return (row == destinationRow && col == destinationCol);
}


function insertIntoOpenList(item) {
  console.log("Inserted into open list:", item);
  openList.push(item);
}

function insertIntoClosedList(item) {
  console.log("Inserted into closed list:", item);
  closedList.push(item);
}


function removeFromOpenList(item) {
  for (let i = 0; i < openList.length; i++) {
    if (openList[i] == item){
      openList.splice(i, 1);
    }
  }
}

function getBestOpen() {
  let bestI = 0;
  for (let i = 0; i < openList.length; i++) {
    if (openList[i].hCost < openList[bestI].hCost) {
      bestI = i;
    }
  }
  return openList[bestI];
}

function getNeighbors(item) {
  let neighbors = new Array();
  let row = item.row;
  let col = item.col;

  if (isNotBlocked(row + 1, col)) neighbors.push(createItem(row+1, col, item));
  if (isNotBlocked(row - 1, col)) neighbors.push(createItem(row - 1, col, item));
  if (isNotBlocked(row, col + 1)) neighbors.push(createItem(row, col + 1, item));
  if (isNotBlocked(row, col - 1)) neighbors.push(createItem(row, col - 1, item));
  return neighbors;
}

function isNotBlocked(row, col) {
  if(isValid(row, col)){
    if (matrix[row][col] == 1) {
      return true;
    }
  }
  return false;
}

function createItem(row, col, parentItem){
  if(isValid(row, col)){
    let hCost = getHCost(row, col);
    let item = new Item(hCost, row, col, parentItem);
    return item;
  }
  throw new Error("Please give a valid row and col values!");
}

function isInOpenList(item){
  for (let i = 0; i < openList.length; i++) {
    if (openList[i].row == item.row && openList[i].col == item.col){
      return openList[i];
    }
  }
  return false;
}

function isInClosedList(item){
  for (let i = 0; i < closedList.length; i++) {
    if (closedList[i].row == item.row && closedList[i].col == item.col){
      return closedList[i];
    }
  }
  return false;
}

function createPath(item) {
  let madePath = new Array();
  while (item.parent !== 0) {
    madePath.push(item);
    item = item.parent;
  }
  madePath = madePath.reverse();
  drawPath(madePath);
}

function drawPath(madePath) {
  console.log("The best path using Best First and the manhatan heuristic is:" );
  madePath.map(item => {
    console.log(`Row: ${item.row} | Col: ${item.col}`);
    if(!(item.row == destinationRow && item.col == destinationCol)){
      c.fillStyle = "blue";
      c.fillRect(item.col * boxSize, item.row * boxSize, boxSize, boxSize);
    }

  });

  closedList.map(item => {
    if(!madePath.includes(item) && !(item.row == startRow && item.col == startCol)){
      c.fillStyle = "green";
      c.fillRect(item.col * boxSize, item.row * boxSize, boxSize, boxSize);
    }
  });

  openList.map(item => {
    if(!madePath.includes(item)){
      c.fillStyle =  "purple";
      c.fillRect(item.col * boxSize, item.row * boxSize, boxSize, boxSize);
    }
  });
  openList = new Array();
  closedList = new Array();
  return;
}