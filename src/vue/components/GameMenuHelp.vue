<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';

const helpsCount = useModel(["helpsCount"]);
const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.HelpButton);
}

</script>

<template>
    <div class="HelpContainer" :class="{ HelpContainerDisabled: helpsCount === 0 }" @click="handleClick">
        <div class="HelpButton" :class="{ HelpButtonDisabled: helpsCount === 0 }">?</div>
        <!-- <div class="HelpsCount" :class="{ HelpCountDisabled: helpsCount === 0 }">{{ helpsCount }}</div> -->
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.HelpContainer {
    position: relative;
}

.HelpContainer:hover .HelpButton {
    box-shadow: -1rem 1rem 0.4rem 0.4rem rgba(0, 0, 0, 0.1) inset;
}

.HelpContainer:hover .HelpsCount {
    transform: scale(1.5);
}

.HelpContainerDisabled {
    pointer-events: none;
    cursor: auto;
}

.HelpContainerDisabled .HelpButton {
    color: #cdcdcd;
    border-color: #cdcdcd;
    background: $color_light;
}

.HelpContainerDisabled .HelpsCount {
    @include menu_button-disabled;
    border-radius: .6rem;
    background: $color_light;
}

.HelpButton {
    @include button_menu;
    width: 3rem;
    font-size: 2rem;
    color: $menu_label_text_color;
    border-radius: 50%;
}

.HelpsCount {
    border-color: $color_5;
    border-radius: 50%;
    color: $color_5;

    border-width: 3px;
    border-style: solid;
    font-size: 1rem;

    position: absolute;
    right: 0px;
    bottom: 0px;
    background: #FF7A59;
    margin-right: -0.5rem;
    margin-bottom: -0.5rem;

    width: 1.5rem;
    height: 1.5rem;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;

    user-select: none;
    cursor: pointer;

    transition: all 100ms cubic-bezier(.25, .57, .68, 1.66);

    z-index: 1;
}
</style>
