<template>
  <div class="content">
    <a-result class="result" status="404">
      <template #title>
        <h2 class="result-title">404</h2>
      </template>
      <template #subtitle>
        <p class="result-subtitle">抱歉，您访问的页面不存在或已被移除</p>
      </template>
      <template #extra>
        <p class="countdown-text">{{ countdownText }}</p>
        <div class="operation-row">
          <a-space>
            <a-button type="primary" @click="goHome">
              <template #icon><icon-home /></template>
              立即返回首页
            </a-button>
            <a-button @click="cancelCountdown">
              <template #icon><icon-close /></template>
              取消自动跳转
            </a-button>
          </a-space>
        </div>
      </template>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const countdown = ref(5);
  const countdownText = ref('');
  let timer: number | null = null;

  const updateCountdownText = () => {
    countdownText.value = `${countdown.value}秒后自动返回首页`;
  };

  const startCountdown = () => {
    updateCountdownText();
    timer = window.setInterval(() => {
      countdown.value -= 1;
      updateCountdownText();
      
      if (countdown.value <= 0) {
        clearCountdownTimer();
        goHome();
      }
    }, 1000);
  };

  const clearCountdownTimer = () => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  };

  const cancelCountdown = () => {
    clearCountdownTimer();
    countdownText.value = '自动跳转已取消';
  };

  const goHome = () => {
    clearCountdownTimer(); // 确保清除计时器，避免重复刷新
    
    // 首先尝试跳转到Workplace，如果存在登录状态的话
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      router.push({ name: 'Workplace' });
    } else {
      // 如果没有登录，则跳转到登录页
      router.push({ name: 'login' });
    }
  };

  onMounted(() => {
    startCountdown();
  });

  onBeforeUnmount(() => {
    clearCountdownTimer(); // 组件卸载前清除计时器
  });
</script>

<style scoped lang="less">
  .content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 100%;
    max-width: 560px;
  }

  .result-title {
    font-size: 72px;
    font-weight: bold;
    color: var(--color-text-1);
    margin: 0;
    line-height: 1.2;
  }

  .result-subtitle {
    font-size: 20px;
    color: var(--color-text-3);
    margin: 16px 0;
  }

  .countdown-text {
    color: var(--color-text-3);
    margin: 20px 0;
    font-size: 16px;
  }
  
  :deep(.arco-result-icon) {
    margin-bottom: 12px;
  }
</style>
