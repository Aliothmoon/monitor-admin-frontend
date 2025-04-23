<template>
  <div class="container-form">
    <Breadcrumb :items="['menu.exception', 'menu.exception.404']" />
    <div class="content">
      <a-result
        :subtitle="$t('exception.result.404.description')"
        class="result"
        status="404"
      >
      </a-result>
      <div class="operation-row">
        <a-button key="again" style="margin-right: 16px">
          {{ $t("exception.result.404.retry") }}
        </a-button>
        <a-button key="back" type="primary">
          {{ $t("exception.result.404.back") }}
        </a-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default {
  name: "404",
};
</script>

<style lang="less" scoped>
.container-form {
  padding: 0 20px 20px 20px;
  height: calc(100% - 40px);

  :deep(.content) {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    background-color: var(--color-bg-1);
    border-radius: 4px;
  }
}
</style>
