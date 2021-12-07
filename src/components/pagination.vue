<template>
  <!-- 自己根据elementplus配置自己需要的组件 -->
  <!-- !!!!!注：在 Vue 3 的虚拟 DOM 中，事件监听器现在只是以 on 为前缀的 attribute，这样就成了 $attrs 对象的一部分，因此 $listeners 被移除了。 -->
  <div>
    <div :class="isPhone ? 'paginationIsPhone' : 'pagination'">
      <el-pagination
        v-bind="$attrs"
        layout="total, prev, pager, next"
        :small="isPhone"
      >
      </el-pagination>
    </div>
    <!-- 占位div -->
    <div v-if="isPhone" class="blank"></div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { computed } from "vue";

const store = useStore();
const isPhone = computed(() => {
  return store.getters.getIsPhone;
});
</script>

<style lang='scss' scoped>
.pagination {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.paginationIsPhone {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 50px;
  background-color: #fff;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  z-index: 999;
}
.blank{
  width: 100%;
  height: 50px;
}
</style>