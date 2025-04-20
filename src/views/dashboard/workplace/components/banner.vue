<template>
  <a-col class="banner">
    <a-col :span="16">
      <a-typography-title :heading="5" style="margin-top: 0">
        {{ $t('workplace.welcome') }} {{ userInfo.name }} - 在线考试监考系统
      </a-typography-title>
      <a-typography-paragraph type="secondary">
        当前考试场次：{{ examSessions }} | 异常事件：{{ anomalyCount }} | 监考员在线：<a-tag :color="proctorStatusColor">{{ onlineProctors }}/{{ totalProctors }}</a-tag>
      </a-typography-paragraph>
    </a-col>
    <a-divider class="panel-border" />
  </a-col>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useUserStore } from '@/store';

  const userStore = useUserStore();
  const userInfo = computed(() => {
    return {
      name: userStore.name,
    };
  });
  
  // 模拟数据，实际应从API获取
  const examSessions = ref(12);
  const anomalyCount = ref(3);
  const onlineProctors = ref(28);
  const totalProctors = ref(30);
  const proctorStatusColor = computed(() => onlineProctors.value / totalProctors.value > 0.9 ? 'green' : 'orange');
</script>

<style scoped lang="less">
  .banner {
    width: 100%;
    padding: 20px 20px 0 20px;
    background-color: var(--color-bg-2);
    border-radius: 4px 4px 0 0;
  }

  :deep(.arco-icon-home) {
    margin-right: 6px;
  }
</style>
