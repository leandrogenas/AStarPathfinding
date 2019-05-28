// var bestFirstStart = require('./bestfirst.js');
// var aStarStart = require('./astar.js');

import { aStarStart } from "./astar.js";
import { bestFirstStart } from "./bestfirst.js";

//CANVAS VARIABLES
var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var boxSize = 30;
var boxes = Math.floor(600 / boxSize);
canvas.addEventListener('click', handleClick);
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
var blockedItens = new Set();

function drawBox() {
  c.beginPath();
  c.fillStyle = "white";
  c.lineWidth = 3;
  c.strokeStyle = 'black';
  for (var row = 0; row < boxes; row++) {
    for (var column = 0; column < boxes; column++) {
      var x = column * boxSize;
      var y = row * boxSize;
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
    c.fillStyle = "red";

    c.fillRect(Math.floor(e.offsetX / boxSize) * boxSize,
    Math.floor(e.offsetY / boxSize) * boxSize,
    boxSize, boxSize);
    startRow = (Math.floor(e.y / boxSize));
    startCol = (Math.floor(e.x / boxSize));
  }
  else if(typeOfClick === 2){
    c.fillStyle = "yellow";

    c.fillRect(Math.floor(e.offsetX / boxSize) * boxSize,
    Math.floor(e.offsetY / boxSize) * boxSize,
    boxSize, boxSize);

    destinationRow = (Math.floor(e.y / boxSize));
    destinationCol = (Math.floor(e.x / boxSize));
  }
  else if(typeOfClick === 3){
    c.fillStyle = "black";

    c.fillRect(Math.floor(e.offsetX / boxSize) * boxSize,
    Math.floor(e.offsetY / boxSize) * boxSize,
    boxSize, boxSize);

    var row = (Math.floor(e.y / boxSize));
    var col = (Math.floor(e.x / boxSize));
    var matrix = [row, col];
    blockedItens.add(matrix)
  }

}

drawBox();

const buttonBestFirst = document.getElementById('bestFirst');
buttonBestFirst.addEventListener('click', () => {
  bestFirstStart(startRow, startCol, destinationRow, destinationCol, blockedItens);
});

const buttonAStar = document.getElementById('aStar');
buttonAStar.addEventListener('click', () => {
  aStarStart(startRow, startCol, destinationRow, destinationCol, blockedItens);
});
