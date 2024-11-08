# 开发工具集 Chrome 插件

## 技术架构
1. 基础框架
   - React 18
   - Material-UI (MUI) 5
   - Vite
   - Chrome Extension Manifest V3

2. 主要依赖
   - @mui/material & @mui/icons-material: UI组件库
   - framer-motion: 动画效果
   - js-yaml: JSON和YAML转换
   - react-image-crop: 图片裁剪
   - qrcode.react: 二维码生成

3. 项目结构
   - /src
     - /components: 功能组件
     - styles.js: 公共样式
     - App.jsx: 主应用
     - index.jsx: 入口文件
   - /public: 静态资源
   - vite.config.js: Vite配置
   - manifest.json: Chrome插件配置

## 功能模块

1. JSON-YAML 转换器
   - JSON 和 YAML 格式互转
   - 实时格式校验
   - 格式化功能
   - 复制到剪贴板
   - 支持内容交换

2. 图片处理工具
   - 图片裁剪（支持多种宽高比）
   - 导出尺寸自定义
   - 支持 JPG/PNG 格式
   - JPG 质量调节
   - 实时预览
   - 自适应布局

3. 二维码生成器
   - 支持文本/URL转二维码
   - 自定义二维码尺寸
   - 自定义前景色/背景色
   - 可选纠错级别
   - 支持导出为图片
   - 支持复制到剪贴板

4. 数据表格（开发中）
   - JSON 数据可视化
   - 表格展示
   - 数据筛选和排序

5. 图表分析（计划中）
   - 数据可视化
   - 多种图表类型
   - 自定义配置

6. 时间轴（计划中）
   - 时间数据可视化
   - 交互式时间轴
   - 自定义样式

7. Markdown编辑器
   - 实时预览（支持GitHub风格Markdown）
   - 分屏编辑和预览
   - 导出多种格式：
     - PNG/JPG 图片
     - PDF 文档
     - HTML 网页
   - 自定义导出样式和布局
   - 代码块语法高亮
   - 表格和列表支持
   - 图片显示支持
   - 复制到剪贴板
   - 优化的滚动条体验

## 使用说明
1. 开发环境   ```bash
   npm install    # 安装依赖
   npm run dev    # 启动开发服务器   ```

2. 构建插件   ```bash
   npm run build  # 构建Chrome插件   ```

3. 安装插件
   - 打开 Chrome 扩展管理页面 (chrome://extensions/)
   - 开启开发者模式
   - 加载已解压的扩展程序
   - 选择 dist 目录

## 注意事项
- 插件使用 Chrome Extension Manifest V3
- 所有功能模块都支持响应式布局
- 使用统一的设计风格和主题
- 支持深色模式（计划中）