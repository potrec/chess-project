<template>
    <div class="main-container">
        <div class="player-container black-player">
            <div class="chess"></div>
        </div>
        <div class="board-container">
            <div class="board-square" v-for="n in 64">{{ n }}</div>
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
    */
    const table: number[][] = [
        [4, 2, 3, 5, 6, 3, 2, 4],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1],
        [4, 2, 3, 5, 6, 3, 2, 4]
    ];

    console.log(table);

</script>

<style scoped>

</style>