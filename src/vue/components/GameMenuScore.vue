<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useModel } from '../../model/useModel';
import { Easing, Tween } from '@tweenjs/tween.js';
import { TimeSkipper } from '../../utils/TimeSkipper';

const Score = ref(null);
const getScoreTextBounds = () => {
    return Score.value ?(Score._rawValue as HTMLHtmlElement).getBoundingClientRect().width : 1;
}

let tween: Tween<unknown>;
const points = useModel(["points"]);
watch(
    points,
    (cur: number, prev: number) => {
        const textLength = `${points.value}`.length;
        if (pointsTextLength.value != textLength) {
            pointsTextLength.value = textLength;
            styleWidth.value = getScoreTextBounds();
        }
        if (prev > cur) {
            // TODO animated
            blink();
        }
    }
);
const pointsTextLength = ref(`${points.value}`.length);
const styleWidth = ref(getScoreTextBounds() || 1);

onMounted(() => {
    styleWidth.value = getScoreTextBounds() || 1;
    pointsTextLength.value = `${styleWidth.value}`.length;
})

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
        .to({ opacity: 0.5 }, time)
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

const pointsFormated = computed(() => {
    const count = points.value;
    if (count > 1000000000) { return `${Math.floor(count / 1000000000)}MM`; }
    if (count > 1000000) { return `${Math.floor(count / 1000000)}M`; }
    return count;
})



</script>

<template>
    <div class="GameMenuScore" :style="`width: ${styleWidth}px;`">
        <span ref="Score">
            {{ `${pointsFormated}` }}
        </span>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.GameMenuScore {
    font-size: 1rem;
    font-family: $label_font_family;
    color: $menu_label_text_color;
    user-select: none;
    text-align: left;
}
</style>
