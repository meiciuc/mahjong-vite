<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { vueService } from '../VueService';
import { computed, ref, onMounted } from 'vue';
import { Easing, Tween } from "@tweenjs/tween.js";
import { GameModelHelper } from '../../model/GameModelHelper';
import { adsService } from '../../services/AdsService';
import { UserActionAfterTheLastGame } from '../../model/GameModel';
import { TimeSkipper } from '../../utils/TimeSkipper';

const showButtons = ref(false);
const Popup = ref(null);
const animateScore = async () => {
    const tweenProvider = { total: GameModelHelper.getGameTotalScore(), current: GameModelHelper.getGameCurrentScore() };
    new Tween(tweenProvider)
        .to({ total: tweenProvider.current + tweenProvider.total, current: 0 }, 500)
        .easing(Easing.Linear.None)
        .onUpdate(() => {
            GameModelHelper.setGameCurrentScore(Math.floor(tweenProvider.current));
        })
        .onComplete(() => {
            GameModelHelper.setGameCurrentScore(Math.floor(tweenProvider.current));
        })
        .start();
};

const showFullscrinAds = async () => {
    adsService.showFullscreen();
};

onMounted(async () => {
    await animateScore();
    await new TimeSkipper(1000).execute();
    try {
        await showFullscrinAds();
    } catch (error) {
        console.log(`Error: ${error}`)
    }

    showButtons.value = true;
});

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2}px`;
});

const handleClick = (value: UserActionAfterTheLastGame) => {
    GameModelHelper.setUserActionAfterTheLastGame(value);
    vueService.signalGameEndButton.dispatch();
}
</script>

<template>
    <div class="Container">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div class="Text">{{ Localization.getText('defeated.defeated') }}</div>
            <button :class="[showButtons ? '' : 'Opacity']" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.RETRY)">{{
                    Localization.getText('defeated.again') }}</button>
            <button :class="[showButtons ? '' : 'Opacity']" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.RESET)">{{
                    Localization.getText('defeated.reset') }}</button>
            <button v-if="GameModelHelper.getGameLevel() > 1" :class="[showButtons ? '' : 'Opacity']" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.PREVIOUS)">{{
                    Localization.getText('defeated.previous') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Container {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
}

.Popup {
    position: relative;
    width: fit-content;
    block-size: fit-content;
    left: 50%;
    top: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.StartButton {
    @include scene-button;
    color: $button_text_colored;
    background-color: $button_text_idle;
    border: solid;
    border-radius: $button_border_radius;
    border-color: $button_text_idle;
}

.StartButton:hover {
    background-color: $button_background_colored;
    color: $button_text_idle;
    border-color: $button_text_idle;
    border: solid;
}

.Text {
    font-family: 'Inter-SemiBold';
    text-align: center;
    font-size: 4em;
    color: white;
    user-select: none;
    margin-bottom: 30%;
}

.Opacity {
    opacity: 0;
}
</style>

