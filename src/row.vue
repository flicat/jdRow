<template>
  <section class="row-wrap" ref="rows">
    <slot></slot>
  </section>
</template>

<script setup>
import { defineProps, onMounted, onUnmounted, provide, reactive, ref } from 'vue'

const props = defineProps({
  // 单列宽
  rowWidth: Number,
  // 单列高
  rowHeight: Number,
  // 每行列数
  rowSize: {
    type: Number,
    default: 24
  },
  // 行间距
  rowGap: {
    type: Number,
    default: 0
  },
  // 列间距
  columnGap: {
    type: Number,
    default: 0
  }
})

const rows = ref(null)
const rowWidth = ref(0)
const rowHeight = ref(0)

let resizeTimer
// resize拖放结束后计算宽高
const setSizeHandler = (target, gridColumn, gridRow) => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    target.style.width = `${gridColumn * rowWidth.value + (gridColumn - 1) * props.columnGap}px`
    target.style.height = `${gridRow * rowHeight.value + (gridRow - 1) * props.rowGap}px`
  }, 300)
}

// 监听resize
const resizeObserver = new ResizeObserver(entries => {
  window.requestAnimationFrame(() => {
    entries.forEach(({ contentRect, target }) => {
      let gridColumn = Math.ceil(contentRect.width / (rowWidth.value + props.columnGap))
      let gridRow = Math.ceil(contentRect.height / (rowHeight.value + props.rowGap))
      if (gridColumn > props.rowSize) {
        gridColumn = props.rowSize
      }
      target.style.gridColumn = `span ${gridColumn}`
      target.style.gridRow = `span ${gridRow}`
      setSizeHandler(target, gridColumn, gridRow)
    })
  })
})

const rowsChildren = reactive([])
// 注册子组件
const registerChild = (col, index) => {
  rowsChildren[index] = col
  resizeObserver.observe(col, { box: 'border-box' })
}
// 子组件获取排序
const getOrder = col => {
  return rowsChildren.indexOf(col)
}

let dragNode
let dropNode
// 子组件设置排序
const setOrder = () => {
  const from = rowsChildren.indexOf(dragNode)
  const to = rowsChildren.indexOf(dropNode)
  if (from > -1 && to > -1) {
    const col = rowsChildren.splice(from, 1)[0]
    rowsChildren.splice(to, 0, col)
  }
}
const setDragNode = col => {
  dragNode = col
}
const setDropNode = col => {
  dropNode = col
}

provide('register', registerChild)
provide('getOrder', getOrder)
provide('setOrder', setOrder)
provide('setDragNode', setDragNode)
provide('setDropNode', setDropNode)

onMounted(() => {
  // 如果没有传入单个网格宽高则自动计算
  const { width, height } = rows.value.getBoundingClientRect()
  if (typeof props.rowWidth === 'number') {
    rowWidth.value = props.rowWidth
  } else {
    rowWidth.value = (width - (props.rowSize - 1) * props.columnGap) / props.rowSize
  }
  if (typeof props.rowHeight === 'number') {
    rowHeight.value = props.rowHeight
  } else {
    rowHeight.value = height
  }
})

onUnmounted(() => {
  resizeObserver.disconnect()
})
</script>

<style lang="less" scoped>
.row-wrap {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(v-bind(rowSize), calc(v-bind(rowWidth) * 1px));
  grid-auto-rows: calc(v-bind(rowHeight) * 1px);
  column-gap: calc(v-bind(columnGap) * 1px);
  row-gap: calc(v-bind(rowGap) * 1px);
  overflow: hidden;
}
</style>
