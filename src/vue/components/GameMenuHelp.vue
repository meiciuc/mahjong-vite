<script setup lang="ts">
import { computed } from 'vue';
import { useModel } from '../../model/useModel';
import { VueServiceSignals, vueService } from '../VueService';
import { BoosterType } from '../../model/GameModel';

const boosters = useModel(["boosters"]);
const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.BoosterHelpUseBooster);
}

const boosterCount = computed(() => {
    return (boosters.value as any)[BoosterType.HELP]?.current || 0;
})

</script>

<template>
    <div class="ToolContainer" :class="{ ToolContainerDisabled: boosterCount === 0 }" @click="handleClick">
        <div class="HelpButton" :class="{ HelpButtonDisabled: boosterCount === 0 }">?</div>
        <div class="BoosterCount" :class="{ BoosterCountDisabled: boosterCount === 0 }">
            {{ boosterCount > 0 ? boosterCount : '' }}</div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.ToolContainer {
    position: relative;
}

.ToolContainer:hover .HelpButton {
    box-shadow: -1rem 1rem 0.4rem 0.4rem rgba(0, 0, 0, 0.1) inset;
}

.ToolContainer:hover .BoosterCount {
    transform: scale(1.2);
}

.ToolContainerDisabled {
    pointer-events: none;
    cursor: auto;
}

.ToolContainerDisabled .HelpButton {
    color: #cdcdcd;
    border-color: #cdcdcd;
    background: $color_light;
}

.ToolContainerDisabled .BoosterCount {
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

.BoosterCount {
    border-radius: 50%;
    color: $color_dark;

    font-size: 1.2rem;
    font-family: $button_font_family;

    position: absolute;
    right: 0px;
    bottom: 0px;
    background: #04FB9C;
    margin-right: -1rem;
    margin-bottom: -1rem;

    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;

    user-select: none;
    cursor: pointer;

    box-shadow: 0 0 0.3rem rgba(0, 0, 0, 0.5) inset;
    transition: all 100ms cubic-bezier(.25, .57, .68, 1.66);

    z-index: 1;
}

.BoosterCountDisabled {
    background: #ff0000;
    background-image: url(./assets/svg/shoppingСart.svg);
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: 40% 60%;
}
</style>
