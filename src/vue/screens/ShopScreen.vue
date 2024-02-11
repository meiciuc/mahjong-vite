<script setup lang="ts">
enum types {
    time = 'time',
    question = 'question',
}

enum actions {
    buy = 'buy',
    watch = 'watch',
}

const items: { type: types, value: number, action: actions }[] = [
    { type: types.time, value: +1, action: actions.buy },
    { type: types.time, value: +3, action: actions.watch },
    { type: types.question, value: +1, action: actions.buy },
    { type: types.question, value: +3, action: actions.watch },
];
</script>

<template>
    <div class="ShopScreen">
        <div class="PopupLevelOne">
            <div ref="Popup" class="PopupLevelTwo">
                <ul id="example-1">
                    <li v-for="item in items" :key="`${item.type}${item.value}${item.action}`">
                        {{ item.value }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
