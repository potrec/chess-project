<template>
  <div class="main-container">
    <div class="board-container">
      <div class="board-line" v-for="(line, i) in board.squares" :key="i">
        <div
          class="board-square"
          v-for="(square, j) in line"
          :key="j"
          :index="64 - (8 - j) - i * 8"
          draggable="false"
          v-on:dragenter="handleDragEnter($event, square, i, j)"
          v-on:dragend="handleDragEnd($event, square)"
          @click="onClick(square)"
        >
          <img
            class="figure"
            v-if="square"
            :src="getFigures(square)"
            draggable="true"
            v-on:dragstart="handleDragStart($event, square)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { isUpperCase } from '../helpers/isUpperCase'

var board = reactive({
  squares: Array.from({ length: 8 }, () => Array(8).fill(null))
})

const directionOffsets: number[] = [8, -8, -1, 1, 7, -7, 9, -9]
const arrayOfSquaresToEdge: numSquaresToEdge[] = []
precomputedMoveData()
console.log(arrayOfSquaresToEdge)
console.log(board)

type numSquaresToEdge = {
  numNorth: number
  numSouth: number
  numWest: number
  numEast: number
  minNW: number
  minSE: number
  minNE: number
  minSW: number
}

// todo: organize this mess !!!
type Figure = {
  type: FigureType
  color: FigureColor
  file: string
  rank: number
}

type FenNotationType = {
  figure: FigureType
  string: string
}

type TempFigure = {
  i: number
  j: number
}

type Move = {
  startSquare: number
  targetSquare: number
}

enum FigureColor {
  White = 0,
  Black = 1
}

enum FigureType {
  ClearBoard = 0,
  King = 1,
  Knight = 3,
  Pawn = 2,
  Bishop = 4,
  Rook = 5,
  Queen = 6
}

const pieceTypeFromSymbol: FenNotationType[] = [
  { figure: FigureType.ClearBoard, string: '' },
  { figure: FigureType.King, string: 'k' },
  { figure: FigureType.Knight, string: 'n' },
  { figure: FigureType.Pawn, string: 'p' },
  { figure: FigureType.Bishop, string: 'b' },
  { figure: FigureType.Rook, string: 'r' },
  { figure: FigureType.Queen, string: 'q' }
]

const startFEN: string = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
//const otherFEN: string = 'r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 1 23'
loadPositionFromFen(startFEN)
function loadPositionFromFen(fen: string) {
  board.squares = Array.from({ length: 8 }, () => Array(8).fill(null))
  let fenBoard: string = fen.split(' ')[0]
  let file: number = 0
  let rank: number = 0
  for (let symbol of fenBoard) {
    if (symbol === '/') {
      file = 0
      rank++
    } else {
      if (Number(symbol)) {
        file += Number(symbol)
      } else {
        var pieceColor = isUpperCase(symbol) ? FigureColor.White : FigureColor.Black
        var pieceType = getFigureTypeByString(symbol.toLowerCase())
        board.squares[rank][file] = {
          type: pieceType,
          color: pieceColor,
          file: String.fromCharCode(97 + file),
          rank: rank
        }
        file++
      }
    }
  }
}

function getFigureTypeByString(fenSymbol: string): FigureType | undefined {
  var piece = pieceTypeFromSymbol.find((item) => item.string === fenSymbol)
  return piece ? piece.figure : undefined
}

function getFigures(figure: Figure): string {
  let path = '/src/assets/images/figures/Chess_'
  switch (figure.type) {
    case FigureType.King:
      path += 'k'
      break
    case FigureType.Queen:
      path += 'q'
      break
    case FigureType.Rook:
      path += 'r'
      break
    case FigureType.Bishop:
      path += 'b'
      break
    case FigureType.Knight:
      path += 'n'
      break
    case FigureType.Pawn:
      path += 'p'
      break
    default:
      return ''
  }
  path += figure.color === FigureColor.White ? 'lt45.png' : 'dt45.png'
  return path
}

var dragStartSquare: Figure
var dragEndSquare: TempFigure

function handleDragStart(event: MouseEvent, figure: Figure) {
  dragStartSquare = figure
}

function handleDragEnd(event: MouseEvent, figure: Figure) {
  board.squares[dragEndSquare.i][dragEndSquare.j] = figure
  calculateMoves(figure)
  if (
    dragStartSquare.rank != dragEndSquare.i ||
    dragStartSquare.file.charCodeAt(0) - 97 != dragEndSquare.j
  ) {
    deleteFigureImage()
    figure.rank = dragEndSquare.i
    figure.file = String.fromCharCode(97 + dragEndSquare.j)
  }
  addFigureImage()
  //todo: handle the correct moves of the figures
}

function handleDragEnter(event: MouseEvent, figure: Figure, i: number, j: number) {
  event.preventDefault()
  dragEndSquare = { i: i, j: j }
}

function deleteFigureImage() {
  board.squares[dragStartSquare.rank][dragStartSquare.file.charCodeAt(0) - 97] = null
}

function addFigureImage() {
  //add img of the figure in the board
}

function onClick(figure: Figure) {
  console.log(figure)
}

