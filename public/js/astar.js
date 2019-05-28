//CANVAS VARIABLES
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var boxSize = 30;
var boxes = Math.floor(600 / boxSize);
c.globalAlpha = 0.8

//ROWS AND COLUMNS VARIABLES
var ROW = 20;
var COL = 20;
var destinationRow;
var destinationCol;
var startCol;
var startRow;

//GENERAL VARIABLES
var typeOfClick;
var closedList = new Array();
var openList = new Array();
var blockedItens = new Set();
var matrix = [];


function setHasBlockedItem(row, col){
  var blockOrNot = 1;
  blockedItens.forEach(item => {
    if(item[0] == row && item[1] == col){
      blockOrNot = 0;
    }
  });
  return blockOrNot;
}

function generateMatrix() {
  for (var y = 0; y < ROW; y++) {
    matrix[y] = [];
    for (var x = 0; x < COL; x++) {
      if(setHasBlockedItem(y, x)){
        matrix[y][x] = 1;
      } else {
        matrix[y][x] = 0;
      }
    }
  }
  var item = createItem(startRow, startCol, 0)
  insertIntoOpenList(item);
}

function getHCost(row, col) { //MANHATAN HEURISTIC
  //return Math.floor((Math.sqrt((row - destinationRow) * (row - destinationRow) + (col - destinationCol) * (col - destinationCol)))); EUCLIDEAN
  return (Math.abs(row - destinationRow) + Math.abs(col - destinationCol));
}

export function aStarStart(startR, startC, destinationR, destinationC, blockedI) {
  startRow = startR;
  startCol = startC;
  destinationRow = destinationR;
  destinationCol = destinationC;
  blockedItens = blockedI;
  generateMatrix();

  while (openList.length !== 0) {
    var bestItem = getBestOpen();
    if (isDestination(bestItem.row, bestItem.col)) {
      console.log("Finished, found destination");
      createPath(bestItem);
      break;
    } else if (isValid(bestItem.row, bestItem.col) && isNotBlocked(bestItem.row, bestItem.col)) {
      removeFromOpenList(bestItem);
      insertIntoClosedList(bestItem);
      var neighbors = getNeighbors(bestItem)
      for (var i = 0; i < neighbors.length; i++) {
        var cost = bestItem.gCost + neighbors[i].gCost;

        var neighborRecord = isInClosedList(neighbors[i]);
        if (neighborRecord && cost >= neighborRecord.gCost){
          continue;
        }

        neighborRecord = isInOpenList(neighbors[i]);
        if (!neighborRecord || cost < neighborRecord.gCost) {
          if (!neighborRecord) {
            insertIntoOpenList(neighbors[i]);
          } else {
            neighborRecord.parent = bestItem;
            neighborRecord.gCost = cost;
            neighborRecord.fCost = cost + neighborRecord.hCost;
          }
        }
      }
    }
  }
  if(openList.length == 0){
   return;
  }
}


function isValid(row, col) {
  return ((row >= 0) && (row < ROW) && (col >= 0) && (col < COL));
}

function isDestination(row, col) {
  return (row == destinationRow && col == destinationCol);
}


function insertIntoOpenList(item) {
  openList.push(item);

}

function insertIntoClosedList(item) {
  closedList.push(item);

}


function removeFromOpenList(item) {
  for (var i = 0; i < openList.length; i++) {
    if (openList[i] == item){
      openList.splice(i, 1);
    }
  }
}

function getBestOpen() {
  var bestI = 0;
  for (var i = 0; i < openList.length; i++) {
    if (openList[i].fCost < openList[bestI].fCost) {
      bestI = i;
    }
  }
  return openList[bestI];
}

function getNeighbors(item) {
  var neighbors = new Array();
  var row = item.row;
  var col = item.col;

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
    var gCost = parentItem.gCost + 1 || 0;
    var hCost = getHCost(row, col);
    var fCost = gCost + hCost;
    var item = new Item(gCost, hCost, fCost, row, col, parentItem);
    return item;
  }
  throw new Error("Please give a valid row and col values!");
}

function isInOpenList(item){
  for (var i = 0; i < openList.length; i++) {
    if (openList[i].row == item.row && openList[i].col == item.col){
      return openList[i];
    }
  }
  return false;
}

function isInClosedList(item){
  for (var i = 0; i < closedList.length; i++) {
    if (closedList[i].row == item.row && closedList[i].col == item.col){
      return closedList[i];
    }
  }
  return false;
}

function createPath(item) {
  var madePath = new Array();
  while (item.parent !== 0) {
    madePath.push(item);
    item = item.parent;
  }
  madePath = madePath.reverse();
  drawPath(madePath);
}

class Item {
  constructor(gCost, hCost, fCost, row, col, parent) {
    this.gCost = gCost;
    this.hCost = hCost;
    this.fCost = fCost;
    this.row = row;
    this.col = col;
    this.parent = parent;
  }
}

function drawPath(madePath) {
  console.log("The best path using A * and the manhatan heuristic is:" );
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
      c.fillStyle = "purple";
      c.fillRect(item.col * boxSize, item.row * boxSize, boxSize, boxSize);
    }
  });
  closedList = new Array();
  openList = new Array();
  return;
}
