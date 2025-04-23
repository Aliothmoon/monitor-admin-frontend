<template>
  <div class="container-form">
    <Breadcrumb :items="['个人中心', '监考员设置']" />
    <a-row style="margin-bottom: 16px">
      <a-col :span="24">
        <UserPanel />
      </a-col>
    </a-row>
    <a-row class="wrapper">
      <a-col :span="24">
        <a-tabs default-active-key="1" type="rounded">
          <a-tab-pane key="1" title="监考员信息">
            <BasicInformation />
          </a-tab-pane>
        </a-tabs>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import UserPanel from "./components/user-panel.vue";
import BasicInformation from "./components/basic-information.vue";
</script>

<script lang="ts">
export default {
  name: "Setting",
};
</script>

<style lang="less" scoped>
.container-form {
  padding: 0 20px 20px 20px;
}

.wrapper {
  padding: 20px 0 0 20px;
  min-height: 500px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

:deep(.section-title) {
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 14px;
}
</style>
