<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { computed, ref } from 'vue';
import { GameModelHelper } from '../../model/GameModelHelper';
import { UserActionAfterTheLastGame } from '../../model/GameModel';
import ShopModule from '../components/ShopModule.vue';

const Popup = ref(null);

const marginLeft = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().width / 2}px`;
});

const marginTop = computed(() => {
    return Popup.value === null ? '0px' : `-${(Popup.value as HTMLDivElement).getBoundingClientRect().height / 3}px`;
});

const handleClick = (value: UserActionAfterTheLastGame) => {
    GameModelHelper.setUserActionAfterTheLastGame(value);
    vueService.signalDataBus.dispatch(VueServiceSignals.GameEndButton);
}
</script>

<template>
    <div class="Container">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div class="Text" style="color: brown;">{{ Localization.getText('noMoreMoves.noMoreMoves') }}</div>
            <div class="Spacer"></div>
            <button class="StartButton" @click="handleClick(UserActionAfterTheLastGame.RETRY)">{{
                Localization.getText('noMoreMoves.again') }}</button>
            <div class="Spacer"></div>
            <button class="StartButton" @click="handleClick(UserActionAfterTheLastGame.RESET)">{{
                Localization.getText('noMoreMoves.reset') }}</button>
            <div class="Spacer"></div>
            <button v-if="GameModelHelper.getGameLevel() > 1" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.PREVIOUS)">{{
                    Localization.getText('noMoreMoves.previous') }}</button>
            <div class="Spacer"></div>
            <ShopModule></ShopModule>
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
}

.StartButton:hover {
    @include button_hover;
}

.Text {
    font-family: 'Inter-SemiBold';
    text-align: center;
    font-size: 3em;
    color: white;
    user-select: none;
    word-break: normal;
}

.Spacer {
    height: 1em;
}
</style>

