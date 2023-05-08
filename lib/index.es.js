import './index.css';
import { useCssVars, ref, reactive, provide, onMounted, onUnmounted, openBlock, createElementBlock, renderSlot, unref, inject, computed, normalizeClass } from "vue";
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
      "bb9dd6f0": __props.rowSize,
      "b7acebc2": rowWidth.value,
      "718e8024": rowHeight.value,
      "1e8e4fed": __props.columnGap,
      "fdcba522": __props.rowGap
    }));
    const rows2 = ref(null);
    const rowWidth = ref(0);
    const rowHeight = ref(0);
    let resizeTimer;
    const setSizeHandler = (target, gridColumn, gridRow) => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        target.style.width = `${gridColumn * rowWidth.value + (gridColumn - 1) * props.columnGap}px`;
        target.style.height = `${gridRow * rowHeight.value + (gridRow - 1) * props.rowGap}px`;
      }, 300);
    };
    const resizeObserver = new ResizeObserver((entries) => {
      window.requestAnimationFrame(() => {
        entries.forEach(({ contentRect, target }) => {
          let gridColumn = Math.ceil(contentRect.width / (rowWidth.value + props.columnGap));
          let gridRow = Math.ceil(contentRect.height / (rowHeight.value + props.rowGap));
          if (gridColumn > props.rowSize) {
            gridColumn = props.rowSize;
          }
          target.style.gridColumn = `span ${gridColumn}`;
          target.style.gridRow = `span ${gridRow}`;
          setSizeHandler(target, gridColumn, gridRow);
        });
      });
    });
    const rowsChildren = reactive([]);
    const registerChild = (col, index2) => {
      rowsChildren[index2] = col;
      resizeObserver.observe(col, { box: "border-box" });
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
      const { width, height } = rows2.value.getBoundingClientRect();
      if (typeof props.rowWidth === "number") {
        rowWidth.value = props.rowWidth;
      } else {
        rowWidth.value = (width - (props.rowSize - 1) * props.columnGap) / props.rowSize;
      }
      if (typeof props.rowHeight === "number") {
        rowHeight.value = props.rowHeight;
      } else {
        rowHeight.value = height;
      }
    });
    onUnmounted(() => {
      resizeObserver.disconnect();
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
var rows = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-76cccc64"]]);
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
      "9c665e96": __props.columnSpan,
      "0a17a76f": __props.rowSpan,
      "262df066": unref(itemOrder)
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
    const itemOrder = computed(() => {
      const order = getOrder(colItem2.value);
      return order;
    });
    const isOnDrag = ref(false);
    onMounted(() => {
      const index2 = Array.from(colItem2.value.parentNode.children).indexOf(colItem2.value);
      registerHandler(colItem2.value, index2);
      colItem2.value.addEventListener("dragstart", () => {
        if (!props.drag) {
          return false;
        }
        setDragNode(colItem2.value);
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
        setDropNode(colItem2.value);
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
var colItem = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-22239aa7"]]);
function index(App) {
  App.component("jdRow", rows);
  App.component("jdCol", colItem);
}
export { index as default };
