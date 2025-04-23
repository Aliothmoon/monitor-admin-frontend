<template>
  <a-spin :loading="loading" style="width: 100%">
    <a-card :header-style="{ paddingBottom: '14px' }" class="general-card">
      <template #title>
        {{ $t("dataAnalysis.popularAuthor") }}
      </template>
      <template #extra>
        <a-link>{{ $t("workplace.viewMore") }}</a-link>
      </template>
      <a-table
        :bordered="false"
        :data="tableData.list"
        :pagination="false"
        :scroll="{ x: '100%', y: '350px' }"
        style="margin-bottom: 20px"
      >
        <template #columns>
          <a-table-column
            :title="$t('dataAnalysis.popularAuthor.column.ranking')"
            data-index="ranking"
          >
          </a-table-column>
          <a-table-column
            :title="$t('dataAnalysis.popularAuthor.column.author')"
            data-index="author"
          >
          </a-table-column>
          <a-table-column
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
            :title="$t('dataAnalysis.popularAuthor.column.content')"
            data-index="contentCount"
          >
          </a-table-column>
          <a-table-column
            :sortable="{
              sortDirections: ['ascend', 'descend'],
            }"
            :title="$t('dataAnalysis.popularAuthor.column.click')"
            data-index="clickCount"
          >
          </a-table-column>
        </template>
      </a-table>
    </a-card>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import useLoading from "@/hooks/loading";
import { queryPopularAuthor, PopularAuthorRes } from "@/api/visualization";

const { loading, setLoading } = useLoading();
const tableData = ref<PopularAuthorRes>({ list: [] });
const fetchData = async () => {
  try {
    setLoading(true);
    const { data } = await queryPopularAuthor();
    tableData.value = data;
  } catch (err) {
    // you can report use errorHandler or other
  } finally {
    setLoading(false);
  }
};
fetchData();
</script>

<style lang="less" scoped>
.general-card {
  max-height: 425px;
}
</style>