function calculateMoves(figure: Figure): boolean {
  let indexOfTheFigure =
    64 - (8 - (dragStartSquare.file.charCodeAt(0) - 97)) - dragStartSquare.rank * 8
  console.log(indexOfTheFigure)
  return true
}
generateMoves()
function generateMoves() {
  var moves: Move[] = null
  for (var startSquare = 0; startSquare < 64; startSquare++) {
    var piece = board.squares[Math.floor(startSquare / 8)][startSquare % 8]
    console.log(piece)
  }
  // return moves
}

function precomputedMoveData() {
  for (let file = 0; file < 8; file++) {
    for (let rank = 0; rank < 8; rank++) {
      let numNorth: number = 7 - rank
      let numSouth: number = rank
      let numWest: number = file
      let numEast: number = 7 - file
      let squareIndex = rank * 8 + file
      let minNW: number = Math.min(numNorth, numWest)
      let minSE: number = Math.min(numSouth, numEast)
      let minNE: number = Math.min(numNorth, numEast)
      let minSW: number = Math.min(numSouth, numWest)
      arrayOfSquaresToEdge[squareIndex] = {
        numNorth: numNorth,
        numSouth: numSouth,
        numWest: numWest,
        numEast: numEast,
        minNW: minNW,
        minSE: minSE,
        minNE: minNE,
        minSW: minSW
      }
    }
  }
}
// function showMoves(figure: Figure,i: number,j: number)
// {
//     console.log(figure)

//     const square = squareRefs.value[i*8+j]
//     console.log(square._rawValue[0].style);
//     square._rawValue[0].style.backgroundColor = 'lightblue';
//     console.log(calculateMoves(figure));
// }
// /*
// 0 - can't move there
// 1 - can move there
// 2 - can move there and destroy figure
// 3 - can move there and transform into a new figure
// 4 - place where the figure is in
// */
// const directionOffsets = [8,-8,-1,1,7,-7,9,-9];
// function calculateMoves(figure: Figure)
// {
//     let movesTable:number[][] = Array(8).fill(0).map(() => Array(8).fill(0));
//     for(var i = 0; i < movesTable.length; i++)
//     {
//         for(var j = 0; j<movesTable[i].length; j++)
//         {
//             if(table[i][j].name != 0)
//             {
//                 movesTable[i][j] = 0
//             }
//             else
//             {
//                 movesTable[i][j] = 1
//             }
//         }
//     }
//     console.log("file: "+figure.file + " rank: " + figure.rank + " name:" + figure.name)
//     // if(figure.name === 1)
//     // {
//     //     movesTable[ranks.indexOf(figure.rank)-1][files.indexOf(figure.file)] = 1;
//     //     movesTable[ranks.indexOf(figure.rank)-2][files.indexOf(figure.file)] = 1;
//     //     movesTable[ranks.indexOf(figure.rank)-1][files.indexOf(figure.file)+1] = 1;// right slant
//     //     movesTable[ranks.indexOf(figure.rank)-1][files.indexOf(figure.file)-1] = 1;// left slant
//     // }
//     // if(figure.name === 2)
//     // {
//     //     movesTable[ranks.indexOf(figure.rank)-2][files.indexOf(figure.file)+1] = 1;
//     //     movesTable[ranks.indexOf(figure.rank)-2][files.indexOf(figure.file)-1] = 1;
//     //     movesTable[ranks.indexOf(figure.rank)-1][files.indexOf(figure.file)+2] = 1;
//     //     movesTable[ranks.indexOf(figure.rank)-1][files.indexOf(figure.file)-2] = 1;
//     // }
//     // if(figure.name === 3)
//     // {

//     // }
//     // if(figure.name === 4)
//     // {

//     // }
//     calculateDistanceToEdge(movesTable,figure);
//     return {movesTable,figure};
// }

// function calculateSlant(movesTable:number[][], figure:  Figure)
// {

// }

// function calculateDistanceToEdge(movesTable:number[][], figure:  Figure)
// {
//     // let i = movesTable[ranks.indexOf(figure.rank)][files.indexOf(figure.file)];
//     let leftEdge = 0;
//     let upEdge = 0;
//     let downEdge = 0;
//     let rightEdge = 0;
//     let i = ranks.indexOf(figure.rank);
//     let j = files.indexOf(figure.file);
//     try{
//         while(true)
//         {
//             if(movesTable[i][j-1] != 0)
//             {
//                 leftEdge++;
//                 j--;
//             }
//             else
//             {
//                 break;
//             }
//         }
//         while(true)
//         {
//             if(movesTable[i][j+1] != 0)
//             {
//                 rightEdge++;
//                 j++;
//             }
//             else
//             {
//                 break;
//             }
//         }
//         while(true)
//         {
//             if(movesTable[i+1][j] != 0)
//             {
//                 upEdge++;
//                 i++;
//             }
//             else
//             {
//                 break;
//             }
//         }
//         while(true)
//         {
//             if(movesTable[i-1][j] != 0)
//             {
//                 downEdge++;
//                 i--;
//             }
//             else
//             {
//                 break;
//             }
//         }
//     }
//     catch(e)
//     {
//         console.log(e);
//     }
//     if(figure.color == 8)
//     {
//         let temp = downEdge;
//         downEdge = upEdge;
//         upEdge = temp;
//     }

//     console.log("leftEdge: ",leftEdge,"indexes:",i,j,"upEdge: ",upEdge,"downEdge: ",downEdge,"rightEdge: ",rightEdge)
// }
</script>
<style scoped></style>
