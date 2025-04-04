<script setup lang="ts">
import { LeaderboardItem } from '../../model/GameModel';
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';


const Popup = ref(null);
const leaderboardItems = useModel(['leaderboardItems']);
const leaderboardSelected = useModel(['leaderboardSelected']);

</script>

<template>
    <div class="LeaderBoard" @click="vueService.signalDataBus.dispatch(VueServiceSignals.LeaderBoardButton, {});">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('leaderboard.board') }}</div>
                <div class="Tabs">
                    <div class="Tab" :class="{'Selected': leaderboardSelected === 'yesterday'}"
                        @click.stop="vueService.signalDataBus.dispatch(VueServiceSignals.LeaderBoardYesterdayButton, {});"
                    >{{ Localization.getText('leaderboard.yesterday') }}</div>
                    <div class="Tab" :class="{'Selected': leaderboardSelected === 'today'}"
                        @click.stop="vueService.signalDataBus.dispatch(VueServiceSignals.LeaderBoardTodayButton, {});"
                    >{{ Localization.getText('leaderboard.today') }}</div>
                    <div class="Tab" :class="{'Selected': leaderboardSelected === 'always'}"
                        @click.stop="vueService.signalDataBus.dispatch(VueServiceSignals.LeaderBoardAlwaysButton, {});"
                    >{{ Localization.getText('leaderboard.atAllTimes') }}</div>
                </div>
                <div 
                    v-for="item of leaderboardItems"
                    class="Item" 
                    :class="{'Selected': (item as unknown as LeaderboardItem).selected}"
                    :key="(item as unknown as LeaderboardItem).id"
                >
                    <div class="Position">{{(item as unknown as LeaderboardItem).position}}</div>
                    <div class="Name">{{(item as unknown as LeaderboardItem).name}}</div>
                    <div class="Level">{{(item as unknown as LeaderboardItem).level}}</div>
                    <div class="Score">{{(item as unknown as LeaderboardItem).points}}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.LeaderBoard {
    @include scene-container;
}

.LeaderBoard .Tabs {
    display: flex;
    flex-direction: row;
    margin-bottom: 1rem;
}

.LeaderBoard .Tab {
    @include button_screen;
    font-size: 1.5rem;
    margin-left: 1rem;
    margin-right: 1rem;
}

.LeaderBoard .Tab:hover {
    @include button_screen-hover;
}

.LeaderBoard .Tab:active {
    @include button_screen-active;
}

.LeaderBoard .Item {
    @include label_screen;
    margin-top: 0.1rem;
    background-color: rgba(0, 0, 0, 0.1);
    align-items: center;
    margin-left: auto;
    margin-right: auto;
    font-size: 1.5rem;
    display: flex;
    flex-direction: row;
    width: 30rem;
}

.LeaderBoard .Item.Selected{
    background-color: rgb(87, 87, 87);
    color: white;
}

.Item .Position{
    width: 2rem;
}

.Item .Name{
    width: 18rem;
}

.Item .Level{
    width: 2rem;
    align-self: flex-end;
}

.Item .Score{
    font-size: 1rem;
    width: 8rem;
    text-align: left;
}

.LeaderBoard .PopupLevelOne {
    @include popup_level_one;
}

.LeaderBoard .PopupLevelTwo {
    @include popup_level_two;
    height: 70vh;
    justify-content: center;
}

.LeaderBoard .Label {
    @include label_screen;
}

.LeaderBoard .StartButton {
    @include button_screen;
}

.LeaderBoard .StartButton:hover {
    @include button_screen-hover;
}

.LeaderBoard .StartButton:active {
    @include button_screen-active;
}

.LeaderBoard .TutorialButton {
    @include button_screen;
    margin-top: 1rem;
    font-size: 2rem;
}

.LeaderBoard .TutorialButton:hover {
    @include button_screen-hover;
}

.LeaderBoard .TutorialButton:active {
    @include button_screen-active;
}

.Tabs .Selected {
    text-decoration: underline;
}

.LeaderBoard .HalfLabel {
    @include label_base;
    font-size: 2rem;
    font-family: 'Roboto-Light';
    color: $scene_label_text_color;
    margin-top: 0.7rem;
}
</style>
