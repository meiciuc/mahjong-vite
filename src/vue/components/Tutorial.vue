<script setup lang="ts">
</script>
<template>
    <div class="Tutorial">
        <div class="Wrapper">
            <iframe class="IFrame" src="./assets/tutorial/index_HTML5 Canvas.html"></iframe>
        </div>
    </div>
</template>

<style lang="scss">
@import '../global.scss';

.Tutorial .Wrapper {
    width: 384px;
    height: 384px;
    padding: 0px;
    overflow: hidden;
}

.Tutorial .IFrame {
    transform: scale(.5);
    margin-left: -180px;
    margin-top: -150px;
    width: 768px;
    height: 768px;
    border: 0px;
    overflow: hidden;
}
</style>