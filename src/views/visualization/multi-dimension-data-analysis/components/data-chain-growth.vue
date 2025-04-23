<template>
  <div>
    <a-row :gutter="16">
      <a-col :span="6">
        <ChainItem
          :title="$t('multiDAnalysis.card.title.retentionTrends')"
          chart-type="line"
          quota="retentionTrends"
        />
      </a-col>
      <a-col :span="6">
        <ChainItem
          :title="$t('multiDAnalysis.card.title.userRetention')"
          chart-type="bar"
          quota="userRetention"
        />
      </a-col>
      <a-col :span="6">
        <ChainItem
          :title="$t('multiDAnalysis.card.title.contentConsumptionTrends')"
          chart-type="line"
          quota="contentConsumptionTrends"
        />
      </a-col>
      <a-col :span="6">
        <ChainItem
          :title="$t('multiDAnalysis.card.title.contentConsumption')"
          chart-type="bar"
          quota="contentConsumption"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
import ChainItem from "./chain-item.vue";
</script>
