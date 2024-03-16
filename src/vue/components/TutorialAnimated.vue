<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
    size: String,
    marginLeft: String,
}>();

const show = ref(false);

onMounted(() => {
    show.value = true;
})

</script>
<template>
    <div class="Tutorial">
        <img v-if="show" :src="'assets/tutorial/tutorial_short.svg'" type="image/svg+xml" :style="`width: ${props.size}; margin-left: ${props.marginLeft};`"/>
    </div>
</template>

<style lang="scss">
@import '../global.scss';

.Tutorial {
    position: relative;
}

.Tutorial img {
    position: absolute;
    left: 0px;
    top: 0px;
}
</style>