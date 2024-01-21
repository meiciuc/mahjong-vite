<script setup lang="ts">
// import { useModel } from '../../model/useModel';
import BoosterHelp from './BoosterHelp.vue';
import BoosterTime from './BoosterTime.vue';


</script>

<template>
    <div class="MenuPanel">
        <BoosterHelp></BoosterHelp>
        <BoosterTime></BoosterTime>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.MenuPanel {
    display: flex;
    flex-direction: column;
}
</style>
