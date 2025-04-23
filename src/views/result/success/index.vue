<template>
  <div class="container-form">
    <Breadcrumb :items="['menu.result', 'menu.result.success']" />
    <div class="wrapper">
      <a-result
        :subtitle="$t('success.result.subTitle')"
        :title="$t('success.result.title')"
        class="result"
        status="success"
      >
        <template #extra>
          <a-space :size="16" class="operation-wrap">
            <a-button key="again" type="secondary">
              {{ $t("success.result.printResult") }}
            </a-button>
            <a-button key="back" type="primary">
              {{ $t("success.result.projectList") }}
            </a-button>
          </a-space>
        </template>
      </a-result>

      <div class="steps-wrapper">
        <a-typography-paragraph bold
          >{{ $t("success.result.progress") }}
        </a-typography-paragraph>
        <a-steps :current="2" type="dot">
          <a-step
            :title="$t('success.submitApplication')"
            description="2020/10/10 14:00:39"
          />
          <a-step
            :description="$t('success.processing')"
            :title="$t('success.leaderReview')"
          />
          <a-step
            :description="$t('success.waiting')"
            :title="$t('success.purchaseCertificate')"
          />
          <a-step
            :description="$t('success.waiting')"
            :title="$t('success.safetyTest')"
          />
          <a-step
            :description="$t('success.waiting')"
            :title="$t('success.launched')"
          />
        </a-steps>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<script lang="ts">
export default {
  name: "Success",
};
</script>

<style lang="less" scoped>
.container-form {
  padding: 0 20px 20px 20px;
}

.wrapper {
  padding: 24px 150px;
  background-color: var(--color-bg-2);
  border-radius: 4px;
}

.result {
  margin: 150px 0 0 0;
}

.operation-wrap {
  margin-bottom: 40px;
  text-align: center;
}

.steps-wrapper {
  width: 100%;
  min-width: fit-content;
  margin-bottom: 150px;
  padding: 20px;
  background-color: rgb(var(--gray-1));
}
</style>

<style lang="less" scoped>
.mobile {
  .wrapper {
    padding: 24px 10px;

    .steps-wrapper {
      transform: scale(0.8);
    }
  }
}
</style>
