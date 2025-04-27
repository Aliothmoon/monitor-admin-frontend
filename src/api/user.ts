import axios from "axios";
import type { RouteRecordNormalized } from "vue-router";
import { UserState } from "@/store/modules/user/types";

export interface LoginData {
  account: string;
  password: string;
}

export interface LoginRes {
  token: string;
}

export function login(data: LoginData) {
  return axios.post<R<string>>("/user/login", data);
}

export function logout() {
  return axios.post<string>("/user/logout");
}

export function getUserInfo() {
  return axios.get<R<UserState>>("/user/info");
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>("/user/menu");
}

// 用户个人信息接口
export interface UserProfileData {
  userId?: number;
  nickname: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  title: string;
  employeeId: string;
  profile: string;
}

// 获取用户个人信息
export function getUserProfile() {
  return axios.get<R<UserProfileData>>("/user/profile");
}

// 更新用户个人信息
export function updateUserProfile(data: UserProfileData) {
  return axios.put<R<boolean>>("/user/profile", data);
}
