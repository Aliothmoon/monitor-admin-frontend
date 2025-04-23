<template>
  <div class="list-wrap">
    <a-typography-title :heading="6" class="block-title">
      {{ $t("cardList.tab.title.service") }}
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
        style="min-height: 162px"
      >
        <CardWrap
          :action-type="item.actionType"
          :close-txt="$t('cardList.service.cancel')"
          :default-value="item.enable"
          :description="item.description"
          :expires="item.expires"
          :expires-tag-text="$t('cardList.service.expiresTag')"
          :expires-text="$t('cardList.service.renew')"
          :icon="item.icon"
          :loading="loading"
          :open-txt="$t('cardList.service.open')"
          :tag-text="$t('cardList.service.tag')"
          :title="item.title"
        >
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line :rows="3" :widths="['100%', '40%', '100%']" />
              <a-skeleton-line :rows="1" :widths="['40%']" />
            </a-skeleton>
          </template>
        </CardWrap>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { queryTheServiceList, ServiceRecord } from "@/api/list";
import useRequest from "@/hooks/request";
import CardWrap from "./card-wrap.vue";

const defaultValue: ServiceRecord[] = new Array(4).fill({});
const { loading, response: renderData } = useRequest<ServiceRecord[]>(
  queryTheServiceList,
  defaultValue
);
</script>

<style lang="less" scoped></style>
