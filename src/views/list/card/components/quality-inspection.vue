<template>
  <div class="list-wrap">
    <a-typography-title :heading="6" class="block-title">
      {{ $t("cardList.tab.title.content") }}
    </a-typography-title>
    <a-row :gutter="24" class="list-row">
      <a-col
        :lg="6"
        :md="12"
        :sm="12"
        :xl="6"
        :xs="12"
        :xxl="6"
        class="list-col"
      >
        <div class="card-wrap empty-wrap">
          <a-card :bordered="false" hoverable>
            <a-result :status="null" :title="$t('cardList.content.action')">
              <template #icon>
                <icon-plus style="font-size: 20px" />
              </template>
            </a-result>
          </a-card>
        </div>
      </a-col>
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
      >
        <CardWrap
          :action-type="item.actionType"
          :close-txt="$t('cardList.content.delete')"
          :default-value="item.enable"
          :description="item.description"
          :icon="item.icon"
          :loading="loading"
          :open-txt="$t('cardList.content.inspection')"
          :show-tag="false"
          :title="item.title"
        >
          <a-descriptions
            :column="2"
            :data="item.data"
            layout="inline-horizontal"
            style="margin-top: 16px"
          />
          <template #skeleton>
            <a-skeleton :animation="true">
              <a-skeleton-line
                :rows="4"
                :widths="['50%', '50%', '100%', '40%']"
              />
              <a-skeleton-line :rows="1" :widths="['40%']" />
            </a-skeleton>
          </template>
        </CardWrap>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import { queryInspectionList, ServiceRecord } from "@/api/list";
import useRequest from "@/hooks/request";
import CardWrap from "./card-wrap.vue";

const defaultValue: ServiceRecord[] = new Array(3).fill({});
const { loading, response: renderData } = useRequest<ServiceRecord[]>(
  queryInspectionList,
  defaultValue
);
</script>

<style lang="less" scoped>
.card-wrap {
  height: 100%;
  transition: all 0.3s;
  border: 1px solid var(--color-neutral-3);

  &:hover {
    transform: translateY(-4px);
  }

  :deep(.arco-card-meta-description) {
    color: rgb(var(--gray-6));

    .arco-descriptions-item-label-inline {
      font-weight: normal;
      font-size: 12px;
      color: rgb(var(--gray-6));
    }

    .arco-descriptions-item-value-inline {
      color: rgb(var(--gray-8));
    }
  }
}

.empty-wrap {
  height: 200px;
  border-radius: 4px;

  :deep(.arco-card) {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;

    .arco-result-title {
      color: rgb(var(--gray-6));
    }
  }
}
</style>
