var ROW = 9;
var COL = 10;
var destinationRow;
var destinationCol;
var closedList = new Array();
var openList = new Array();
var matrix = [];
var neighborRecord;
var startCol;
var startRow;
matrix = [
  // 0  1  2  3  4  5  6  7  8  9
    [1, 0, 1, 1, 1, 1, 0, 1, 1, 1], // 0
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1], // 1
    [1, 1, 1, 0, 1, 1, 0, 1, 0, 1], // 2
    [0, 0, 1, 0, 1, 0, 0, 0, 0, 1], // 3
    [1, 1, 1, 0, 1, 1, 1, 0, 1, 1], // 4
    [1, 0, 1, 1, 1, 1, 0, 1, 0, 1], // 5
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1], // 6
    [1, 0, 1, 1, 1, 1, 0, 0, 0, 1], // 7
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]  // 8
  ];

function generateMatrix() {
  var item = createItem(startRow, startCol, matrix[startRow][startCol], 0)
  insertIntoOpenList(item);
}

function getHCost(row, col) { //MANHATAN HEURISTIC
  return Math.floor((Math.sqrt((row - destinationRow) * (row - destinationRow) + (col - destinationCol) * (col - destinationCol))));
}

function start() {
  startRow = document.getElementById('startRow').value;
  startRow = parseInt(startRow, 10);
  startCol = document.getElementById('startCol').value;
  startCol = parseInt(startCol, 10)
  if(isBlocked(startRow, startCol) == false){
    throw new Error("Please give a valid row and col values!");
  }

  destinationRow = document.getElementById('textareaRow').value;
  destinationRow = parseInt(destinationRow, 10);
  destinationCol = document.getElementById('textareaCol').value;
  destinationCol = parseInt(destinationCol, 10)

  if (isValid(destinationRow, destinationCol)) {
    generateMatrix();
  }

  while (Object.keys(openList[0]).length !== 0) {
    bestItem = getBestOpen();
    if (isDestination(bestItem.row, bestItem.col)) {
      console.log("Finished, found destination");
      createPath(bestItem);
      break;
    } else if (isValid(bestItem.row, bestItem.col)) {
      removeFromOpenList(bestItem);
      insertIntoClosedList(bestItem);
      var neighbors = getNeighbors(bestItem)
      for (i = 0; i < neighbors.length; i++) {
        var cost = neighbors[i].fCost;
        var fCost = neighbors[i].fCost;

        neighborRecord = isInClosedList(neighbors[i]);
        if (neighborRecord && cost >= neighborRecord.fCost){
          continue;
        }

        neighborRecord = isInOpenList(neighbors[i]);
        if (!neighborRecord || cost < neighborRecord.fCost) {
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
  var  col = item.col;
  // NEED TO FIND A BETTER WAY TO DO THIS, THINKING OF CHECKING THE 8 ADJACENT MATRIX NODES 
  if (isBlocked(row + 1, col)) neighbors.push(createItem(row+1, col, item));
  if (isBlocked(row - 1, col)) neighbors.push(createItem(row - 1, col, item));
  if (isBlocked(row, col + 1)) neighbors.push(createItem(row, col + 1, item));
  if (isBlocked(row, col - 1)) neighbors.push(createItem(row, col - 1, item));
  return neighbors;
}

function isBlocked(row, col) {
  if(isValid(row, col)){
    if (matrix[row][col] == 1) {
      return true;
    }
  }
  return false;
}

function createItem(row, col, parentItem){
  if(isValid(row, col)){
    isWall = matrix[row][col];
    gCost = parentItem.gCost + 1 || 1;
    hCost = getHCost(row, col);
    fCost = gCost + hCost;
    var item = new Item(isWall, gCost, hCost, fCost, row, col, parentItem);
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
  madePath = new Array();
  madePath2 = new Array();
  while (item.parent !== 1) {
    madePath.push(item);
    madePath2.push({ "ROW": item.row, "COL": item.col });
    item = item.parent;
  }
  madePath2 = madePath2.reverse();
  console.log(madePath);
  console.log(madePath2);
}

class Item {
  constructor(isWall, gCost, hCost, fCost, row, col, parent) {
    this.isWall = isWall;
    this.gCost = gCost;
    this.hCost = hCost;
    this.fCost = fCost;
    this.row = row;
    this.col = col;
    this.parent = parent;
  }
}