<script setup lang="ts">
</script>
<template>
    <div class="AdditionButtons">
        <button class="Button Shop Svg"></button>
        <button class="Button People Svg"></button>
    </div>
</template>

<style lang="scss">
@import '../global.scss';

.AdditionButtons {
    position: relative;
    display: flex;
}

.AdditionButtons .Button {
    @include button_base;
}

.AdditionButtons .Button.Shop {
    width: 6rem;
    height: 6rem;
    background-image: url(./assets/svg/shoppingСart.svg);
    background-repeat: no-repeat;
    background-size: 60%;
    background-position: 40% 60%;
}

.AdditionButtons .Button.People {
    width: 6rem;
    height: 6rem;
    background-image: url(./assets/svg/addPeople.svg);
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: 40% 60%;
}

.AdditionButtons .Svg {
    filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
}

.AdditionButtons .Svg:hover {
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.5));
}
</style>