<template>
  <!-- retrieval检索条件封装 -->
  <div :class="isPhone ? 'retrievalIsPhone' : 'retrieval'">
    <div
      :class="isPhone ? 'leftForm' : ''"
      :style="isPhone ? {width: '100%'} : {width: `calc(100% - ${((retrievalActionBtn.length * 100) + 'px')}`}"
    >
      <el-form
        :inline="true"
        :label-position="isPhone? 'top':'left'"
        :model="form"
        class="form"
        @submit.native.prevent
      >
        <template
          v-for="(retrieval, index) in props.retrievalList"
          :key="index"
        >
          <!-- 输入框搜索 -->
          <el-form-item
            :label="retrieval.label"
            v-if="retrieval.type === 'input'"
          >
            <el-input
              v-model="form[retrieval.props]"
              :placeholder="`请输入${retrieval.label}`"
              :clearable="form[retrieval.clearable] ? form[retrieval.clearable] : true"
              @change="action('retrieval')"
            ></el-input>
          </el-form-item>
          <!-- 下拉框 -->
          <el-form-item
            :label="retrieval.label"
            v-if="retrieval.type === 'select'"
          >
            <el-select
              v-model="form[retrieval.props]"
              :placeholder="`请选择${retrieval.label}`"
              @change="action('retrieval')"
              :clearable="form[retrieval.clearable] ? form[retrieval.clearable] : true"
            >
              <el-option
                v-for="item in retrieval.options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- 日期选择 -->
          <el-form-item
            :label="retrieval.label"
            v-if="retrieval.type === 'date'"
          >
            <el-date-picker
              v-model="form[retrieval.props]"
              :clearable="form[retrieval.clearable] ? form[retrieval.clearable] : true"
              :type="retrieval.dateType"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              @change="action('retrieval')"
            >
            </el-date-picker>
          </el-form-item>
          <!-- 自定义条件 -->
          <el-form-item
            :label="retrieval.label"
            v-if="retrieval.type === 'slot'"
          >
            <slot
              :name="retrieval.props"
              :form="form"
              :props="retrieval.props"
              :slot-change="action('retrieval')"
            ></slot>
          </el-form-item>
        </template>
      </el-form>
    </div>
    <div
      class="rightActions"
      :style="{width: (retrievalActionBtn.length * 100) + 'px'}"
    >
      <el-button
        type="success"
        plain
        :size="isPhone ? 'mini' : ''"
        icon="el-icon-circle-plus"
        v-if="retrievalActionBtn.indexOf('add') !== -1 && rolesFun('add')"
        @click="action('add')"
      >新增</el-button>
      <el-button
        type="primary"
        icon="el-icon-search"
        :size="isPhone ? 'mini' : ''"
        v-if="retrievalActionBtn.indexOf('retrieval') !== -1"
        @click="action('retrieval')"
      >查询</el-button>
      <el-button
        @click="action('reset')"
        icon="el-icon-refresh-right"
        :size="isPhone ? 'mini' : ''"
        v-if="retrievalActionBtn.indexOf('reset') !== -1"
      >重置</el-button>
      <el-button
        type="info"
        @click="action('download')"
        icon="el-icon-download"
        :size="isPhone ? 'mini' : ''"
        v-if="retrievalActionBtn.indexOf('download') !== -1 && rolesFun('download')"
      >导出</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watchEffect, computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

const route = useRoute();
const store = useStore();

const routeRoles = computed(() => {
  return route.meta.roles;
});
const roles = computed(() => {
  return store.getters.authGetter;
});
const isPhone = computed(() => {
  return store.getters.getIsPhone;
});
function rolesFun(funName) {
  if (routeRoles.value && roles.value) {
    if (routeRoles.value[funName].indexOf(roles.value) != -1) {
      return true;
    } else {
      return false;
    }
  }
}

const props = defineProps({
  retrievalList: {
    type: Array,
    default() {
      return [];
    },
  },
  retrievalActionBtn: {
    type: Array,
    default() {
      return [];
    },
  },
});

const emit = defineEmits(["retrievalAction"]);

const form = reactive({});

watchEffect(() => {
  props.retrievalList.map((val) => {
    form[val.props] = val.default ? val.default : "";
  });
});

function action(type) {
  if (type == "reset") {
    for (let key in form) {
      form[key] = "";
    }
  }
  emit("retrievalAction", {
    type: type,
    form: form,
  });
}
</script>

<style lang='scss' scoped>
.retrieval {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .form {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    flex-wrap: wrap;
  }
}
.retrievalIsPhone {
  width: 100%;
  .leftForm {
    .form {
      display: flex;
      justify-content: center;
      align-items: flex-start;
      flex-wrap: wrap;
    }
  }
  .rightActions{
    margin: 20px auto;
  }
}
</style>