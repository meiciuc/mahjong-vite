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

    const left = Left._rawValue as HTMLHtmlElement;
    const leftBounding = left.getBoundingClientRect();
    const leftX = leftBounding.x;
    const leftWidth = leftBounding.width;

    const center = Center._rawValue as HTMLHtmlElement;
    let x = window.innerWidth / 2 - center.getBoundingClientRect().width / 2 - leftX - leftWidth;

    if (leftWidth > x) {
        x = leftWidth;
    }

    center.style.marginLeft = `${x}px`;
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
        <div class="MenuContentItem Left" ref="Left">
            <div class="GameLevel">{{ gameLevel }}</div>
            <GameMenuScore></GameMenuScore>
        </div>
        <div class="MenuContentItem" ref="Center">
            <GameMenuTimer class="GameMenuTimer"></GameMenuTimer>
        </div>
        <div class="MenuContentItem">
            <GameMenuHelp></GameMenuHelp>
        </div>
        <div class="OptionsButtonPlace"></div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.MenuPanel {
    position: fixed;
    left: 0px;
    right: 0px;
    height: $game_menu_height;
    background-color: $menu_color_background;
    box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.5);
    display: flex;
}

.MenuPanel .ColoredBackgroundLine {
    position: absolute;
    top: calc($game_menu_height * .1);
    width: calc(100vw);
    height: calc($game_menu_height * .8);
    background-color: $menu_color_background;
    opacity: 0.6;
}

.MenuPanel .MenuContentItem {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 2rem;
}

.MenuPanel .Left {
    min-width: 8rem;
}

.MenuPanel .GameLevel {
    font-size: 2rem;
    font-family: $label_font_family;
    color: $menu_label_text_color;
    margin-right: 0.5rem;
    user-select: none;
}
</style>
