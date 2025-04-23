<template>
  <a-card
    :header-style="{ paddingBottom: '12px' }"
    :title="$t('dataAnalysis.title.publicOpinion')"
    class="general-card"
  >
    <a-grid :col-gap="12" :cols="24" :row-gap="12">
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          :card-style="{
            background: isDark
              ? 'linear-gradient(180deg, #284991 0%, #122B62 100%)'
              : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
          }"
          :title="$t('dataAnalysis.card.title.allVisitors')"
          chart-type="line"
          quota="visitors"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          :card-style="{
            background: isDark
              ? ' linear-gradient(180deg, #3D492E 0%, #263827 100%)'
              : 'linear-gradient(180deg, #F5FEF2 0%, #E6FEEE 100%)',
          }"
          :title="$t('dataAnalysis.card.title.contentPublished')"
          chart-type="bar"
          quota="published"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          :card-style="{
            background: isDark
              ? 'linear-gradient(180deg, #294B94 0%, #0F275C 100%)'
              : 'linear-gradient(180deg, #f2f9fe 0%, #e6f4fe 100%)',
          }"
          :title="$t('dataAnalysis.card.title.totalComment')"
          chart-type="line"
          quota="comment"
        />
      </a-grid-item>
      <a-grid-item :span="{ xs: 12, sm: 12, md: 12, lg: 12, xl: 6, xxl: 6 }">
        <ChainItem
          :card-style="{
            background: isDark
              ? 'linear-gradient(180deg, #312565 0%, #201936 100%)'
              : 'linear-gradient(180deg, #F7F7FF 0%, #ECECFF 100%)',
          }"
          :title="$t('dataAnalysis.card.title.totalShare')"
          chart-type="pie"
          quota="share"
        />
      </a-grid-item>
    </a-grid>
  </a-card>
</template>

<script lang="ts" setup>
import useThemes from "@/hooks/themes";
import ChainItem from "./chain-item.vue";

const { isDark } = useThemes();
</script>
