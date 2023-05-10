<template>
  <section class="row-wrap" ref="rows">
    <slot></slot>
  </section>
</template>

<script setup>
import { computed, defineProps, nextTick, onMounted, onUnmounted, provide, reactive, ref } from 'vue'

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

// 子组件
const rowsChildren = reactive([])

// 计算容器尺寸
const computedRowsSize = () => {
  const { width, height } = rows.value.getBoundingClientRect()
  const {
    'padding-left': paddingLeft,
    'padding-right': paddingRight,
    'border-left-width': borderLeft,
    'border-right-width': borderRight,
    'padding-top': paddingTop,
    'padding-bottom': paddingBottom,
    'border-top-width': borderTop,
    'border-bottom-width': borderBottom
  } = window.getComputedStyle(rows.value)

  innerWidth.value = width - parseInt(paddingLeft) - parseInt(paddingRight) - parseInt(borderLeft) - parseInt(borderRight)
  innerHeight.value = height - parseInt(paddingTop) - parseInt(paddingBottom) - parseInt(borderTop) - parseInt(borderBottom)
}

// 监听容器resize
const rowsObserver = new ResizeObserver(() => {
  window.requestAnimationFrame(computedRowsSize)
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

// resize拖放结束后计算宽高
const setSizeHandler = (target, gridColumn, gridRow) => {
  const col = rowsChildren.find(item => item.el === target)
  if (col) {
    col.gridColumn = gridColumn
    col.gridRow = gridRow
  }
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
      setSizeHandler(target, gridColumn, gridRow)
    })
  })
})

let sizeChangeTimer
// 监听子节点属性变动
const childrenAttrObserver = new MutationObserver(mutationList => {
  clearTimeout(sizeChangeTimer)
  sizeChangeTimer = setTimeout(() => {
    mutationList.forEach(({ target }) => {
      target.style.width = ''
      target.style.height = ''
    })
  }, 300)
})

// 注册子组件
const registerChild = (col, index) => {
  rowsChildren[index] = col
  childrenObserver.observe(col.el, { box: 'border-box' })
  childrenAttrObserver.observe(col.el, { attributeFilter: ['style'] })
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
  nextTick(() => {
    computedRowsSize()
    rowsObserver.observe(rows.value)
  })
})

onUnmounted(() => {
  childrenObserver.disconnect()
  childrenAttrObserver.disconnect()
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
