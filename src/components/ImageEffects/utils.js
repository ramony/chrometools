// 图片处理工具函数
export const imageUtils = {
  // 图片压缩
  compressImage: (file, maxSize = 1024 * 1024) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // 如果图片太大，按比例缩小
          const maxDimension = 2048;
          if (width > maxDimension || height > maxDimension) {
            const ratio = Math.min(maxDimension / width, maxDimension / height);
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // 压缩质量
          let quality = 0.9;
          let compressedData = canvas.toDataURL('image/jpeg', quality);

          // 如果文件仍然太大，继续压缩
          while (compressedData.length > maxSize && quality > 0.1) {
            quality -= 0.1;
            compressedData = canvas.toDataURL('image/jpeg', quality);
          }

          resolve(compressedData);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // 渐进式加载
  createProgressiveImage: (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        // 创建低质量预览
        const scale = 0.1;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.width * scale;
        tempCanvas.height = img.height * scale;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

        // 渐进式提高质量
        const steps = [0.1, 0.3, 0.5, 0.7, 1.0];
        let currentStep = 0;

        const loadNextStep = () => {
          if (currentStep >= steps.length) {
            resolve(canvas.toDataURL());
            return;
          }

          ctx.drawImage(
            tempCanvas,
            0, 0, tempCanvas.width, tempCanvas.height,
            0, 0, canvas.width, canvas.height
          );

          const quality = steps[currentStep];
          const blurRadius = (1 - quality) * 10;
          if (blurRadius > 0) {
            ctx.filter = `blur(${blurRadius}px)`;
          }

          currentStep++;
          requestAnimationFrame(loadNextStep);
        };

        loadNextStep();
      };
      img.src = url;
    });
  },

  // 内存优化
  optimizeMemory: (canvas) => {
    const maxSize = 4096 * 4096 * 4; // 最大内存使用量
    const currentSize = canvas.width * canvas.height * 4;

    if (currentSize > maxSize) {
      const ratio = Math.sqrt(maxSize / currentSize);
      const newWidth = Math.floor(canvas.width * ratio);
      const newHeight = Math.floor(canvas.height * ratio);

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = newWidth;
      tempCanvas.height = newHeight;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

      canvas.width = newWidth;
      canvas.height = newHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(tempCanvas, 0, 0);
    }
  },

  // 图片格式检查
  validateImage: (file) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    return new Promise((resolve, reject) => {
      if (!validTypes.includes(file.type)) {
        reject(new Error('不支持的图片格式，请使用 JPG、PNG 或 WebP 格式'));
        return;
      }

      if (file.size > maxSize) {
        reject(new Error('图片大小不能超过 10MB'));
        return;
      }

      const img = new Image();
      img.onload = () => {
        if (img.width > 8192 || img.height > 8192) {
          reject(new Error('图片尺寸过大，最大支持 8192x8192 像素'));
          return;
        }
        resolve(true);
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  },

  // 处理进度计算
  calculateProgress: (current, total, steps) => {
    const stepSize = 100 / steps;
    const progress = (current / total) * stepSize;
    return Math.min(100, progress);
  },

  // 文件名生成
  generateFileName: (originalName, effect, timestamp = Date.now()) => {
    const name = originalName.replace(/\.[^/.]+$/, '');
    return `${name}_${effect}_${timestamp}`;
  }
};

export default imageUtils; 