<template>
  <a-form
    ref="formRef"
    :label-col-props="{ span: 8 }"
    :model="formData"
    :wrapper-col-props="{ span: 16 }"
    class="form"
    :disabled="loading"
  >
    <a-form-item
      :label="formFields.email.label"
      :rules="[
        {
          required: formFields.email.required,
          message: formFields.email.errorMessage,
        },
      ]"
      field="email"
    >
      <a-input
        v-model="formData.email"
        :placeholder="formFields.email.placeholder"
      />
    </a-form-item>
    <a-form-item
      :label="formFields.nickname.label"
      :rules="[
        {
          required: formFields.nickname.required,
          message: formFields.nickname.errorMessage,
        },
      ]"
      field="nickname"
    >
      <a-input
        v-model="formData.nickname"
        :placeholder="formFields.nickname.placeholder"
      />
    </a-form-item>
    <a-form-item
      :label="formFields.college.label"
      :rules="[
        {
          required: formFields.college.required,
          message: formFields.college.errorMessage,
        },
      ]"
      field="college"
    >
      <a-select
        v-model="formData.college"
        :placeholder="formFields.college.placeholder"
      >
        <a-option
          v-for="option in collegeOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item :label="formFields.department.label" field="department">
      <a-input
        v-model="formData.department"
        :placeholder="formFields.department.placeholder"
      />
    </a-form-item>
    <a-form-item :label="formFields.title.label" field="title">
      <a-select
        v-model="formData.title"
        :placeholder="formFields.title.placeholder"
      >
        <a-option
          v-for="option in titleOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      :label="formFields.phone.label"
      :rules="[
        {
          required: formFields.phone.required,
          message: formFields.phone.errorMessage,
        },
      ]"
      field="phone"
    >
      <a-input
        v-model="formData.phone"
        :placeholder="formFields.phone.placeholder"
      />
    </a-form-item>
    <a-form-item
      :label="formFields.employeeId.label"
      :rules="[
        {
          required: formFields.employeeId.required,
          message: formFields.employeeId.errorMessage,
        },
      ]"
      field="employeeId"
    >
      <a-input
        v-model="formData.employeeId"
        :placeholder="formFields.employeeId.placeholder"
      />
    </a-form-item>
    <a-form-item
      :label="formFields.profile.label"
      field="profile"
    >
      <a-textarea
        v-model="formData.profile"
        :placeholder="formFields.profile.placeholder"
        :max-length="formFields.profile.maxLength"
      />
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate" :loading="loading"> 保存</a-button>
        <a-button type="secondary" @click="reset" :disabled="loading"> 重置</a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/store";
import { FormInstance } from "@arco-design/web-vue";
import { Message } from "@arco-design/web-vue";
import {
  ProctorInfoModel,
  formFields,
  collegeOptions,
  titleOptions,
} from "../columns";
import { getUserProfile, updateUserProfile } from "@/api/user";

const formRef = ref<FormInstance>();
const userStore = useUserStore();
const loading = ref(false);

const formData = ref<ProctorInfoModel>({
  email: "",
  nickname: "",
  college: "",
  department: "",
  title: "",
  phone: "",
  employeeId: "",
  profile: "",
});

// 加载用户个人信息
const loadUserProfile = async () => {
  try {
    loading.value = true;
    const res = await getUserProfile();
    if (res.data.code === 0 && res.data.data) {
      const profile = res.data.data;
      formData.value = {
        email: profile.email || userStore.email || "",
        nickname: profile.nickname || userStore.username || "",
        college: profile.college || "",
        department: profile.department || "",
        title: profile.title || "",
        phone: profile.phone || userStore.phone || "",
        employeeId: profile.employeeId || "",
        profile: profile.profile || userStore.introduction || "",
      };
    } else {
      // 没有个人信息时，使用用户store中的信息
      formData.value = {
        email: userStore.email || "",
        nickname: userStore.username || "",
        college: userStore.college || "",
        department: userStore.department || "",
        title: userStore.title || "",
        phone: userStore.phone || "",
        employeeId: userStore.employeeId || "",
        profile: userStore.profile || userStore.introduction || "",
      };
    }
  } catch (error) {
    console.error("加载用户个人信息失败:", error);
    Message.error("加载用户个人信息失败");
  } finally {
    loading.value = false;
  }
};

// 保存用户个人信息
const validate = async () => {
  try {
    const errors = await formRef.value?.validate();
    if (!errors) {
      loading.value = true;
      const result = await updateUserProfile({
        nickname: formData.value.nickname,
        email: formData.value.email,
        phone: formData.value.phone,
        college: formData.value.college,
        department: formData.value.department,
        title: formData.value.title,
        employeeId: formData.value.employeeId,
        profile: formData.value.profile,
      });
      
      if (result.data.code === 0) {
        Message.success("保存成功");
        // 更新用户store中的相关信息
        userStore.setInfo({
          email: formData.value.email,
          phone: formData.value.phone,
          username: formData.value.nickname,
          introduction: formData.value.profile,
          nickname: formData.value.nickname,
          college: formData.value.college,
          department: formData.value.department,
          title: formData.value.title,
          employeeId: formData.value.employeeId,
          profile: formData.value.profile,
        });
      } else {
        Message.error(result.data.msg || "保存失败");
      }
    }
  } catch (error) {
    console.error("保存用户个人信息失败:", error);
    Message.error("保存失败");
  } finally {
    loading.value = false;
  }
};

const reset = async () => {
  await formRef.value?.resetFields();
  loadUserProfile(); // 重新加载原始数据
};

onMounted(() => {
  loadUserProfile();
});
</script>

<style scoped lang="less">
.form {
  width: 540px;
  margin: 0 auto;
}
</style>
