/**
 * 字典常量配置文件
 * 统一管理所有下拉选项和字典映射
 * 实际项目中可从后端接口获取
 */

export const DICT_OPTIONS = {
  gender: [
    { label: "男", value: "male" },
    { label: "女", value: "female" },
  ],
  status: [
    { label: "启用", value: "true" },
    { label: "禁用", value: "false" },
  ],
  xxzt: [
    { label: "在读", value: "1" },
    { label: "休学", value: "2" },
    { label: "毕业", value: "3" },
  ],
};

export type DictKey = keyof typeof DICT_OPTIONS;
