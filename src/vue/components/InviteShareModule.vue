<script setup lang="ts">
import Share from '../components/Share.vue';
import Invite from '../components/Invite.vue';
import { adsService } from '../../services/AdsService';

</script>

<template>
    <div class="Panel">
        <Share v-if="adsService.isShareAvaliable" class="Share"></Share>
        <Invite v-if="adsService.isShareAvaliable" class="Invite"></Invite>
    </div>
</template>

<style lang="scss" scoped>
@import '../global.scss';

.Panel {
    display: flex;
    transform: scale(0.5);
}

.Share {
    margin: 0.2em 1em;
}

.Invite {
    margin: 0.2em 1em;
}
</style>
