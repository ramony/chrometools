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
   - react-beautiful-dnd: 拖拽排序
   - react-colorful: 颜色选择器

3. 项目结构
   - /src
     - /components
       - /ImageEffects
         - ImageEffectsTool.jsx: 主组件
         - ImageEffects.jsx: 基础特效
         - AdvancedEffects.jsx: 高级特效
         - EffectPresets.jsx: 预设管理
         - BatchProcessor.jsx: 批量处理
         - effectAlgorithms.js: 特效算法
         - utils.js: 工具函数
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

4. 图片特效工具
   - 基础特效处理：
     - 黑白效果：经典黑白图片转换
     - 复古/怀旧：温暖复古风格效果
     - 模糊：可调节的模糊效果
     - 亮度调节：图片明暗度调整
     - 对比度调节：增强或减弱对比度
     - 饱和度调节：色彩饱和度控制
   
   - 高级特效处理：
     - 锐化：增强图片细节和边缘
     - 浮雕：创建浮雕艺术效果
     - 噪点：添加随机噪点效果
     - 晕影：边缘渐变暗效果
     - 色调分离：创意色彩分离效果
     - 马赛克：像素化马赛克效果
     - 色彩平衡：RGB通道独立调节
     - 色调映射：高级色调控制
   
   - 特效预设功能：
     - 内置预设效果组合
     - 自定义预设保存
     - 预设收藏管理
     - 预设分类管理
     - 预设实时预览
     - 一键应用预设
   
   - 批量处理功能：
     - 多图片同时导入
     - 特效批量应用
     - 处理进度显示
     - 可中断处理过程
     - 批量导出设置
     - 自动文件命名
   
   - 图片优化功能：
     - 智能图片压缩
     - 渐进式加载
     - 内存使用优化
     - 大图片处理优化
     - 格式自动转换
   
   - 用户体验功能：
     - 实时预览效果
     - 原图对比功能
     - 参数精确调节
     - 撤销/重做支持
     - 拖放文件支持
     - 键盘快捷键
     - 处理历史记录
   
   - 技术特点：
     - 使用 Canvas API 处理图片
     - WebGL 加速（计划中）
     - Web Worker 多线程处理
     - 内存优化算法
     - 高性能图片处理
     - 渐进式图片加载

   - 使用限制：
     - 最大支持 10MB 图片文件
     - 支持 JPG、PNG、WebP 格式
     - 最大图片尺寸 8192x8192 像素
     - 批量处理最多 50 张图片

5. 数据表格（开发中）
   - JSON 数据可视化
   - 表格展示
   - 数据筛选和排序

6. 图表分析（计划中）
   - 数据可视化
   - 多种图表类型
   - 自定义配置

7. 时间轴（计划中）
   - 时间数据可视化
   - 交互式时间轴
   - 自定义样式

8. Markdown编辑器
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
- 支持深色模式
- 图片处理限制：
  - 最大支持 10MB 图片文件
  - 支持 JPG、PNG、WebP 格式
  - 最大图片尺寸 8192x8192 像素
  - 批量处理最多 50 张图片