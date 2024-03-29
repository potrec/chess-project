<template>
    <div class="main-container">
        <div class="player-container black-player">
            <div class="chess"></div>
        </div>
        <div class="board-container">
            <div class="board-line" v-for="(line, i) in table" :rank="ranks[i]">
                <div class="board-square" v-for="(figure, j) in line" :rank="ranks[i]" :file="files[j]">
                    <img class="figure" v-if="getFigures(figure) !== ''" :src="getFigures(figure)" v-on:click="showMoves(figure)">
                </div>
            </div>
        </div>
        <div class="player-container white-player">
            <div class="chess"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    /*
    0 - clear board
    1 - pawn
    2 - knight
    3 - bishop
    4 - rook
    5 - queen
    6 - king
    7 - white
    8 - black
    */
    type Figure = {
        name: number,
        color: number,
        file: string,
        rank: number,
    }
    const table: Figure[][] = [];

    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = [8, 7, 6, 5, 4, 3, 2, 1];

    for (let rank of ranks) {
        const row: Figure[] = [];
        for (let file of files) {
            const color = (rank > 2 && rank < 7) ? 0 : (rank > 2 ? 7 : 8);
            let name = 0;
            if (rank === 2 || rank === 7) {
                name = 1;
            } else if ((rank === 1 && (file === 'a' || file === 'h')) || (rank === 8 && (file === 'a' || file === 'h'))) {
                name = 4;
            } else if ((rank === 1 && (file === 'b' || file === 'g')) || (rank === 8 && (file === 'b' || file === 'g'))) {
                name = 2;
            } else if ((rank === 1 && (file === 'c' || file === 'f')) || (rank === 8 && (file === 'c' || file === 'f'))) {
                name = 3;
            } else if ((rank === 1 && file === 'd') || (rank === 8 && file === 'd')) {
                name = 5;
            } else if ((rank === 1 && file === 'e') || (rank === 8 && file === 'e')) {
                name = 6;
            }

            row.push({ name, color, file, rank});
        }
        table.push(row);
    }

    console.log(table);
    function getFigures(figure: Figure): string
    {
        let path = "/src/assets/images/figures/Chess_";
        if(figure.name == 1)
        {
            path += "p"
        }
        else if(figure.name == 2)
        {
            path += "n"
        }
        else if(figure.name == 3)
        {
            path += "b"
        }
        else if(figure.name == 4)
        {
            path += "r"
        }
        else if(figure.name == 5)
        {
            path += "q"
        }
        else if(figure.name == 6)
        {
            path += "k"
        }
        else
        {
            return "";
        }
        if(figure.color == 7)
        {
            path += "lt45.png"
        }
        else
        {
            path += "dt45.png"
        }
        return path
    }

    function showMoves(figure: Figure)
    {
        console.log(figure)
    }

</script>

<style scoped>

</style>