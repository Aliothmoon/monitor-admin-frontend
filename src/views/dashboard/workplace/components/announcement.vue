<template>
  <a-card
    :body-style="{ padding: '15px 20px 13px 20px' }"
    :header-style="{ paddingBottom: '0' }"
    :title="$t('workplace.announcement')"
    class="general-card"
  >
    <template #extra>
      <a-link>{{ $t("workplace.viewMore") }}</a-link>
    </template>
    <div>
      <div v-for="(item, idx) in list" :key="idx" class="item">
        <a-tag :color="item.type" size="small">{{ item.label }}</a-tag>
        <span class="item-content">
          {{ item.content }}
        </span>
      </div>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
const list = [
  {
    type: "orangered",
    label: "活动",
    content: "内容最新优惠活动",
  },
  {
    type: "cyan",
    label: "消息",
    content: "新增内容尚未通过审核，详情请点击查看。",
  },
  {
    type: "blue",
    label: "通知",
    content: "当前产品试用期即将结束，如需续费请点击查看。",
  },
  {
    type: "blue",
    label: "通知",
    content: "1月新系统升级计划通知",
  },
  {
    type: "cyan",
    label: "消息",
    content: "新增内容已经通过审核，详情请点击查看。",
  },
];
</script>

<style lang="less" scoped>
.item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 24px;
  margin-bottom: 4px;

  .item-content {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 4px;
    color: var(--color-text-2);
    text-decoration: none;
    font-size: 13px;
    cursor: pointer;
  }
}
</style>
