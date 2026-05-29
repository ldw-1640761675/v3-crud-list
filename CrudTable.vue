<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { TableColumnCtx } from "element-plus";

/**
 * 表格列配置接口
 * 用于定义表格列的展示和搜索行为
 */
export interface TableColumn {
  // ==================== 列表展示配置 ====================
  prop: string;
  label: string;
  width?: string | number;
  align?: "left" | "center" | "right";
  sortable?: boolean;
  formatter?: (row: Record<string, any>, column: TableColumnCtx) => any;
  /** 是否在列表中展示，默认 true，设置为 false 则仅作为搜索字段 */
  isShow?: boolean;
  remark?: string;
  /** 列表显示字典映射，传入后自动根据 value 匹配 label 显示 */
  dictOptions?: {
    label: string;
    value: string | number;
  }[];

  // ==================== 搜索配置 ====================
  /** 是否作为搜索条件，默认 false，设置为 true 则生成对应的搜索控件 */
  isSearch?: boolean;
  /** 搜索控件类型，支持 input/select/date/daterange/number，默认 input */
  searchType?: "input" | "select" | "date" | "daterange" | "number";
  searchOptions?: {
    label: string;
    value: string | number;
  }[];
  searchPlaceholder?: string;
  searchAlign?: "left" | "center" | "right";
  searchLabelAlign?: "left" | "right";
  /** 日期格式，默认 YYYY-MM-DD */
  searchDateFormat?: string;
  /** 是否在日期范围选择时自动添加时间（开始时间加 00:00:00，结束时间加 23:59:59），默认 true */
  searchDateAddTime?: boolean;
}

interface Props {
  columns: TableColumn[];
  data: Record<string, any>[];
  total: number;
  loading?: boolean;
  pageSizes?: number[];
  /** 是否显示分页组件，默认 true */
  showPagination?: boolean;
  /** 搜索按钮位置：inline-与搜索框同行，block-在搜索框下方，默认 inline */
  searchButtonPosition?: "inline" | "block";
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  pageSizes: () => [10, 20, 50, 100],
  showPagination: true,
  searchButtonPosition: "inline",
});

const emit = defineEmits<{
  (e: "search", params: Record<string, any>): void;
  (e: "update:page", page: number): void;
  (e: "update:size", size: number): void;
}>();

const searchForm = ref<Record<string, any>>({});
const currentPage = ref(1);
const pageSize = ref(10);
const showSearch = ref(true);

const searchColumns = computed(() => {
  return props.columns.filter((col) => col.isSearch);
});

const tableColumns = computed(() => {
  return props.columns.filter((col) => col.isShow !== false);
});

const getDictLabel = (col: TableColumn, value: any): string => {
  if (!col.dictOptions || col.dictOptions.length === 0) {
    return value;
  }
  const option = col.dictOptions.find(
    (opt) => String(opt.value) === String(value),
  );
  return option ? option.label : value;
};

const resetForm = () => {
  searchForm.value = {};
  searchColumns.value.forEach((col) => {
    if (col.searchType === "daterange") {
      searchForm.value[col.prop] = [];
    }
  });
  currentPage.value = 1;
  handleSearch();
};

const handleSearch = () => {
  currentPage.value = 1;
  const params: Record<string, any> = {};
  searchColumns.value.forEach((col) => {
    let value = searchForm.value[col.prop];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.length === 0) return;

      if (
        col.searchType === "daterange" &&
        Array.isArray(value) &&
        value.length === 2
      ) {
        const addTime = col.searchDateAddTime !== false;
        if (addTime) {
          value = [value[0] + " 00:00:00", value[1] + " 23:59:59"];
        }
      }

      params[col.prop] = value;
    }
  });
  emit("search", {
    ...params,
    page: 1,
    pageSize: pageSize.value,
  });
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
  emit("update:page", page);
  const params: Record<string, any> = {};
  searchColumns.value.forEach((col) => {
    const value = searchForm.value[col.prop];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.length === 0) return;
      params[col.prop] = value;
    }
  });
  emit("search", {
    ...params,
    page,
    pageSize: pageSize.value,
  });
};

const handleSizeChange = (size: number) => {
  pageSize.value = size;
  currentPage.value = 1;
  emit("update:size", size);
  const params: Record<string, any> = {};
  searchColumns.value.forEach((col) => {
    const value = searchForm.value[col.prop];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value) && value.length === 0) return;
      params[col.prop] = value;
    }
  });
  emit("search", {
    ...params,
    page: 1,
    pageSize: size,
  });
};

watch(
  () => props.pageSizes,
  (newSizes) => {
    if (newSizes && newSizes.length > 0) {
      pageSize.value = newSizes[0];
    }
  },
  { immediate: true },
);

