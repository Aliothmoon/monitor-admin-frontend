<template>
  <div class="list-wrap">
    <a-typography-title :heading="6" class="block-title">
      {{ $t("cardList.tab.title.preset") }}
    </a-typography-title>
    <a-row :gutter="24" class="list-row">
      <a-col
        v-for="item in renderData"
        :key="item.id"
        :lg="6"
        :md="12"
        :sm="12"
        :xl="6"
        :xs="12"
        :xxl="6"
        class="list-col"
        style="min-height: 140px"
      >
        <CardWrap
          :action-type="item.actionType"
          :default-value="item.enable"
          :description="item.description"
          :loading="loading"
          :tag-text="$t('cardList.preset.tag')"
          :title="item.title"
        >
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line :rows="2" :widths="['100%', '40%']" />
              <a-skeleton-line :rows="1" :widths="['40%']" />
            </a-skeleton>
          </template>
        </CardWrap>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { queryRulesPresetList, ServiceRecord } from "@/api/list";
import useRequest from "@/hooks/request";
import CardWrap from "./card-wrap.vue";

const defaultValue: ServiceRecord[] = new Array(6).fill({});
const { loading, response: renderData } = useRequest<ServiceRecord[]>(
  queryRulesPresetList,
  defaultValue
);
</script>

<style lang="less" scoped></style>
