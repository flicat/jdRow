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
    }
  },
  setup(__props) {
    const props = __props;
    useCssVars((_ctx) => ({
      "6e7c6f84": __props.rowSize,
      "61498ea3": unref(rowWidth),
      "a3cd682c": unref(rowHeight),
      "056edbe9": __props.columnGap,
      "ae8cfa1a": __props.rowGap
    }));
    const rows2 = ref(null);
    const innerWidth = ref(0);
    const innerHeight = ref(0);
    const rowsChildren = reactive([]);
    const computedRowsSize = () => {
      const { width, height } = rows2.value.getBoundingClientRect();
      const {
        "padding-left": paddingLeft,
        "padding-right": paddingRight,
        "border-left-width": borderLeft,
        "border-right-width": borderRight,
        "padding-top": paddingTop,
        "padding-bottom": paddingBottom,
        "border-top-width": borderTop,
        "border-bottom-width": borderBottom
      } = window.getComputedStyle(rows2.value);
      innerWidth.value = width - parseInt(paddingLeft) - parseInt(paddingRight) - parseInt(borderLeft) - parseInt(borderRight);
      innerHeight.value = height - parseInt(paddingTop) - parseInt(paddingBottom) - parseInt(borderTop) - parseInt(borderBottom);
    };
    const rowsObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(computedRowsSize);
    });
    const rowWidth = computed(() => {
      if (typeof props.rowWidth === "number") {
        return props.rowWidth;
      } else {
        return (innerWidth.value - (props.rowSize - 1) * props.columnGap) / props.rowSize;
      }
    });
    const rowHeight = computed(() => {
      if (typeof props.rowHeight === "number") {
        return props.rowHeight;
      } else {
        return innerHeight.value;
      }
    });
    const setSizeHandler = (target, gridColumn, gridRow) => {
      const col = rowsChildren.find((item) => item.el === target);
      if (col) {
        col.gridColumn = gridColumn;
        col.gridRow = gridRow;
      }
    };
    const childrenObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        entries.forEach(({ contentRect, target }) => {
          let gridColumn = Math.ceil(contentRect.width / (rowWidth.value + props.columnGap));
          let gridRow = Math.ceil(contentRect.height / (rowHeight.value + props.rowGap));
          if (gridColumn > props.rowSize) {
            gridColumn = props.rowSize;
          }
          setSizeHandler(target, gridColumn, gridRow);
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
      childrenObserver.observe(col.el, { box: "border-box" });
      childrenAttrObserver.observe(col.el, { attributeFilter: ["style"] });
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
        rowsObserver.observe(rows2.value);
      });
    });
    onUnmounted(() => {
      childrenObserver.disconnect();
      childrenAttrObserver.disconnect();
      rowsObserver.disconnect();
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("section", {
        class: "row-wrap",
        ref_key: "rows",
        ref: rows2
      }, [
        renderSlot(_ctx.$slots, "default", {}, void 0, true)
      ], 512);
    };
  }
};
var rows = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-a0efb388"]]);
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
      "27193f55": unref(styleGridColumn),
      "29d8338a": unref(styleGridRow),
      "ae1072fa": unref(itemOrder)
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
      gridRow: props.rowSpan
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
var colItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7913f22d"]]);
function index(App) {
  App.component("jdRow", rows);
  App.component("jdCol", colItem);
}
export { index as default };
