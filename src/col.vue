<template>
  <div class="col-item" :class="{'on-drag': isOnDrag, 'can-edit': resize, 'can-drag': drag}" :draggable="drag" ref="colItem">
    <slot></slot>
  </div>
</template>

<script setup>
import {defineEmits, defineProps, computed, inject, onMounted, ref, reactive, watch} from 'vue'

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
const emit = defineEmits(['change'])

const colItem = ref(null)

const registerHandler = inject('register', () => {})
const getOrder = inject('getOrder', () => {})
const setOrder = inject('setOrder', () => {})
const setDragNode = inject('setDragNode', () => {})
const setDropNode = inject('setDropNode', () => {})
const setResizeNode = inject('setResizeNode', () => {})

const isOnDrag = ref(false) // 是否在拖动

// 传递给父组件的对象
const target = reactive({
  el: null,
  gridColumn: props.columnSpan,
  gridRow: props.rowSpan,
  drag: props.drag,
  resize: props.resize
})

const itemOrder = computed(() => getOrder(target)) // 排序

const styleGridColumn = computed(() => `span ${target.gridColumn}`) // 跨列
const styleGridRow = computed(() => `span ${target.gridRow}`) // 跨行

onMounted(() => {
  // 获取当前顺序
  const index = Array.from(colItem.value.parentNode.children).indexOf(colItem.value)
  target.el = colItem.value
  registerHandler(target, index)

  // 拖放事件
  colItem.value.addEventListener('dragstart', () => {
    if (!props.drag) {
      return false
    }
    setDragNode(target)
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
    setDropNode(target)
  })
  colItem.value.addEventListener('mousedown', () => {
    if (!props.resize) {
      return false
    }
    setResizeNode(target)
  })

  // 提交排序和尺寸
  watch(itemOrder, val => {
    emit('change', {
      order: val,
      column: styleGridColumn.value,
      row: styleGridRow.value
    })
  })

  watch(styleGridColumn, val => {
    emit('change', {
      order: itemOrder.value,
      column: val,
      row: styleGridRow.value
    })
  })

  watch(styleGridRow, val => {
    emit('change', {
      order: itemOrder.value,
      column: styleGridColumn.value,
      row: val
    })
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
  grid-column: v-bind(styleGridColumn);
  grid-row: v-bind(styleGridRow);
  order: v-bind(itemOrder);
  resize: none !important;
  position: relative;
  &.on-drag {
    opacity: 0.2;
  }
  &.can-edit {
    resize: both !important;
  }
  &.can-drag {
    cursor: move;
  }
}
</style>
