// 导入特效算法
import { effectAlgorithms } from './effectAlgorithms';

// 处理图片的 Worker
self.onmessage = function (e) {
  const { imageData, effect, params } = e.data;

  try {
    // 创建离屏 Canvas
    const canvas = new OffscreenCanvas(imageData.width, imageData.height);
    const ctx = canvas.getContext('2d');

    // 绘制原始图片数据
    ctx.putImageData(imageData, 0, 0);

    // 应用特效
    if (effectAlgorithms[effect]) {
      effectAlgorithms[effect](ctx, null, params);
    }

    // 获取处理后的图片数据
    const resultImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // 返回处理结果
    self.postMessage({
      success: true,
      imageData: resultImageData
    }, [resultImageData.data.buffer]);
  } catch (error) {
    self.postMessage({
      success: false,
      error: error.message
    });
  }
}; 