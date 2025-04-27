<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <!--        LOGO -->
        <img :src="'/src/assets/logo.svg'" :width="30"></img>
        <!--        <icon-computer size="" />-->
        <a-typography-title
            :heading="5"
            :style="{ margin: 0, fontSize: '18px' }"
        >
          在线考试监考系统
        </a-typography-title>
        <icon-menu-fold
            v-if="!topMenu && appStore.device === 'mobile'"
            style="font-size: 22px; cursor: pointer"
            @click="toggleDrawerMenu"
        />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu"/>
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="$t('settings.search')">
          <a-button :shape="'circle'" class="nav-btn" type="outline">
            <template #icon>
              <icon-search/>
            </template>
          </a-button>
        </a-tooltip>
      </li>

      <li>
        <!--        <a-tooltip :content="''">-->
        <!--          <div class="message-box-trigger">-->
        <!--            <a-badge :count="9" dot>-->
        <!--              <a-button-->
        <!--                  :shape="'circle'"-->
        <!--                  class="nav-btn"-->
        <!--                  type="outline"-->
        <!--                  @click="setPopoverVisible"-->
        <!--              >-->
        <!--                <icon-notification/>-->
        <!--              </a-button>-->
        <!--            </a-badge>-->
        <!--          </div>-->
        <!--        </a-tooltip>-->
        <a-popover
            :arrow-style="{ display: 'none' }"
            :content-style="{ padding: 0, minWidth: '400px' }"
            content-class="message-popover"
            trigger="click"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box/>
          </template>
        </a-popover>
      </li>
      <li>
        <a-tooltip
            :content="
            isFullscreen
              ? $t('settings.navbar.screen.toExit')
              : $t('settings.navbar.screen.toFull')
          "
        >
          <a-button
              :shape="'circle'"
              class="nav-btn"
              type="outline"
              @click="toggleFullScreen"
          >
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen"/>
              <icon-fullscreen v-else/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button
              :shape="'circle'"
              class="nav-btn"
              type="outline"
              @click="setVisible"
          >
            <template #icon>
              <icon-settings/>
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-dropdown trigger="click">
          <a-avatar
              :size="32"
              :style="{
              marginRight: '8px',
              cursor: 'pointer',
              backgroundColor: avatarColor,
              color: 'white'
            }">
            {{ userInitial }}
          </a-avatar>
          <template #content>
            <a-doption>
              <a-space @click="$router.push({ name: 'Setting' })">
                <icon-settings/>
                <span>
                  用户设置
                </span>
              </a-space>
            </a-doption>
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export/>
                <span>
                  退出登录
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, inject} from "vue";
import {Message} from "@arco-design/web-vue";
import {useFullscreen} from "@vueuse/core";
import {useAppStore, useUserStore} from "@/store";
import useUser from "@/hooks/user";
import Menu from "@/components/menu/index.vue";
import MessageBox from "../message-box/index.vue";

const appStore = useAppStore();
const userStore = useUserStore();

const getColorHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 70%, 40%)`;
};

const userInitial = computed(() => {
  return userStore.username?.[0]?.toUpperCase() || '';
});

const avatarColor = computed(() => {
  return getColorHash(userStore.username || 'user');
});
const {logout} = useUser();
const {isFullscreen, toggle: toggleFullScreen} = useFullscreen();

const topMenu = computed(() => appStore.topMenu && appStore.menu);

const setVisible = () => {
  appStore.updateSettings({globalSettings: true});
};
const refBtn = ref();
const handleLogout = () => {
  logout();
};
const toggleDrawerMenu = inject("toggleDrawerMenu") as () => void;
</script>

<style lang="less" scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}
</style>
