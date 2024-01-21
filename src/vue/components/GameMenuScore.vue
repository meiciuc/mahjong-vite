<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useModel } from '../../model/useModel';
import { Easing, Tween } from '@tweenjs/tween.js';
import { TimeSkipper } from '../../utils/TimeSkipper';

let tween: Tween<unknown>;
const gameScore = useModel(["gameTotalScore"]);
watch(
    gameScore,
    () => {
        blink();
    }
);

const blink = async () => {
    let el = Score._rawValue as HTMLHtmlElement;
    if (!el) {
        return;
    }

    if (tween) {
        tween.stop();
    }

    const time = 100;
    const tweenProvider = { opacity: el.style.opacity };
    tween = new Tween(tweenProvider)
        .to({ opacity: 0 }, time)
        .easing(Easing.Linear.None)
        .onUpdate(() => {
            el.style.opacity = `${tweenProvider.opacity}`;
        })
        .onComplete(() => {
            tween = undefined;
        })
        .start();

    await new TimeSkipper(time + 10).execute();

    el = Score._rawValue as HTMLHtmlElement;
    if (!el) {
        return;
    }
    el.style.opacity = '1';
}

const gameTotalScoreFormated = computed(() => {
    const count = gameScore.value;
    if (count > 1000000000) { return `${Math.floor(count / 1000000000)}MM`; }
    if (count > 1000000) { return `${Math.floor(count / 1000000)}M`; }
    return count;
})

const Score = ref(null);

</script>

<template>
    <div class="GameScoreCommon">
        <span ref="Score">
            {{ `${gameTotalScoreFormated}` }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.GameScoreCommon {
    @include scene-text-block;
    min-width: 6em;
}
</style>
