<script setup lang="ts">
import { VueServiceSignals, vueService } from '../VueService';
import { useModel } from '../../model/useModel';
import { BoosterType } from '../../model/GameModel';
import { computed } from 'vue';

const boosters = useModel(["boosters"]);
const handleClick = () => {
    vueService.signalDataBus.dispatch(VueServiceSignals.BoosterTimeUseBooster);
}

const count = computed(() => {
    return (boosters.value as any)[BoosterType.TIME]?.current || 0;
})

</script>

<template>
    <div class="BoosterContainer">
        <div class="BoosterButton" @click="handleClick"> T </div>
        <div class="Count"><span>{{ count }} </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.BoosterContainer {
    position: relative;
}

.BoosterButton {
    @include button;
    user-select: none;
    min-width: 3em;
    max-width: 3em;
    min-height: 3em;
}

.Count {
    position: absolute;
    top: 0px;
    left: 0px;

    background: #FF7A59;
    margin-left: -10%;
    margin-top: -10%;

    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
}

.BoosterButton:hover {
    @include button_hover;
}
</style>
