<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import GameMenuScore from './GameMenuScore.vue';

const gameLevel = useModel(["gameLevel"]);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.LeaderBoardButton);
}

</script>

<template>
    <div class="GameMenuLevel" @click="handleClick">
        <div class="MenuContentItem">
            <div class="GameLevel">{{ gameLevel }}</div>
            <GameMenuScore></GameMenuScore>
        </div>
        <div 
            class="LeaderboardIcon" 
            style = "background-image: url(./assets/svg/cup.svg);"
        ></div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.GameMenuLevel {
    position: relative;
}

.GameMenuLevel .MenuContentItem {
    display: flex;
    justify-content: center;
    align-items: center;
}

.GameMenuLevel .GameLevel {
    font-size: 2rem;
    font-family: $label_font_family;
    color: $menu_label_text_color;
    margin-right: 0.5rem;
    user-select: none;
}

.GameMenuLevel .LeaderboardIcon {
    border-radius: 50%;
    border-style: solid;
    border-width: 0.1rem;
    border-color: rgba(100, 100, 100, 1);
    color: $color_dark;

    position: absolute;
    right: -2.5rem;
    bottom: 0px;
    background: #FFE604;
    margin-bottom: -1rem;

    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;

    user-select: none;
    cursor: pointer;

    // box-shadow: -1rem 1rem 0.4rem 0.4rem rgba(255, 100, 100, 0.5) inset;
    box-shadow: inset -1rem -0.5rem 2rem 2rem rgba(255, 100, 100, 0.1);
    transition: all 100ms cubic-bezier(.25, .57, .68, 1.66);

    background-repeat: no-repeat;
    background-size: 60%;
    background-position: 50% 60%;

    z-index: 1;
}

.GameMenuLevel:hover .LeaderboardIcon {
    transform: scale(1.2);
}
</style>
