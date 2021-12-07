<template>
  <ul
    class="parent"
    v-if="data.routeArr.length"
  >
    <li
      v-for="(route, index) in data.routeArr"
      :key="index"
    >
      <template v-if="route.children">
        <div class="routeMsg">
          <div class="checkBox">
            <el-checkbox
              v-model="route.checked"
              @change="handleCheckAllChange($event, route)"
            ></el-checkbox>
          </div>
          <div class="title">{{route.title}}</div>
        </div>
        <div class="collapse" :style="route.checked ? {height: (route.children.length * 20) + 'px'} : {height: '0px'}">
          <tree
            :authMenus="route.children"
            :auth="props.auth"
          />
        </div>
      </template>
      <template v-else>
        <div class="routeMsg">
          <div class="checkBox">
            <el-checkbox
              v-model="route.checked"
              :indeterminate="route.isIndeterminate"
              @change="handleCheckAllChange($event, route)"
            ></el-checkbox>
          </div>
          <div class="title">{{route.title}}</div>
          <div class="roles">
            <el-checkbox-group
              v-model="route.hasRoles"
              @change="rolesChange($event, route)"
            >
              <el-checkbox
                v-for="role in roles"
                :key="role.value"
                :label="role.value"
              >{{role.label}}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </template>
    </li>
  </ul>
</template>

<script setup>
import { reactive, watch } from "vue";
import tree from "./tree.vue";

const roles = [
  {
    label: "新增",
    value: "add",
  },
  {
    label: "删除",
    value: "del",
  },
  {
    label: "详情",
    value: "detail",
  },
  {
    label: "编辑",
    value: "edit",
  },
  {
    label: "导出",
    value: "download",
  },
];

const props = defineProps({
  authMenus: {
    type: Array,
    default() {
      return [];
    },
  },
  auth: {
    type: String,
    default() {
      return "";
    },
  },
});

const data = reactive({
  routeArr: [],
  isIndeterminate: false,
});

watch(
  props,
  (newVal, oldVal) => {
    if (newVal.authMenus?.length > 0) {
      data.routeArr = newVal.authMenus.map((route) => {
        let checked = false;
        let isIndeterminate = false;
        let hasRoles = [];
        if (route.meta.auth.length) {
          if (route.meta.auth.indexOf(props.auth) != -1) {
            checked = true;
          }
        }
        for (var name in route.meta.roles) {
          if (route.meta.roles[name].indexOf(props.auth) != -1) {
            hasRoles.push(name);
          }
        }
        if (hasRoles.length === roles.length || hasRoles.length === 0) {
          isIndeterminate = false;
        } else {
          isIndeterminate = true;
        }
        return {
          checked: checked,
          hasRoles: hasRoles,
          isIndeterminate: isIndeterminate,
          ...route,
        };
      });
    }
  },
  { immediate: true, deep: true }
);

function handleCheckAllChange(e, route) {
  route.isIndeterminate = false;
  let getRoles = route.hasRoles;
  if (e) {
    getRoles = roles.map((val) => {
      getRoles.push(val.value);
    });
  } else {
    getRoles.splice(0, getRoles.length);
  }
}

function rolesChange(e, route) {
  if (e.length === roles.length || e.length === 0) {
    route.isIndeterminate = false;
    if (e.length === 0) {
      route.checked = false;
    }
  } else {
    route.isIndeterminate = true;
    route.checked = true;
  }
}
</script>
<style lang='scss' scoped>
ul,
li {
  list-style: none;
}
.parent {
  margin-left: 30px;
  .routeMsg:hover {
    background-color: #eee;
    cursor: pointer;
  }
  .collapse{
      width: 100%;
      overflow: hidden;
      transition: all linear .3s;
  }
  .routeMsg {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    .checkBox {
      width: 20px;
    }
    .title {
      flex: 1;
      text-align: left;
    }
    .roles {
      width: 400px;
    }
  }
}
</style>