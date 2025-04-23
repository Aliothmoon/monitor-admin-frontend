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
      label="邮箱"
      :rules="[
        {
          required: true,
          message: '请输入邮箱',
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        placeholder="请输入邮箱地址，如xxx@example.com"
      />
    </a-form-item>
    <a-form-item
      field="nickname"
      label="昵称"
      :rules="[
        {
          required: true,
          message: '请输入昵称',
        },
      ]"
    >
      <a-input v-model="formData.nickname" placeholder="请输入您的昵称" />
    </a-form-item>
    <a-form-item
      field="college"
      label="所在学院"
      :rules="[
        {
          required: true,
          message: '请选择所在学院',
        },
      ]"
    >
      <a-select v-model="formData.college" placeholder="请选择所在学院">
        <a-option value="computer">计算机学院</a-option>
        <a-option value="math">数学学院</a-option>
        <a-option value="physics">物理学院</a-option>
        <a-option value="chemistry">化学学院</a-option>
        <a-option value="biology">生物学院</a-option>
        <a-option value="economics">经济学院</a-option>
        <a-option value="law">法学院</a-option>
        <a-option value="literature">文学院</a-option>
      </a-select>
    </a-form-item>
    <a-form-item field="department" label="所在系/部门">
      <a-input v-model="formData.department" placeholder="请输入所在系或部门" />
    </a-form-item>
    <a-form-item field="title" label="职称/职位">
      <a-select v-model="formData.title" placeholder="请选择您的职称或职位">
        <a-option value="professor">教授</a-option>
        <a-option value="associateProfessor">副教授</a-option>
        <a-option value="lecturer">讲师</a-option>
        <a-option value="assistant">助教</a-option>
        <a-option value="admin">教务管理员</a-option>
      </a-select>
    </a-form-item>
    <a-form-item
      field="employeeId"
      label="工号"
      :rules="[
        {
          required: true,
          message: '请输入工号',
        },
      ]"
    >
      <a-input
        v-model="formData.employeeId"
        placeholder="请输入您的教职工工号"
      />
    </a-form-item>
    <a-form-item field="notifications" label="通知方式">
      <a-checkbox-group v-model="formData.notifications">
        <a-checkbox value="email">邮件通知</a-checkbox>
        <a-checkbox value="sms">短信通知</a-checkbox>
        <a-checkbox value="app">应用内通知</a-checkbox>
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

interface ProctorInfoModel {
  email: string;
  nickname: string;
  college: string;
  department: string;
  title: string;
  phone: string;
  employeeId: string;
  notifications: string[];
  profile: string;
}

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
