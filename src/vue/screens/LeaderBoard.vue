<script setup lang="ts">
import { useModel } from '../../model/useModel';
import { Localization } from '../../utils/Localization';
import { VueServiceSignals, vueService } from '../VueService';
import { ref } from 'vue';


const Popup = ref(null);
const leaderboardItems = useModel(['leaderboardItems']);

</script>

<template>
    <div class="LeaderBoard" @click="vueService.signalDataBus.dispatch(VueServiceSignals.LeaderBoardButton);">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <div class="Label">{{ Localization.getText('leaderboard.board') }}</div>
                <div class="Tabs">
                    <div class="Tab">{{ Localization.getText('leaderboard.yesterday') }}</div>
                    <div class="Tab">{{ Localization.getText('leaderboard.today') }}</div>
                    <div class="Tab">{{ Localization.getText('leaderboard.atAllTimes') }}</div>
                </div>
                <div 
                    v-for="item of leaderboardItems"
                    class="Item" 
                    :key="item.id"
                >
                    <div class="Position">{{item.position}}</div>
                    <div class="Name">{{item.name}}</div>
                    <div class="Level">{{item.level}}</div>
                    <div class="Score">{{item.score}}</div>
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

.LeaderBoard .TutorialButton {
    @include button_screen;
    margin-top: 1rem;
    font-size: 2rem;
}

.LeaderBoard .StartButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.LeaderBoard .TutorialButton:hover {
    text-shadow: 0px 6px 8px rgba(0, 0, 0, 0.5);
}

.LeaderBoard .HalfLabel {
    @include label_base;
    font-size: 2rem;
    font-family: 'Roboto-Light';
    color: $scene_label_text_color;
    margin-top: 0.7rem;
}
</style>
