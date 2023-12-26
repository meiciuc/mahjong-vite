<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { vueService } from '../VueService';
const handleClick = () => {
    vueService.signalGameEndButton.dispatch();
}
</script>

<template>
    <div class="Background">
    </div>
    <div class="Container">
        <div class="Text">{{ Localization.getText('noMoreMoves.noMoreMoves') }}</div>
    </div>
    <div class="Container">
        <div class="Button" @click="handleClick">{{ Localization.getText('noMoreMoves.again') }}</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Background {
    background-color: $background_colored_darken;
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
}

.Container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    display: flex;
    justify-content: center;
    align-items: end;
    overflow: hidden;
}

.Text {
    font-family: 'Inter-SemiBold';
    text-align: center;
    font-size: 4em;
    color: white;
    user-select: none;
    margin-bottom: 30%;
}

.Button {
    font-family: 'Inter-SemiBold';
    color: $button_text_colored;
    border-radius: $button_border_radius;
    background-color: $button_background_idle;
    text-align: center;
    cursor: pointer;
    user-select: none;
    padding-top: $button_padding_vertical;
    padding-bottom: $button_padding_vertical;
    padding-left: $button_padding_horizontal;
    padding-right: $button_padding_horizontal;

    margin-bottom: 20%;
}
</style>
