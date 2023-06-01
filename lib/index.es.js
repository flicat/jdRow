import './index.css';
import { useCssVars, unref, ref, reactive, computed, provide, onMounted, nextTick, onUnmounted, openBlock, createElementBlock, renderSlot, inject, normalizeClass } from "vue";
var row_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$1 = {
  __name: "row",
  props: {
    rowWidth: Number,
    rowHeight: Number,
    rowSize: {
      type: Number,
      default: 24
    },
    rowGap: {
      type: Number,
      default: 0
    },
    columnGap: {
      type: Number,
      default: 0
    },
    columns: Array,
    rows: Array
  },
  setup(__props) {
    const props = __props;
    useCssVars((_ctx) => ({
      "6e9ba6ca": unref(styleTemplateColumns),
      "5df8a20c": unref(styleTemplateRows),
      "506feec4": __props.rowWidth,
      "b882202e": __props.rowHeight,
      "09d70030": __props.columnGap,
      "448b7754": __props.rowGap
    }));
    const refRows = ref(null);
    const columnsList = reactive([]);
    const rowsList = reactive([]);
    const rowsWidth = ref(0);
    const rowsHeight = ref(0);
    const rowsLeft = ref(0);
    const rowsTop = ref(0);
    const styleTemplateColumns = computed(() => {
      let columns = Array.from({ length: props.rowSize });
      if (typeof props.rowWidth === "number") {
        columns.fill(props.rowWidth + "px");
      } else {
        columns.fill("1fr");
      }
      if (Array.isArray(props.columns)) {
        Object.assign(columns, props.columns);
      }
      return columns.join(" ");
    });
    const styleTemplateRows = computed(() => {
      if (Array.isArray(props.rows)) {
        return props.rows.join(" ");
      } else {
        return "";
      }
    });
    const rowsChildren = reactive([]);
    const computedRowsSize = () => {
      const { width, height, left, top } = refRows.value.getBoundingClientRect();
      const {
        "padding-left": paddingLeft,
        "padding-right": paddingRight,
        "border-left-width": borderLeft,
        "border-right-width": borderRight,
        "padding-top": paddingTop,
        "padding-bottom": paddingBottom,
        "border-top-width": borderTop,
        "border-bottom-width": borderBottom,
        "grid-template-columns": templateColumns,
        "grid-template-rows": templateRows
      } = window.getComputedStyle(refRows.value);
      rowsWidth.value = width - parseInt(paddingLeft) - parseInt(paddingRight) - parseInt(borderLeft) - parseInt(borderRight);
      rowsHeight.value = height - parseInt(paddingTop) - parseInt(paddingBottom) - parseInt(borderTop) - parseInt(borderBottom);
      rowsLeft.value = left + parseInt(paddingLeft) + parseInt(borderLeft);
      rowsTop.value = top + parseInt(paddingTop) + parseInt(borderTop);
      Object.assign(columnsList, templateColumns.split(" ").map((i) => parseFloat(i)));
      Object.assign(rowsList, templateRows.split(" ").map((i) => parseFloat(i)));
    };
    const rowsObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(computedRowsSize);
    });
    const setSizeHandler = (target, gridColumn, gridRow) => {
      const col = rowsChildren.find((item) => item.el === target);
      if (col) {
        col.gridColumn = gridColumn;
        col.gridRow = gridRow;
      }
    };
    const childrenResizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        entries.forEach(({ target }) => {
          let { left, top, right, bottom } = target.getBoundingClientRect();
          let calcLeft = left - rowsLeft.value;
          let calcTop = top - rowsTop.value;
          let calcRight = right - rowsLeft.value;
          let calcBottom = bottom - rowsTop.value;
          let leftSpan = 0;
          let rightSpan = 0;
          let topSpan = 0;
          let bottomSpan = 0;
          columnsList.reduce((prev, next) => {
            calcLeft -= prev;
            calcRight -= prev;
            leftSpan += Math.round(calcLeft / next) <= 0;
            rightSpan += Math.ceil(calcRight / next) <= 0;
            calcLeft -= props.columnGap;
            calcRight -= props.columnGap;
            return next;
          }, 0);
          rowsList.reduce((prev, next) => {
            calcTop -= prev;
            calcBottom -= prev;
            topSpan += Math.round(calcTop / next) <= 0;
            bottomSpan += Math.ceil(calcBottom / next) <= 0;
            calcTop -= props.rowGap;
            calcBottom -= props.rowGap;
            return next;
          }, 0);
          setSizeHandler(target, leftSpan - rightSpan, topSpan - bottomSpan);
        });
      });
    });
    let sizeChangeTimer;
    const childrenAttrObserver = new MutationObserver((mutationList) => {
      clearTimeout(sizeChangeTimer);
      sizeChangeTimer = setTimeout(() => {
        mutationList.forEach(({ target }) => {
          target.style.width = "";
          target.style.height = "";
        });
      }, 300);
    });
    const registerChild = (col, index2) => {
      rowsChildren[index2] = col;
      if (col.resize) {
        childrenResizeObserver.observe(col.el, { box: "border-box" });
        childrenAttrObserver.observe(col.el, { attributeFilter: ["style"] });
      }
    };
    const getOrder = (col) => {
      return rowsChildren.indexOf(col);
    };
    let dragNode;
    let dropNode;
    const setOrder = () => {
      const from = rowsChildren.indexOf(dragNode);
      const to = rowsChildren.indexOf(dropNode);
      if (from > -1 && to > -1) {
        const col = rowsChildren.splice(from, 1)[0];
        rowsChildren.splice(to, 0, col);
      }
    };
    const setDragNode = (col) => {
      dragNode = col;
    };
    const setDropNode = (col) => {
      dropNode = col;
    };
    provide("register", registerChild);
    provide("getOrder", getOrder);
    provide("setOrder", setOrder);
    provide("setDragNode", setDragNode);
    provide("setDropNode", setDropNode);
    onMounted(() => {
      nextTick(() => {
        computedRowsSize();
        rowsObserver.observe(refRows.value);
      });
    });
    onUnmounted(() => {
      childrenResizeObserver.disconnect();
      childrenAttrObserver.disconnect();
      rowsObserver.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        class: "row-wrap",
        ref_key: "refRows",
        ref: refRows
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 512);
    };
  }
};
var rows = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-77177a0b"]]);
var col_vue_vue_type_style_index_0_scoped_true_lang = "";
const _hoisted_1 = ["draggable"];
const _sfc_main = {
  __name: "col",
  props: {
    rowSpan: {
      type: Number,
      default: 1
    },
    columnSpan: {
      type: Number,
      default: 1
    },
    drag: Boolean,
    resize: Boolean
  },
  setup(__props) {
    const props = __props;
    useCssVars((_ctx) => ({
      "592ccc26": unref(styleGridColumn),
      "0e72f30a": unref(styleGridRow),
      "20a58414": unref(itemOrder)
    }));
    const colItem2 = ref(null);
    const registerHandler = inject("register", () => {
    });
    const getOrder = inject("getOrder", () => {
    });
    const setOrder = inject("setOrder", () => {
    });
    const setDragNode = inject("setDragNode", () => {
    });
    const setDropNode = inject("setDropNode", () => {
    });
    const isOnDrag = ref(false);
    const target = reactive({
      el: null,
      gridColumn: props.columnSpan,
      gridRow: props.rowSpan,
      drag: props.drag,
      resize: props.resize
    });
    const itemOrder = computed(() => getOrder(target));
    const styleGridColumn = computed(() => `span ${target.gridColumn}`);
    const styleGridRow = computed(() => `span ${target.gridRow}`);
    onMounted(() => {
      const index2 = Array.from(colItem2.value.parentNode.children).indexOf(colItem2.value);
      target.el = colItem2.value;
      registerHandler(target, index2);
      colItem2.value.addEventListener("dragstart", () => {
        if (!props.drag) {
          return false;
        }
        setDragNode(target);
        isOnDrag.value = true;
      });
      colItem2.value.addEventListener("dragend", () => {
        if (!props.drag) {
          return false;
        }
        isOnDrag.value = false;
      });
      colItem2.value.addEventListener("dragover", () => {
        if (!props.drag) {
          return false;
        }
        setOrder();
      });
      colItem2.value.addEventListener("dragenter", () => {
        if (!props.drag) {
          return false;
        }
        setDropNode(target);
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: normalizeClass(["col-item", { "on-drag": isOnDrag.value, "can-edit": __props.resize, "can-drag": __props.drag }]),
        draggable: __props.drag,
        ref_key: "colItem",
        ref: colItem2
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 10, _hoisted_1);
    };
  }
};
var colItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-68feafe0"]]);
function index(App) {
  App.component("jdRow", rows);
  App.component("jdCol", colItem);
}
export { index as default };
