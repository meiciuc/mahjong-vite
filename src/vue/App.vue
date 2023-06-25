<script setup lang="ts">
// import HelloWorld from './components/HelloWorld.vue'
  import HelpButton from './HelpButton.vue';
</script>

<template>
  <HelpButton ref="HelpButton" class="HelpButton"></HelpButton>
</template>

<style lang="scss" scoped>
  .HelpButton {
    position: absolute;
    left: 10px;
    top: 10px;
  }

</style>
