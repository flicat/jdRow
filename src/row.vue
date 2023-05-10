<template>
  <section class="row-wrap" ref="rows">
    <slot></slot>
  </section>
</template>

<script setup>
import { computed, defineProps, onMounted, onUnmounted, provide, reactive, ref } from 'vue'

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

const rows = ref(null)      // 容器
const innerWidth = ref(0)   // 容器宽度
const innerHeight = ref(0)   // 容器高度

// 计算容器高度
const computedRowsSize = ({ width, height }, target) => {
  const {
    'padding-left': paddingLeft,
    'padding-right': paddingRight,
    'border-left-width': borderLeft,
    'border-right-width': borderRight,
    'padding-top': paddingTop,
    'padding-bottom': paddingBottom,
    'border-top-width': borderTop,
    'border-bottom-width': borderBottom
  } = window.getComputedStyle(target)
  innerWidth.value = width - parseInt(paddingLeft) - parseInt(paddingRight) - parseInt(borderLeft) - parseInt(borderRight)
  innerHeight.value = height - parseInt(paddingTop) - parseInt(paddingBottom) - parseInt(borderTop) - parseInt(borderBottom)
}

// 监听容器resize
const rowsObserver = new ResizeObserver(entries => {
  window.requestAnimationFrame(() => {
    entries.forEach(({ contentRect, target }) => {
      computedRowsSize(contentRect, target)
    })
  })
})

// 单列宽
const rowWidth = computed(() => {
  if (typeof props.rowWidth === 'number') {
    return props.rowWidth
  } else {
    return (innerWidth.value - (props.rowSize - 1) * props.columnGap) / props.rowSize
  }
})

// 单列高
const rowHeight = computed(() => {
  if (typeof props.rowHeight === 'number') {
    return props.rowHeight
  } else {
    return innerHeight.value
  }
})

let resizeTimer
// resize拖放结束后计算宽高
const setSizeHandler = (target, gridColumn, gridRow) => {
  clearTimeout(resizeTimer)
  resizeTimer = setTimeout(() => {
    target.style.width = `${gridColumn * rowWidth.value + (gridColumn - 1) * props.columnGap}px`
    target.style.height = `${gridRow * rowHeight.value + (gridRow - 1) * props.rowGap}px`
  }, 300)
}

// 监听子节点resize
const childrenObserver = new ResizeObserver(entries => {
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
  childrenObserver.observe(col, { box: 'border-box' })
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
  rowsObserver.observe(rows.value)
  computedRowsSize(rows.value.getBoundingClientRect(), rows.value)
})

onUnmounted(() => {
  childrenObserver.disconnect()
  rowsObserver.disconnect()
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
