<script setup lang="ts">
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { computed, ref, onMounted } from 'vue';
import { GameModelHelper } from '../../model/GameModelHelper';
import { adsService } from '../../services/AdsService';
import { UserActionAfterTheLastGame } from '../../model/GameModel';
import { TimeSkipper } from '../../utils/TimeSkipper';
import ShopModule from '../components/ShopModule.vue';

const showButtons = ref(false);
const Popup = ref(null);

const showFullscrinAds = async () => {
    adsService.showFullscreen();
};

onMounted(async () => {
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
    vueService.signalDataBus.dispatch(VueServiceSignals.GameEndButton);
}
</script>

<template>
    <div class="Container">
        <div ref="Popup" class="Popup" :style="{ marginLeft: marginLeft, marginTop: marginTop }">
            <div class="Text">{{ Localization.getText('defeated.defeated') }}</div>
            <div class="Spacer"></div>
            <button :class="[showButtons ? '' : 'Opacity']" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.RETRY)">{{
                    Localization.getText('defeated.again') }}</button>
            <div class="Spacer"></div>
            <button :class="[showButtons ? '' : 'Opacity']" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.RESET)">{{
                    Localization.getText('defeated.reset') }}</button>
            <div class="Spacer"></div>
            <button v-if="GameModelHelper.getGameLevel() > 1" :class="[showButtons ? '' : 'Opacity']" class="StartButton"
                @click="handleClick(UserActionAfterTheLastGame.PREVIOUS)">{{
                    Localization.getText('defeated.previous') }}</button>
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
    font-size: 3em;
    color: white;
    user-select: none;
}

.Opacity {
    opacity: 0;
}

.Spacer {
    height: 1em;
}
</style>

