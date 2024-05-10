<script setup lang="ts">
import { onMounted, ref } from 'vue';
import GameMenuHelp from './GameMenuHelp.vue';
import GameMenuLevel from './GameMenuLevel.vue';
import GameMenuTimer from './GameMenuTimer.vue';

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
    window.addEventListener('resize', handleOnResize);
    window.addEventListener('orientationchange', handleOnResize);
    handleOnResize();
});

</script>

<template>
    <div class="MenuPanel">
        <div class="MenuContentItem Left" ref="Left">
            <GameMenuLevel class="MenuPanel__GameMenuLevel"></GameMenuLevel>
        </div>
        <div class="MenuContentItem" ref="Center">
            <GameMenuTimer class="MenuPanel__GameMenuTimer"></GameMenuTimer>
        </div>
        <div class="MenuContentItem Right">
            <GameMenuHelp class="MenuPanel__GameMenuHelp"></GameMenuHelp>
        </div>
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

.MenuPanel .Left {
    @include button_menu;
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
    min-width: 6rem;
}

.MenuPanel .GameLevel {
    font-size: 2rem;
    font-family: $label_font_family;
    color: $menu_label_text_color;
    margin-right: 0.5rem;
    user-select: none;
}
</style>
