<script setup lang="ts">
import { computed } from 'vue';
import { useModel } from '../../model/useModel';

const stateTime = useModel(["gameStateTime"]);
const maxTime = useModel(["gameMaxTime"]);
const minutes = computed(() => { return Math.floor((maxTime.value - stateTime.value) / 60 % 60) });
const secundes = computed(() => { return Math.floor((maxTime.value - stateTime.value) % 60) });
const blinking = computed(() => {
    const startBlinking = 30;
    const steps = [.9, .8, .7, .6, .5, .4, .3, .2];
    if (minutes.value !== 0 || secundes.value > startBlinking) {
        return '';
    }

    let result = 'blink';
    for (let i = 0; i < steps.length; i++) {
        const scale = secundes.value / startBlinking;
        if (scale < steps[i]) {
            result = `blink_${steps[i] * 10}`;
        }
    }

    return result;
})
</script>

<template>
    <div class="Timer">
        <span :class=blinking>
            {{ `${minutes > 9 ? '' : '0'}${minutes}:${secundes > 9 ? '' : '0'}${secundes}` }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Timer {
    background: rgba($color: $button_background_colored, $alpha: 1);
    color: white;
    padding-top: calc($button_padding_vertical / 2);
    padding-bottom: calc($button_padding_vertical / 2);
    width: 6em;
    border-radius: $button_border_radius;
    border-color: $button_background_idle;
    border: solid;
}

.blink {
    animation: blink-animation 1s steps(60, start) infinite;
}

.blink_9 {
    animation: blink-animation .9s steps(55, start) infinite;
}

.blink_8 {
    animation: blink-animation .8s steps(45, start) infinite;
}

.blink_7 {
    animation: blink-animation .7s steps(35, start) infinite;
}

.blink_6 {
    animation: blink-animation .6s steps(40, start) infinite;
}

.blink_5 {
    animation: blink-animation .5s steps(30, start) infinite;
}

.blink_4 {
    animation: blink-animation .4s steps(20, start) infinite;
}

.blink_3 {
    animation: blink-animation .3s steps(15, start) infinite;
}

.blink_2 {
    animation: blink-animation .2s steps(10, start) infinite;
}

@keyframes blink-animation {
    to {
        opacity: 0.3;
    }
}
</style>