watch(
  () => props.columns,
  () => {
    searchColumns.value.forEach((col) => {
      if (col.searchType === "daterange" && !searchForm.value[col.prop]) {
        searchForm.value[col.prop] = [];
      }
    });
  },
  { immediate: true },
);
</script>

<template>
  <div class="crud-table-container">
    <div v-if="searchColumns.length > 0" class="search-bar">
      <el-card class="search-card" shadow="never">
        <div
          :class="['search-header', { 'search-header-collapsed': !showSearch }]"
        >
          <span class="search-title">搜索条件</span>
          <el-button type="text" @click="showSearch = !showSearch">
            {{ showSearch ? "收起" : "展开" }}
          </el-button>
        </div>

        <div v-show="showSearch" class="search-form">
          <el-form :model="searchForm" inline>
            <el-form-item
              v-for="col in searchColumns"
              :key="col.prop"
              :label="col.label"
              :class="[
                `search-item-${col.searchAlign || 'left'}`,
                `search-label-${col.searchLabelAlign || 'right'}`,
              ]"
            >
              <el-input
                v-if="col.searchType === 'input' || !col.searchType"
                v-model="searchForm[col.prop]"
                :placeholder="col.searchPlaceholder || `请输入${col.label}`"
                class="search-input"
                :style="{ textAlign: col.searchAlign }"
                @keyup.enter="handleSearch"
              />

              <el-select
                v-else-if="col.searchType === 'select'"
                v-model="searchForm[col.prop]"
                :placeholder="col.searchPlaceholder || `请选择${col.label}`"
                class="search-input"
              >
                <el-option
                  v-for="opt in col.searchOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>

              <el-input-number
                v-else-if="col.searchType === 'number'"
                v-model="searchForm[col.prop]"
                :placeholder="col.searchPlaceholder || `请输入${col.label}`"
                class="search-input"
                :style="{ textAlign: col.searchAlign }"
              />

              <el-date-picker
                v-else-if="col.searchType === 'date'"
                v-model="searchForm[col.prop]"
                type="date"
                :format="col.searchDateFormat || 'YYYY-MM-DD'"
                :value-format="col.searchDateFormat || 'YYYY-MM-DD'"
                :placeholder="col.searchPlaceholder || `请选择${col.label}`"
                class="search-input"
              />

              <el-date-picker
                v-else-if="col.searchType === 'daterange'"
                v-model="searchForm[col.prop]"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :format="col.searchDateFormat || 'YYYY-MM-DD'"
                :value-format="col.searchDateFormat || 'YYYY-MM-DD'"
                class="search-input"
              />
            </el-form-item>

            <el-form-item
              v-if="searchButtonPosition === 'inline'"
              class="search-actions-inline"
            >
              <el-button type="primary" @click="handleSearch">搜索</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>

          <div v-if="searchButtonPosition === 'block'" class="search-actions">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="resetForm">重置</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <el-card class="table-card" shadow="never">
      <el-table
        :data="data"
        :loading="loading"
        border
        fit
        highlight-current-row
        :key="JSON.stringify(columns)"
      >
        <el-table-column
          v-for="col in tableColumns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align || 'left'"
          :sortable="col.sortable"
        >
          <template #default="scope">
            <template v-if="col.formatter">
              {{ col.formatter(scope.row, scope.column) }}
            </template>
            <template v-else-if="col.dictOptions && col.dictOptions.length > 0">
              {{ getDictLabel(col, scope.row[col.prop]) }}
            </template>
            <template v-else>
              {{ scope.row[col.prop] }}
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-wrapper" v-if="showPagination && total > 0">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          :page-sizes="pageSizes"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
      <div class="empty-tip" v-if="total === 0">
        <el-empty description="暂无数据" />
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.crud-table-container {
  width: 100%;
}

.search-bar {
  margin-bottom: 16px;
}

.search-card {
  .search-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 12px;

    &.search-header-collapsed {
      padding-bottom: 0;
      border-bottom: none;
      margin-bottom: 0;
    }
  }

  .search-title {
    font-weight: 600;
    font-size: 14px;
    color: #303133;
  }
}

.search-form {
  .search-input {
    width: 200px;
  }
}

.search-label-right {
  .el-form-item__label {
    text-align: right;
  }
}

.search-label-left {
  .el-form-item__label {
    text-align: left;
  }
}

.search-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.table-card {
  .pagination-wrapper {
    display: flex;
    justify-content: flex-end;
    padding-top: 16px;
    border-top: 1px solid #f0f0f0;
  }

  .empty-tip {
    padding: 40px 0;
  }
}
</style>
