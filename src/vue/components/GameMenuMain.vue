<script setup lang="ts">
import { useModel } from '../../model/useModel';
import GameMenuTimer from './GameMenuTimer.vue';
import GameMenuHelp from './GameMenuHelp.vue';
import GameMenuScore from './GameMenuScore.vue';
import { onMounted, ref } from 'vue';

const gameLevel = useModel(["gameLevel"]);

const Left = ref(null);
const Center = ref(null);

const handleOnResize = () => {

    if (!Center || !Left) {
        return;
    }

    const center = Center._rawValue as HTMLHtmlElement;
    let x = window.innerWidth / 2 - center.getBoundingClientRect().width / 2;

    const left = Left._rawValue as HTMLHtmlElement;
    const leftWidth = left.getBoundingClientRect().width;

    if (leftWidth > x) {
        x = leftWidth;
    }

    center.style.left = `${x}px`;
}

onMounted(() => {
    console.log('mounted')
    window.addEventListener('resize', handleOnResize);
    window.addEventListener('orientationchange', handleOnResize);
    handleOnResize();
});

</script>

<template>
    <div class="MenuPanel">
        <div class="MenuContentItem" ref="Left">
            <div class="GameLevel">{{ gameLevel }}</div>
            <GameMenuScore></GameMenuScore>
        </div>
        <div class="MenuContentItem Center" ref="Center">
            <GameMenuTimer class="GameMenuTimer"></GameMenuTimer>
            <GameMenuHelp></GameMenuHelp>
        </div>
        <div class="OptionsButtonPlace"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.MenuPanel {
    width: calc(100vw - 3rem);
    height: $game_menu_height;
    position: fixed;

    background: $background_colored;
    display: flex;
    background-color: red;
}

.MenuContentItem {
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Inter-SemiBold';
}

.Center {
    position: absolute;
}

.GameLevel {
    @include menu_button;
}
</style>
