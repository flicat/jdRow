<template>
  <p>
    <button @click="canResize = !canResize">{{canResize ? 'disable' : 'enable'}} resize</button>&emsp;
    <button @click="canDrag = !canDrag">{{canDrag ? 'disable' : 'enable'}} drag</button>
  </p>
  <jd-row class="home-wrap" :rowSize="9" :columns="['100px', '200px', '300px', '400px',]" :rows="['80px', '40px','80px', '40px']" :rowHeight="50" :rowGap="8" :columnGap="16">
    <jd-col :rowSpan="5" :columnSpan="5" :drag="canDrag" :resize="canResize">1</jd-col>
    <jd-col :rowSpan="5" :columnSpan="4" :drag="canDrag" :resize="canResize">2</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" :drag="canDrag" :resize="canResize">3</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" :drag="canDrag" :resize="canResize">4</jd-col>
    <jd-col :rowSpan="6" :columnSpan="3" :drag="canDrag" :resize="canResize">5</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" :drag="canDrag" :resize="canResize">6</jd-col>
    <jd-col :rowSpan="3" :columnSpan="3" :drag="canDrag" :resize="canResize">7</jd-col>
  </jd-row>
</template>

<script setup>
import { ref } from "@vue/reactivity";

const canResize = ref(true)
const canDrag = ref(true)
</script>

<style lang="less" scoped>
.home-wrap {
  width: 100%;
  background-color: #fff;
  padding: 16px;
  box-sizing: border-box;
  border: 10px solid #ccc;
}
</style>

<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  box-sizing: border-box;
}
#app {
  padding: 16px;
  overflow: auto;
}
</style>
