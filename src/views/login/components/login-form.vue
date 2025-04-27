<template>
  <div class="login-form-wrapper">
    <div
      class="login-form-title"
      style="justify-content: center; display: flex"
    >
      <div>在线考试监考系统管理后台</div>
    </div>
    <div class="login-form-error-msg">{{ errorMessage }}</div>
    <a-form
      ref="loginForm"
      :model="userInfo"
      class="login-form"
      layout="vertical"
      @submit="handleSubmit"
    >
      <a-form-item
        :rules="[{ required: true, message: $t('login.form.userName.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        field="account"
        hide-label
      >
        <a-input
          v-model="userInfo.account"
          :placeholder="'请输入用户名'"
          :size="'large'"
        >
          <template #prefix>
            <icon-user />
          </template>
        </a-input>
      </a-form-item>
      <a-form-item
        :rules="[{ required: true, message: $t('login.form.password.errMsg') }]"
        :validate-trigger="['change', 'blur']"
        field="password"
        hide-label
      >
        <a-input-password
          v-model="userInfo.password"
          :placeholder="'请输入密码'"
          :size="'large'"
          allow-clear
        >
          <template #prefix>
            <icon-lock />
          </template>
        </a-input-password>
      </a-form-item>
      <a-space :size="16" direction="vertical">
        <div class="login-form-password-actions">
          <a-checkbox
            :model-value="loginConfig.rememberPassword"
            checked="rememberPassword"
            @change="setRememberPassword as any"
          >
            {{ $t("login.form.rememberPassword") }}
          </a-checkbox>
        </div>
        <a-button
          :loading="loading"
          :size="'large'"
          html-type="submit"
          long
          style="margin-top: 10px"
          type="primary"
        >
          {{ "登录" }}
        </a-button>
      </a-space>
    </a-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Message } from "@arco-design/web-vue";
import { ValidatedError } from "@arco-design/web-vue/es/form/interface";
import { useI18n } from "vue-i18n";
import { useStorage } from "@vueuse/core";
import { useUserStore } from "@/store";
import useLoading from "@/hooks/loading";
import type { LoginData } from "@/api/user";

const router = useRouter();
const { t } = useI18n();
const errorMessage = ref("");
const { loading, setLoading } = useLoading();
const userStore = useUserStore();

const loginConfig = useStorage("login-config", {
  rememberPassword: true,
  account: "admin",
  password: "aliothmoon",
});
const userInfo = reactive({
  account: loginConfig.value.account,
  password: loginConfig.value.password,
});

const handleSubmit = async ({
  errors,
  values,
}: {
  errors: Record<string, ValidatedError> | undefined;
  values: Record<string, any>;
}) => {
  if (loading.value) return;
  if (!errors) {
    setLoading(true);
    try {
      await userStore.login(values as LoginData);
      const { redirect, ...othersQuery } = router.currentRoute.value.query;
      await router.push({
        name: (redirect as string) || "Workplace",
        query: {
          ...othersQuery,
        },
      });
      Message.success(t("login.form.login.success"));
      const { rememberPassword } = loginConfig.value;
      const { account, password } = values;

      loginConfig.value.account = rememberPassword ? account : "";
      loginConfig.value.password = rememberPassword ? password : "";
    } catch (err) {
      errorMessage.value = (err as Error).message;
    } finally {
      setLoading(false);
    }
  }
};
const setRememberPassword = (value: boolean) => {
  loginConfig.value.rememberPassword = value;
};
</script>

<style lang="less" scoped>
.login-form {
  &-wrapper {
    width: 320px;
  }

  &-title {
    color: var(--color-text-1);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
  }

  &-sub-title {
    color: var(--color-text-3);
    font-size: 16px;
    line-height: 24px;
  }

  &-error-msg {
    height: 32px;
    color: rgb(var(--red-6));
    line-height: 32px;
  }

  &-password-actions {
    display: flex;
    justify-content: space-between;
  }

  &-register-btn {
    color: var(--color-text-3) !important;
  }
}
</style>
