<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
const helpsCount = useModel(["helpsCount"]);

const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.OptionsButton);
}
</script>

<template>
    <div class="MenuPanel">
        <div v-if="helpsCount > 0" class="OptionsButton" @click="handleClick">&#x2699;</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

div {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    font-family: 'Inter-SemiBold';
}

.MenuPanel {
    padding: 10px 30px;
    display: flex;
    justify-content: right;
}


.OptionsButton {
    @include scene-button;
    color: $button_text_colored;
    background-color: $button_text_idle;
    padding: 0px calc($button_padding_horizontal / 4);
    border-radius: $button_border_radius;
    border-color: $button_text_idle;
    border: solid;
    font-size: 1.5em;
}

.OptionsButton:hover {
    background-color: $button_background_colored;
    color: $button_text_idle;
    border-color: $button_text_idle;
}

.OptionsButtonDisabled {
    pointer-events: none;
    cursor: auto;
    opacity: 0.7;
}

.HelpsCount {
    user-select: none;
    color: $button_text_idle;
    padding: calc($button_padding_vertical / 2) calc($button_padding_horizontal / 4);
    width: 3em;
}
</style>
