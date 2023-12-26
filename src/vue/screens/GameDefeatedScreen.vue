<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { vueService } from '../VueService';
import { computed, ref, onMounted } from 'vue';
import { Easing, Tween } from "@tweenjs/tween.js";
import { GameModelHelper } from '../../model/GameModelHelper';
import { UserActionAfterTheLastGame } from '../../model/GameModel';


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

onMounted(async () => {
    await animateScore();
})

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2}px`;
});

const handleClickRetry = () => {
    GameModelHelper.setUserActionAfterTheLastGame(UserActionAfterTheLastGame.RETRY);
    vueService.signalGameEndButton.dispatch();
}

const handleClickReset = () => {
    GameModelHelper.setUserActionAfterTheLastGame(UserActionAfterTheLastGame.RESET);
    vueService.signalGameEndButton.dispatch();
}
</script>

<template>
    <div class="Container">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div class="Text">{{ Localization.getText('defeated.defeated') }}</div>
            <button class="StartButton" @click="handleClickRetry">{{ Localization.getText('defeated.again') }}</button>
            <button class="StartButton" @click="handleClickReset">{{ Localization.getText('defeated.reset') }}</button>

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
</style>

