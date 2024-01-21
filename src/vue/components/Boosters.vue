<script setup lang="ts">
// import { useModel } from '../../model/useModel';
import BoosterHelp from './BoosterHelp.vue';
import BoosterTime from './BoosterTime.vue';


</script>

<template>
    <div class="MenuPanel">
        <BoosterTime></BoosterTime>
        <BoosterHelp></BoosterHelp>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.MenuPanel {
    display: flex;
    flex-direction: column;
}
</style>
