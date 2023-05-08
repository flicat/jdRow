<template>
  <div class="col-item" :class="{'on-drag' : isOnDrag, 'can-edit': resize, 'can-drag': drag}" :draggable="drag" ref="colItem">
    <slot></slot>
  </div>
</template>

<script setup>
import { defineProps, computed, inject, onMounted, ref } from 'vue'

const props = defineProps({
  // 跨行
  rowSpan: {
    type: Number,
    default: 1
  },
  // 跨列
  columnSpan: {
    type: Number,
    default: 1
  },
  // 是否可拖放
  drag: Boolean,
  // 是否可改变尺寸
  resize: Boolean
})

const colItem = ref(null)

const registerHandler = inject('register', () => { })
const getOrder = inject('getOrder', () => { })
const setOrder = inject('setOrder', () => { })
const setDragNode = inject('setDragNode', () => { })
const setDropNode = inject('setDropNode', () => { })

const itemOrder = computed(() => {
  const order = getOrder(colItem.value)
  return order
})

const isOnDrag = ref(false)

onMounted(() => {
  const index = Array.from(colItem.value.parentNode.children).indexOf(colItem.value)
  registerHandler(colItem.value, index)

  colItem.value.addEventListener('dragstart', () => {
    if (!props.drag) {
      return false
    }
    setDragNode(colItem.value)
    isOnDrag.value = true
  })
  colItem.value.addEventListener('dragend', () => {
    if (!props.drag) {
      return false
    }
    isOnDrag.value = false
  })
  colItem.value.addEventListener('dragover', () => {
    if (!props.drag) {
      return false
    }
    setOrder()
  })
  colItem.value.addEventListener('dragenter', () => {
    if (!props.drag) {
      return false
    }
    setDropNode(colItem.value)
  })
})
</script>

<style lang="less" scoped>
.col-item {
  box-sizing: border-box;
  border: 1px solid #999;
  background-color: #fff;
  overflow: hidden;
  font-size: 28px;
  font-weight: 900;
  color: #666;
  text-align: center;
  grid-column: span v-bind(columnSpan);
  grid-row: span v-bind(rowSpan);
  order: v-bind(itemOrder);
  resize: none !important;
}
.on-drag {
  opacity: 0.2;
}
.can-edit {
  resize: both !important;
}
.can-drag {
  cursor: move;
}
</style>
