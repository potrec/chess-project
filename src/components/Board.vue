<template>
    <div class="main-container">
       <div class="board-container">
         <div class="board-line" v-for="(line, i) in board.squares" :key="i">
            <div class="board-square" v-for="(square, j) in line" :key="j">
                <img class="figure" v-if="square" :src="getFigures(square)" @click="showMoves(square, i, j)">
           </div>
         </div>
       </div>
    </div>
</template>
   

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { isUpperCase } from '../helpers/isUpperCase';

const board = reactive({
 squares: Array.from({ length: 8 }, () => Array(8).fill(null)),
});

console.log(board);

type Figure = {
 type: FigureType,
 color: FigureColor,
 file: string,
 rank: number,
}

enum FigureColor {
 White = 0,
 Black = 1,
}

enum FigureType {
 ClearBoard = 0,
 King = 1,
 Knight = 3,
 Pawn = 2,
 Bishop = 4,
 Rook = 5,
 Queen = 6,
}

const pieceTypeFromSymbol: FenNotationType[] = [
 { figure: FigureType.ClearBoard, string: "" },
 { figure: FigureType.King, string: "k" },
 { figure: FigureType.Knight, string: "n" },
 { figure: FigureType.Pawn, string: "p" },
 { figure: FigureType.Bishop, string: "b" },
 { figure: FigureType.Rook, string: "r" },
 { figure: FigureType.Queen, string: "q" },
];

const startFEN: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
// const otherFEN: string = "r1bk3r/p2pBpNp/n4n2/1p1NP2P/6P1/3P4/P1P1K3/q5b1 b - - 1 23"
loadPositionFromFen(startFEN);

function loadPositionFromFen(fen: string) {
 let fenBoard: string = fen.split(' ')[0];
 let file: number = 0;
 let rank: number = 7;
 for (let symbol of fenBoard) {
    if (symbol === "/") {
      file = 0;
      rank--;
    } else {
      if (Number(symbol)) {
        file += Number(symbol);
      } else {
        var pieceColor = isUpperCase(symbol) ? FigureColor.White : FigureColor.Black;
        var pieceType = getFigureTypeByString(symbol.toLowerCase());
        console.log(pieceColor + " " + pieceType);
        board.squares[rank][file] = {
          type: pieceType,
          color: pieceColor,
          file: String.fromCharCode(97 + file),
          rank: rank + 1,
        };
        console.log(board);
        file++;
      }
    }
 }
}

function getFigureTypeByString(fenSymbol: string): FigureType | undefined {
 var piece = pieceTypeFromSymbol.find(item => item.string === fenSymbol);
 return piece ? piece.figure : undefined;
}

function getFigures(figure: Figure): string {
 let path = "/src/assets/images/figures/Chess_";
 switch (figure.type) {
    case FigureType.King:
      path += "k";
      break;
    case FigureType.Queen:
      path += "q";
      break;
    case FigureType.Rook:
      path += "r";
      break;
    case FigureType.Bishop:
      path += "b";
      break;
    case FigureType.Knight:
      path += "n";
      break;
    case FigureType.Pawn:
      path += "p";
      break;
    default:
      return "";
 }
 path += figure.color === FigureColor.White ? "lt45.png" : "dt45.png";
 return path;
}


    // const table: Figure[][] = [];

    // const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    // const ranks = [8, 7, 6, 5, 4, 3, 2, 1];
    // const squareRefs = ref([]);

    // for (let i = 0; i < 8; i++) {
    //     for (let j = 0; j < 8; j++) {
    //     squareRefs.value.push(ref(null));
    //     }
    // }

    // for (let rank of ranks) {
    //     const row: Figure[] = [];
    //     for (let file of files) {
    //         const color = (rank > 2 && rank < 7) ? 0 : (rank > 2 ? 7 : 8);
    //         let name = 0;
    //         if (rank === 2 || rank === 7) {
    //             name = 1;
    //         } else if ((rank === 1 && (file === 'a' || file === 'h')) || (rank === 8 && (file === 'a' || file === 'h'))) {
    //             name = 4;
    //         } else if ((rank === 1 && (file === 'b' || file === 'g')) || (rank === 8 && (file === 'b' || file === 'g'))) {
    //             name = 2;
    //         } else if ((rank === 1 && (file === 'c' || file === 'f')) || (rank === 8 && (file === 'c' || file === 'f'))) {
    //             name = 3;
    //         } else if ((rank === 1 && file === 'd') || (rank === 8 && file === 'd')) {
    //             name = 5;
    //         } else if ((rank === 1 && file === 'e') || (rank === 8 && file === 'e')) {
    //             name = 6;
    //         }

    //         row.push({ name, color, file, rank});
    //     }
    //     table.push(row);
    // }

    // function getFigures(figure: Figure): string
    // {
    //     let path = "/src/assets/images/figures/Chess_";
    //     if(figure.name == 1)
    //     {
    //         path += "p"
    //     }
    //     else if(figure.name == 2)
    //     {
    //         path += "n"
    //     }
    //     else if(figure.name == 3)
    //     {
    //         path += "b"
    //     }
    //     else if(figure.name == 4)
    //     {
    //         path += "r"
    //     }
    //     else if(figure.name == 5)
    //     {
    //         path += "q"
    //     }
    //     else if(figure.name == 6)
    //     {
    //         path += "k"
    //     }
    //     else
    //     {
    //         return "";
    //     }
    //     if(figure.color == 7)
    //     {
    //         path += "lt45.png"
    //     }
    //     else
    //     {
    //         path += "dt45.png"
    //     }
    //     return path
    // }

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
<style scoped>

</style>