<template>
  <section class="row-wrap" ref="refRows">
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
  },
  // 预定义的列宽
  columns: Array,
  // 预定义的行高
  rows: Array
})

const refRows = ref(null)          // 容器
const columnsList = reactive([])   // 容器所有列宽数组
const rowsList = reactive([])      // 容器所有行高数组

const rowsWidth = ref(0)           // 容器宽度
const rowsHeight = ref(0)          // 容器高度
const rowsLeft = ref(0)            // 容器left
const rowsTop = ref(0)             // 容器top

// 计算样式
const styleTemplateColumns = computed(() => {
  let columns = Array.from({ length: props.rowSize })
  if (typeof props.rowWidth === 'number') {
    columns.fill(props.rowWidth + 'px')
  } else {
    columns.fill('1fr')
  }
  if (Array.isArray(props.columns)) {
    Object.assign(columns, props.columns)
  }
  return columns.join(' ')
})
const styleTemplateRows = computed(() => {
  if (Array.isArray(props.rows)) {
    return props.rows.join(' ')
  } else {
    return ''
  }
})

// 子组件
const rowsChildren = reactive([])

// 计算容器尺寸
const computedRowsSize = () => {
  const { width, height, left, top } = refRows.value.getBoundingClientRect()
  const {
    'padding-left': paddingLeft,
    'padding-right': paddingRight,
    'border-left-width': borderLeft,
    'border-right-width': borderRight,
    'padding-top': paddingTop,
    'padding-bottom': paddingBottom,
    'border-top-width': borderTop,
    'border-bottom-width': borderBottom,
    'grid-template-columns': templateColumns,
    'grid-template-rows': templateRows
  } = window.getComputedStyle(refRows.value)

  rowsWidth.value = width - parseInt(paddingLeft) - parseInt(paddingRight) - parseInt(borderLeft) - parseInt(borderRight)
  rowsHeight.value = height - parseInt(paddingTop) - parseInt(paddingBottom) - parseInt(borderTop) - parseInt(borderBottom)
  rowsLeft.value = left + parseInt(paddingLeft) + parseInt(borderLeft)
  rowsTop.value = top + parseInt(paddingTop) + parseInt(borderTop)

  Object.assign(columnsList, templateColumns.split(' ').map(i => parseFloat(i)))
  Object.assign(rowsList, templateRows.split(' ').map(i => parseFloat(i)))
}

// 监听容器resize
const rowsObserver = new ResizeObserver(() => {
  window.requestAnimationFrame(computedRowsSize)
})

// resize拖放结束后设置span
const setSizeHandler = (target, gridColumn, gridRow) => {
  const col = rowsChildren.find(item => item.el === target)
  if (col) {
    col.gridColumn = gridColumn
    col.gridRow = gridRow
  }
}

// 监听子节点resize
const childrenResizeObserver = new ResizeObserver(entries => {
  window.requestAnimationFrame(() => {
    entries.forEach(({ target }) => {
      let { left, top, right, bottom } = target.getBoundingClientRect()
      let calcLeft = left - rowsLeft.value
      let calcTop = top - rowsTop.value
      let calcRight = right - rowsLeft.value
      let calcBottom = bottom - rowsTop.value

      let leftSpan = 0
      let rightSpan = 0
      let topSpan = 0
      let bottomSpan = 0

      // 计算子节点所跨列
      columnsList.reduce((prev, next) => {
        calcLeft -= prev
        calcRight -= prev

        leftSpan += Math.round(calcLeft / next) <= 0
        rightSpan += Math.ceil(calcRight / next) <= 0

        calcLeft -= props.columnGap
        calcRight -= props.columnGap

        return next
      }, 0)

      // 计算子节点所跨行
      rowsList.reduce((prev, next) => {
        calcTop -= prev
        calcBottom -= prev

        topSpan += Math.round(calcTop / next) <= 0
        bottomSpan += Math.ceil(calcBottom / next) <= 0

        calcTop -= props.rowGap
        calcBottom -= props.rowGap

        return next
      }, 0)

      setSizeHandler(target, leftSpan - rightSpan, topSpan - bottomSpan)
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
  if (col.resize) {
    childrenResizeObserver.observe(col.el, { box: 'border-box' })
    childrenAttrObserver.observe(col.el, { attributeFilter: ['style'] })
  }
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
    rowsObserver.observe(refRows.value)
  })
})

onUnmounted(() => {
  childrenResizeObserver.disconnect()
  childrenAttrObserver.disconnect()
  rowsObserver.disconnect()
})
</script>

<style lang="less" scoped>
.row-wrap {
  display: grid;
  width: 100%;
  grid-template-columns: v-bind(styleTemplateColumns);
  grid-template-rows: v-bind(styleTemplateRows);
  grid-auto-columns: calc(v-bind(rowWidth) * 1px);
  grid-auto-rows: calc(v-bind(rowHeight) * 1px);
  column-gap: calc(v-bind(columnGap) * 1px);
  row-gap: calc(v-bind(rowGap) * 1px);
  overflow: hidden;
  position: relative;
}
</style>
