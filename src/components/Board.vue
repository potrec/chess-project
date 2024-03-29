<template>
    <div class="main-container">
        <div class="player-container black-player">
            <div class="chess"></div>
        </div>
        <div class="board-container">
            <div class="board-line" v-for="(line, index) in table" :key="index">
                <div class="board-square" v-for="(square, index) in line" :key="index">
                    <div class="figure">
                        <img v-if="getFigures(square) !== ''" :src="getFigures(square)">
                    </div>
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
    const table: Figure[][] = [
        [{"name": 4,"color": 8}, {"name": 2,"color": 8}, {"name": 3,"color": 8}, {"name": 5,"color": 8}, {"name": 6,"color": 8}, {"name": 3,"color": 8}, {"name": 2,"color": 8}, {"name": 4,"color": 8}],
        [{"name": 1,"color": 8}, {"name": 1,"color": 8}, {"name": 1,"color": 8}, {"name": 1,"color": 8}, {"name": 1,"color": 8}, {"name": 1,"color": 8}, {"name": 1,"color": 8}, {"name": 1,"color": 8}],
        [{"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}],
        [{"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}],
        [{"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}],
        [{"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}, {"name": 0,"color": 0}],
        [{"name": 1,"color": 7}, {"name": 1,"color": 7}, {"name": 1,"color": 7}, {"name": 1,"color": 7}, {"name": 1,"color": 7}, {"name": 1,"color": 7}, {"name": 1,"color": 7}, {"name": 1,"color": 7}],
        [{"name": 4,"color": 7}, {"name": 2,"color": 7}, {"name": 3,"color": 7}, {"name": 5,"color": 7}, {"name": 6,"color": 7}, {"name": 3,"color": 7}, {"name": 2,"color": 7}, {"name": 4,"color": 7}]
    ];
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
        console.log(path);
        return path
    }

</script>

<style scoped>

</style>