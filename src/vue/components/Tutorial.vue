<script setup lang="ts">
</script>
<template>
    <div class="Tutorial">
        <div class="Wrapper">
            <!-- <iframe class="IFrame" src="./assets/tutorial/index_HTML5 Canvas.html"></iframe> -->
            <video autoplay muted loop class="Video">
                <source src="../../../assets/tutorial/tutorial.webm" type="video/webm">
            </video>
        </div>
    </div>
</template>

<style lang="scss">
@import '../global.scss';

.Tutorial .Wrapper {
    position: relative;
    width: 28rem;
    height: 28rem;
    overflow: hidden;
    background-color: cadetblue;
}

.Tutorial .Video {
    position: absolute;
    margin-left: -4rem;
    margin-top: -4rem;
    // transform: scale(.5);
    width: 38rem;
    height: 38rem;
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