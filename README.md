# Vue3 CRUD List Component

一个基于 Vue3 + TypeScript + Element Plus 的配置化 CRUD 列表组件。

## 功能特性

### 🔍 搜索功能

- **配置化搜索**：通过列配置自动生成搜索表单
- **多种搜索类型**：
  - `input` - 输入框
  - `select` - 下拉选择
  - `date` - 日期选择
  - `daterange` - 日期范围选择
  - `number` - 数字输入
- **日期范围自动补时**：开始时间自动补 `00:00:00`，结束时间自动补 `23:59:59`
- **自定义格式**：支持配置日期格式
- **搜索字段对齐**：支持 label 和输入框内容的对齐方式配置

### 📊 表格功能

- **配置化列定义**：通过配置对象定义列
- **字典映射**：支持 `dictOptions` 自动映射显示值（如 1 → 在读，2 → 休学，3 → 毕业）
- **自定义格式化**：支持 `formatter` 函数自定义单元格显示
- **列显隐控制**：通过 `isShow` 控制列是否在列表中展示
- **排序支持**：支持 `sortable` 开启列排序
- **对齐方式**：支持 `align` 配置列内容对齐

### 📄 分页功能

- **内置分页组件**：自动生成分页
- **自定义每页条数**：通过 `pageSizes` 配置可选条数
- **分页显隐控制**：通过 `showPagination` 控制分页是否显示

### 🎨 布局配置

- **搜索按钮位置**：`inline`（同行）或 `block`（下方）
- **搜索展开/收起**：支持搜索区域的展开收起

## 技术栈

- Vue 3 + Composition API
- TypeScript
- Element Plus
- Vite

## 快速开始

### 安装依赖

```bash
npm install element-plus
```

### 基础使用

```vue
<template>
  <CrudTable
    :columns="columns"
    :data="tableData"
    :total="total"
    :loading="loading"
    @search="handleSearch"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import CrudTable, { type TableColumn } from "@/components/CrudTable.vue";

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
    isSearch: true,
    searchType: "input",
  },
  {
    prop: "gender",
    label: "性别",
    isSearch: true,
    searchType: "select",
    searchOptions: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
    dictOptions: [
      { label: "男", value: "male" },
      { label: "女", value: "female" },
    ],
  },
  {
    prop: "age",
    label: "年龄",
    isSearch: true,
    searchType: "number",
  },
  {
    prop: "createTime",
    label: "创建时间",
    isSearch: true,
    searchType: "daterange",
  },
]);

const handleSearch = (params: any) => {
  console.log("搜索参数:", params);
  // 调用接口获取数据
};
</script>
```

## 配置说明

### TableColumn 配置项

#### 列表展示配置

| 属性          | 类型                            | 默认值   | 说明             |
| ------------- | ------------------------------- | -------- | ---------------- |
| `prop`        | `string`                        | 必填     | 字段名           |
| `label`       | `string`                        | 必填     | 列标签           |
| `width`       | `string \| number`              | -        | 列宽度           |
| `align`       | `'left' \| 'center' \| 'right'` | `'left'` | 列内容对齐       |
| `sortable`    | `boolean`                       | `false`  | 是否支持排序     |
| `isShow`      | `boolean`                       | `true`   | 是否在列表展示   |
| `formatter`   | `function`                      | -        | 自定义格式化函数 |
| `dictOptions` | `Array`                         | -        | 字典映射选项     |
| `remark`      | `string`                        | -        | 字段备注         |

#### 搜索配置

| 属性                | 类型      | 默认值         | 说明             |
| ------------------- | --------- | -------------- | ---------------- |
| `isSearch`          | `boolean` | `false`        | 是否作为搜索条件 |
| `searchType`        | `string`  | `'input'`      | 搜索控件类型     |
| `searchOptions`     | `Array`   | -              | 下拉选项列表     |
| `searchPlaceholder` | `string`  | -              | 占位符           |
| `searchAlign`       | `string`  | `'left'`       | 搜索框内容对齐   |
| `searchLabelAlign`  | `string`  | `'right'`      | 搜索标签对齐     |
| `searchDateFormat`  | `string`  | `'YYYY-MM-DD'` | 日期格式         |
| `searchDateAddTime` | `boolean` | `true`         | 是否自动补时     |

### Props 配置

| 属性                   | 类型                  | 默认值           | 说明         |
| ---------------------- | --------------------- | ---------------- | ------------ |
| `columns`              | `TableColumn[]`       | 必填             | 列配置       |
| `data`                 | `any[]`               | 必填             | 表格数据     |
| `total`                | `number`              | 必填             | 总条数       |
| `loading`              | `boolean`             | `false`          | 加载状态     |
| `pageSizes`            | `number[]`            | `[10,20,50,100]` | 每页条数选项 |
| `showPagination`       | `boolean`             | `true`           | 是否显示分页 |
| `searchButtonPosition` | `'inline' \| 'block'` | `'inline'`       | 搜索按钮位置 |

## Events

| 事件名        | 参数                            | 说明                               |
| ------------- | ------------------------------- | ---------------------------------- |
| `search`      | `(params: Record<string, any>)` | 搜索时触发，返回搜索参数和分页信息 |
| `update:page` | `(page: number)`                | 页码变更时触发                     |
| `update:size` | `(size: number)`                | 每页条数变更时触发                 |

## 项目结构

```
src/
├── components/
│   ├── CrudTable.vue    # CRUD 列表组件
│   └── TableDemo.vue    # 使用示例
├── constants/
│   └── dict.ts          # 字典常量配置
└── App.vue
```

## License

MIT
