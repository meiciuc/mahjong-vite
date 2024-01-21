<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { computed, ref } from 'vue';
import { GameModelHelper } from '../../model/GameModelHelper';
import { UserActionAfterTheLastGame } from '../../model/GameModel';

const Popup = ref(null);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 2}px`;
});

const handleClick = (value: UserActionAfterTheLastGame) => {
    GameModelHelper.setUserActionAfterTheLastGame(value);
    vueService.signalDataBus.dispatch(VueServiceSignals.GameEndButton);
}
</script>

<template>
    <div class="Container">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div class="Text">{{ Localization.getText('defeated.defeated') }}</div>
            <button class="StartButton" @click="handleClick(UserActionAfterTheLastGame.RETRY)">{{
                Localization.getText('defeated.again') }}</button>
            <button class="StartButton" @click="handleClick(UserActionAfterTheLastGame.RESET)">{{
                Localization.getText('defeated.reset') }}</button>
            <button v-if="GameModelHelper.getGameLevel() > 1" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.PREVIOUS)">{{
                    Localization.getText('defeated.previous') }}</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Container {
    @include scene-container;
}

.Popup {
    @include scene-buttons-block;
}

.StartButton {
    @include scene-button;
    color: $button_text_colored;
    background-color: $button_text_idle;
    border-color: $button_text_idle;
}

.StartButton:hover {
    background-color: $button_background_colored;
    color: $button_text_idle;
    border-color: $button_text_idle;
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

