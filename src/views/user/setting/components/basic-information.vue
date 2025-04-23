<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
    <a-form-item
      field="email"
      :label="formFields.email.label"
      :rules="[
        {
          required: formFields.email.required,
          message: formFields.email.errorMessage,
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        :placeholder="formFields.email.placeholder"
      />
    </a-form-item>
    <a-form-item
      field="nickname"
      :label="formFields.nickname.label"
      :rules="[
        {
          required: formFields.nickname.required,
          message: formFields.nickname.errorMessage,
        },
      ]"
    >
      <a-input v-model="formData.nickname" :placeholder="formFields.nickname.placeholder" />
    </a-form-item>
    <a-form-item
      field="college"
      :label="formFields.college.label"
      :rules="[
        {
          required: formFields.college.required,
          message: formFields.college.errorMessage,
        },
      ]"
    >
      <a-select v-model="formData.college" :placeholder="formFields.college.placeholder">
        <a-option v-for="option in collegeOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="department" :label="formFields.department.label">
      <a-input v-model="formData.department" :placeholder="formFields.department.placeholder" />
    </a-form-item>
    <a-form-item field="title" :label="formFields.title.label">
      <a-select v-model="formData.title" :placeholder="formFields.title.placeholder">
        <a-option v-for="option in titleOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="phone"
      :label="formFields.phone.label"
      :rules="[
        {
          required: formFields.phone.required,
          message: formFields.phone.errorMessage,
        },
      ]"
    >
      <a-input
        v-model="formData.phone"
        :placeholder="formFields.phone.placeholder"
      />
    </a-form-item>
    <a-form-item
      field="employeeId"
      :label="formFields.employeeId.label"
      :rules="[
        {
          required: formFields.employeeId.required,
          message: formFields.employeeId.errorMessage,
        },
      ]"
    >
      <a-input
        v-model="formData.employeeId"
        :placeholder="formFields.employeeId.placeholder"
      />
    </a-form-item>
    <a-form-item field="notifications" :label="formFields.notifications.label">
      <a-checkbox-group v-model="formData.notifications">
        <a-checkbox v-for="option in notificationOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </a-checkbox>
      </a-checkbox-group>
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="validate"> 保存 </a-button>
        <a-button type="secondary" @click="reset"> 重置 </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useUserStore } from "@/store";
import { FormInstance } from "@arco-design/web-vue";
import { 
  ProctorInfoModel, 
  formFields, 
  collegeOptions, 
  titleOptions, 
  notificationOptions 
} from '../columns';

const formRef = ref<FormInstance>();
const userStore = useUserStore();

const formData = ref<ProctorInfoModel>({
  email: userStore.email || "",
  nickname: userStore.name || "",
  college: "",
  department: "",
  title: "",
  phone: userStore.phone || "",
  employeeId: "",
  notifications: ["email"],
  profile: userStore.introduction || "",
});

const validate = async () => {
  const res = await formRef.value?.validate();
  if (!res) {
    // do some thing
    // you also can use html-type to submit
  }
};
const reset = async () => {
  await formRef.value?.resetFields();
};
</script>

<style scoped lang="less">
.form {
  width: 540px;
  margin: 0 auto;
}
</style>
