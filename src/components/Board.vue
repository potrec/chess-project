<template>
    <div class="main-container">
        <div class="player-container black-player">
            <div class="chess"></div>
        </div>
        <div class="board-container">
            <div class="board-line"v-for="line in table">
                <div class="board-square" v-for="square in line">
                    <div class="figure"><img src="../assets/images/figures/Chess_bdt45.png"></img></div>
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
    }
    const table: number[][] = [
        [84, 82, 83, 85, 86, 83, 82, 84],
        [81, 81, 81, 81, 81, 81, 81, 81],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [71, 71, 71, 71, 71, 71, 71, 71],
        [74, 72, 73, 75, 76, 73, 72, 74]
    ];
    function getFigures(figure: Figure)
    {
        switch(figure)
        {
            case (figure.color == 7):
            {
                break;
            }
            case (figure.color == 8):
            {
                break;
            }
            default:
            {
                break;
            }
        }
        if(figure.name == 1)
        {

        }
        else if(figure.name == 2)
        {

        }
        else if(figure.name == 3)
        {

        }
        else if(figure.name == 4)
        {

        }
        else if(figure.name == 5)
        {

        }
        else if(figure.name == 6)
        {

        }
    }
    console.log(table);

</script>

<style scoped>

</style>