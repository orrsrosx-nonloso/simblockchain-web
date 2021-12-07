<template>
  <el-table
    ref="multipleTable"
    v-bind="$attrs"
    :data="tableData"
    style="width: 100%"
    empty-text="暂无数据"
    :row-key="props.rowKey ? props.rowKey : 'id'"
    @selection-change="handleSelectionChange"
  >
    <el-empty :image-size="200"></el-empty>
    <!-- 选择列 -->
    <el-table-column
      type="selection"
      width="55"
      v-if="props.selection ? props.selection: false"
    >
    </el-table-column>
    <!-- 非选择列 -->
    <template
      v-for="(list, index) in tableColumn"
      :key="index"
    >
      <!-- 序号列 -->
      <el-table-column
        v-if="list.type == 'index'"
        type="index"
        :label="list.label"
        :index="list.indexMethod ? list.indexMethod :indexMethod"
        :align="list.align ? list.align : 'center'"
      >
      </el-table-column>
      <!-- 操作列 -->
      <el-table-column
        v-else-if="list.type == 'action' && list.actionBtn.length"
        fixed="right"
        :label="list.label ? list.label : '操作'"
        :width="list.width"
      >
        <template #default="scope">
          <template
            v-for="(action, actionIndex) in list.actionBtn"
            :key="'action' + actionIndex"
          >
            <el-button
              v-if="rolesFun(action.funName)"
              type="text"
              size="small"
              :style="{color: color[action.color ? action.color : 'blue']}"
              @click="handleClick(scope.row, action.funName)"
            >{{action.title}}</el-button>
          </template>
        </template>
      </el-table-column>
      <!-- 数据列 -->
      <template v-else>
        <el-table-column
          v-if="list.slot"
          :prop="list.prop"
          :label="list.label"
          :width="list.width ? list.width : ''"
          :align="list.align ? list.align : 'center'"
        >
          <template #default="scope">
            <slot
              :name="list.prop"
              :row="scope.row"
            ></slot>
          </template>
        </el-table-column>
        <el-table-column
          v-else
          :prop="list.prop"
          :label="list.label"
          :width="list.width ? list.width : ''"
          :align="list.align ? list.align : 'center'"
        >
        </el-table-column>
      </template>
      <slot></slot>
    </template>
  </el-table>
</template>

<script setup>
import {
  ref,
  watchEffect,
  nextTick,
  reactive,
} from "vue";

import { useRoute } from "vue-router";
import { useStore } from "vuex";
import { computed } from 'vue';

const route = useRoute();
const store = useStore();
const routeRoles = computed(() => {
    return route;
});
const roles = computed(() => {
    return store.getters.authGetter;
});
function rolesFun(funName) {
    if (routeRoles.value && roles.value) {
        if (routeRoles.value.meta.roles[funName].indexOf(roles.value) != -1) {
            return true;
        } else {
            return false;
        }
    }
}

const props = defineProps({
  tableData: Array,
  tableColumn: Array,
  selectedData: Array,
  selection: Boolean,
  rowKey: String,
});

watchEffect(() => {
  if (props.selectedData?.length) {
    toggleSelection(props.selectedData);
  }
});

const color = {
  red: "#F56C6C",
  orange: "#E6A23C",
  green: "#67C23A",
  blue: "#409EFF",
};

const emit = defineEmits(["actionClick", "selectChange"]);
// 序号列默认操作
function indexMethod(index) {
  return index + 1;
}
// 操作列通知
function handleClick(data, funName) {
  emit("actionClick", {
    data: data,
    funName: funName,
  });
}

const multipleTable = ref(null);
const state = reactive({
  multipleSelection: [],
});
// 主动触发表格列被选中
function toggleSelection(rows) {
  nextTick(() => {
    // console.log(rows, multipleTable);
    if (rows) {
      rows.forEach((row) => {
        multipleTable.value.toggleRowSelection(row);
      });
    } else {
      multipleTable.value.clearSelection();
    }
  });
}
// 表格列被选中的操作
function handleSelectionChange(val) {
  //   console.log(val);
  state.multipleSelection = val;
  emit("selectChange", state.multipleSelection);
}
</script>

<style lang='scss' scoped>
.red {
  color: "#F56C6C";
}
.orange {
  color: "#E6A23C";
}
.green {
  color: "#67C23A";
}
.blue {
  color: "#409EFF";
}
</style>