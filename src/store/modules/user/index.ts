import { defineStore } from "pinia";
import {
  getUserInfo,
  login as userLogin,
  LoginData,
  logout as userLogout,
} from "@/api/user";
import { clearToken, setToken } from "@/utils/auth";
import { removeRouteListener } from "@/utils/route-listener";
import { UserState } from "./types";
import useAppStore from "../app";

const useUserStore = defineStore("user", {
  state: (): UserState => ({
    username: undefined,
    avatar: undefined,
    job: undefined,
    fileUrlPrefix: "",
    organization: undefined,
    location: undefined,
    email: undefined,
    introduction: undefined,
    personalWebsite: undefined,
    jobName: undefined,
    organizationName: undefined,
    locationName: undefined,
    phone: undefined,
    registrationDate: undefined,
    accountId: undefined,
    certification: undefined,
    role: "",
  }),

  getters: {
    userInfo(state: UserState): UserState {
      return { ...state };
    },
  },

  actions: {
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === "user" ? "admin" : "user";
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: Partial<UserState>) {
      this.$patch(partial);
    },

    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const { data } = await getUserInfo();
      this.setInfo(data.data);
    },

    // Login
    async login(loginForm: LoginData) {
      try {
        const { data } = await userLogin(loginForm);
        setToken(data.data);
      } catch (err) {
        clearToken();
        throw err;
      }
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      removeRouteListener();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
});

export default useUserStore;
