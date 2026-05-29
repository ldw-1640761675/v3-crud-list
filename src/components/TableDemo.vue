<script setup lang="ts">
import { ref, onMounted } from "vue";
import CrudTable, { type TableColumn } from "./CrudTable.vue";
import { DICT_OPTIONS } from "../constants/dict";

const columns = ref<TableColumn[]>([
  {
    prop: "id",
    label: "ID",
    width: 80,
    align: "center",
  },
  {
    prop: "name",
    label: "姓名",
    width: 120,
    isSearch: true,
    searchType: "input",
  },
  {
    prop: "gender",
    label: "性别",
    width: 80,
    align: "center",
    isSearch: true,
    searchType: "select",
    searchOptions: DICT_OPTIONS.gender,
    dictOptions: DICT_OPTIONS.gender,
  },
  {
    prop: "age",
    label: "年龄",
    width: 80,
    align: "center",
    isSearch: true,
    searchType: "number",
  },
  {
    prop: "email",
    label: "邮箱",
    isSearch: true,
  },
  {
    prop: "createTime",
    label: "创建时间",
    width: 180,
    isSearch: true,
    searchType: "daterange",
  },
  {
    prop: "status",
    label: "状态",
    width: 100,
    align: "center",
    isSearch: true,
    searchType: "select",
    searchOptions: DICT_OPTIONS.status,
    dictOptions: DICT_OPTIONS.status,
  },
  {
    prop: "xxzt",
    label: "学习状态",
    width: 120,
    align: "center",
    isSearch: true,
    searchType: "select",
    searchOptions: DICT_OPTIONS.xxzt,
    dictOptions: DICT_OPTIONS.xxzt,
  },
]);

const tableData = ref<any[]>([]);
const total = ref(0);
const loading = ref(false);

const mockData = [
  {
    id: 1,
    name: "张三",
    gender: "male",
    age: 25,
    email: "zhangsan@example.com",
    createTime: "2024-01-15",
    status: true,
    xxzt: 1,
  },
  {
    id: 2,
    name: "李四",
    gender: "female",
    age: 30,
    email: "lisi@example.com",
    createTime: "2024-01-16",
    status: true,
    xxzt: 2,
  },
  {
    id: 3,
    name: "王五",
    gender: "male",
    age: 28,
    email: "wangwu@example.com",
    createTime: "2024-01-17",
    status: false,
    xxzt: 3,
  },
  {
    id: 4,
    name: "赵六",
    gender: "female",
    age: 22,
    email: "zhaoliu@example.com",
    createTime: "2024-01-18",
    status: true,
    xxzt: 1,
  },
  {
    id: 5,
    name: "钱七",
    gender: "male",
    age: 35,
    email: "qianqi@example.com",
    createTime: "2024-01-19",
    status: true,
    xxzt: 2,
  },
  {
    id: 6,
    name: "孙八",
    gender: "female",
    age: 26,
    email: "sunba@example.com",
    createTime: "2024-01-20",
    status: false,
    xxzt: 3,
  },
  {
    id: 7,
    name: "周九",
    gender: "male",
    age: 29,
    email: "zhoujiu@example.com",
    createTime: "2024-01-21",
    status: true,
    xxzt: 1,
  },
  {
    id: 8,
    name: "吴十",
    gender: "female",
    age: 31,
    email: "wushi@example.com",
    createTime: "2024-01-22",
    status: true,
    xxzt: 2,
  },
  {
    id: 9,
    name: "郑十一",
    gender: "male",
    age: 27,
    email: "zheng11@example.com",
    createTime: "2024-01-23",
    status: false,
    xxzt: 3,
  },
  {
    id: 10,
    name: "王十二",
    gender: "female",
    age: 24,
    email: "wang12@example.com",
    createTime: "2024-01-24",
    status: true,
    xxzt: 1,
  },
  {
    id: 11,
    name: "陈十三",
    gender: "male",
    age: 32,
    email: "chen13@example.com",
    createTime: "2024-01-25",
    status: true,
    xxzt: 2,
  },
  {
    id: 12,
    name: "刘十四",
    gender: "female",
    age: 23,
    email: "liu14@example.com",
    createTime: "2024-01-26",
    status: true,
    xxzt: 3,
  },
];

const fetchData = (params: Record<string, any>) => {
  loading.value = true;
  setTimeout(() => {
    let filtered = [...mockData];

    if (params.name) {
      filtered = filtered.filter((item) => item.name.includes(params.name));
    }
    if (params.gender !== undefined && params.gender !== null) {
      filtered = filtered.filter((item) => item.gender === params.gender);
    }
    if (params.age) {
      filtered = filtered.filter((item) => item.age === params.age);
    }
    if (params.email) {
      filtered = filtered.filter((item) => item.email.includes(params.email));
    }
    if (params.createTime && params.createTime.length === 2) {
      const startDate = new Date(params.createTime[0]);
      const endDate = new Date(params.createTime[1]);
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createTime);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }
    if (params.status !== undefined && params.status !== null) {
      filtered = filtered.filter(
        (item) => String(item.status) === params.status,
      );
    }
    if (params.xxzt !== undefined && params.xxzt !== null) {
      filtered = filtered.filter((item) => String(item.xxzt) === params.xxzt);
    }

    total.value = filtered.length;
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    tableData.value = filtered.slice(start, end);
    loading.value = false;
  }, 500);
};

onMounted(() => {
  fetchData({ page: 1, pageSize: 10 });
});

const handleSearch = (params: Record<string, any>) => {
  fetchData(params);
};
</script>

<template>
  <div class="table-demo">
    <h2>CRUD 列表组件示例</h2>
    <CrudTable
      :columns="columns"
      :data="tableData"
      :total="total"
      :loading="loading"
      :show-pagination="false"
      :page-sizes="[10, 20, 50]"
      @search="handleSearch"
    />
  </div>
</template>

<style scoped>
.table-demo {
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
  font-size: 18px;
  color: #303133;
}
</style>
