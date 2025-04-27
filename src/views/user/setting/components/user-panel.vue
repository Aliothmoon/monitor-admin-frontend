<template>
  <a-card :bordered="false">
    <a-space :size="54">
      <a-avatar :size="100" class="info-avatar" :style="{ backgroundColor: avatarColor, color: 'white' }">
        {{ userInitial }}
      </a-avatar>
      <a-descriptions
        :column="2"
        :data="renderData"
        :label-style="{
          width: '140px',
          fontWeight: 'normal',
          color: 'rgb(var(--gray-8))',
        }"
        :value-style="{
          width: '200px',
          paddingLeft: '8px',
          textAlign: 'left',
        }"
        align="right"
        layout="inline-horizontal"
      >
        <template #label="{ label }">{{ label }} :</template>
        <template #value="{ value, data }">
          <a-tag v-if="data.label === '实名认证'" color="green" size="small">
            已认证
          </a-tag>
          <a-tag v-else-if="data.label === '角色'" color="blue" size="small">
            {{ value }}
          </a-tag>
          <a-tag
            v-else-if="data.label === '状态'"
            :color="value === '在线' ? 'green' : 'orange'"
            size="small"
          >
            {{ value }}
          </a-tag>
          <span v-else>{{ value }}</span>
        </template>
      </a-descriptions>
    </a-space>
  </a-card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useUserStore } from "@/store";
import { createProctorPanelData } from "../columns";

const userStore = useUserStore();

// 从columns.ts文件获取监考员信息面板数据
const renderData = createProctorPanelData(userStore);

// 用户名首字母计算
const userInitial = computed(() => {
  return userStore.username?.[0]?.toUpperCase() || '';
});

// 根据用户名生成颜色
const getColorHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 40%)`;
};

// 用户头像背景色
const avatarColor = computed(() => {
  return getColorHash(userStore.username || 'user');
});
</script>

<style lang="less" scoped>
.arco-card {
  padding: 14px 0 4px 4px;
  border-radius: 4px;
}

.info-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: bold;
}
</style>
