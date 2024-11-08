// 高级特效算法实现
export const effectAlgorithms = {
  // 锐化效果
  sharpen: (ctx, img, params) => {
    const { intensity = 50 } = params;
    const kernel = [
      0, -1, 0,
      -1, 4 + intensity / 25, -1,
      0, -1, 0
    ];
    applyConvolution(ctx, kernel);
  },

  // 浮雕效果
  emboss: (ctx, img, params) => {
    const { intensity = 50, angle = 45 } = params;
    const radian = angle * Math.PI / 180;
    const kernel = [
      Math.cos(radian) * intensity / 50, 0, 0,
      0, 1, 0,
      0, 0, -Math.cos(radian) * intensity / 50
    ];
    applyConvolution(ctx, kernel);
  },

  // 噪点效果
  noise: (ctx, img, params) => {
    const { amount = 20, size = 1 } = params;
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const factor = amount / 100;

    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * factor * 255 * size;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }

    ctx.putImageData(imageData, 0, 0);
  },

  // 晕影效果
  vignette: (ctx, img, params) => {
    const { intensity = 50, size = 50 } = params;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const radius = Math.sqrt(w * w + h * h) / 2;
    const centerX = w / 2;
    const centerY = h / 2;

    const gradient = ctx.createRadialGradient(
      centerX, centerY, radius * (1 - size / 100),
      centerX, centerY, radius
    );

    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, `rgba(0,0,0,${intensity / 100})`);

    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
  },

  // 色调分离效果
  colorSplit: (ctx, img, params) => {
    const { amount = 50, hue = 180 } = params;
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const factor = amount / 100;

    for (let i = 0; i < data.length; i += 4) {
      const hsv = rgbToHsv(data[i], data[i + 1], data[i + 2]);
      hsv.h = (hsv.h + hue) % 360;
      hsv.s *= factor;
      const rgb = hsvToRgb(hsv.h, hsv.s, hsv.v);
      data[i] = rgb.r;
      data[i + 1] = rgb.g;
      data[i + 2] = rgb.b;
    }

    ctx.putImageData(imageData, 0, 0);
  },

  // 马赛克效果
  mosaic: (ctx, img, params) => {
    const { size = 10 } = params;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const blockSize = Math.max(1, Math.floor(size));

    for (let y = 0; y < h; y += blockSize) {
      for (let x = 0; x < w; x += blockSize) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        ctx.fillStyle = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
        ctx.fillRect(x, y, blockSize, blockSize);
      }
    }
  },

  // 色彩平衡
  colorBalance: (ctx, img, params) => {
    const { red = 0, green = 0, blue = 0 } = params;
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.min(255, Math.max(0, data[i] + red));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + green));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + blue));
    }

    ctx.putImageData(imageData, 0, 0);
  },

  // 色调映射
  tonemap: (ctx, img, params) => {
    const { exposure = 0, contrast = 0 } = params;
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const data = imageData.data;
    const expFactor = Math.pow(2, exposure / 100);
    const contrastFactor = (contrast + 100) / 100;

    for (let i = 0; i < data.length; i += 4) {
      for (let j = 0; j < 3; j++) {
        let value = data[i + j] / 255;
        value = value * expFactor;
        value = Math.pow(value, contrastFactor);
        data[i + j] = Math.min(255, Math.max(0, value * 255));
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }
};

// 辅助函数：卷积运算
const applyConvolution = (ctx, kernel) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const result = new Uint8ClampedArray(data.length);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const px = (y * w + x) * 4;
      let r = 0, g = 0, b = 0;

      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * w + (x + kx)) * 4;
          const kernelIdx = (ky + 1) * 3 + (kx + 1);

          if (idx >= 0 && idx < data.length) {
            r += data[idx] * kernel[kernelIdx];
            g += data[idx + 1] * kernel[kernelIdx];
            b += data[idx + 2] * kernel[kernelIdx];
          }
        }
      }

      result[px] = Math.min(255, Math.max(0, r));
      result[px + 1] = Math.min(255, Math.max(0, g));
      result[px + 2] = Math.min(255, Math.max(0, b));
      result[px + 3] = data[px + 3];
    }
  }

  imageData.data.set(result);
  ctx.putImageData(imageData, 0, 0);
};

// 辅助函数：RGB转HSV
const rgbToHsv = (r, g, b) => {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;

  let h = 0;
  const s = max === 0 ? 0 : diff / max;
  const v = max;

  if (diff !== 0) {
    switch (max) {
      case r:
        h = 60 * ((g - b) / diff + (g < b ? 6 : 0));
        break;
      case g:
        h = 60 * ((b - r) / diff + 2);
        break;
      case b:
        h = 60 * ((r - g) / diff + 4);
        break;
    }
  }

  return { h, s, v };
};

// 辅助函数：HSV转RGB
const hsvToRgb = (h, s, v) => {
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;

  let r = 0, g = 0, b = 0;

  if (h >= 0 && h < 60) {
    [r, g, b] = [c, x, 0];
  } else if (h >= 60 && h < 120) {
    [r, g, b] = [x, c, 0];
  } else if (h >= 120 && h < 180) {
    [r, g, b] = [0, c, x];
  } else if (h >= 180 && h < 240) {
    [r, g, b] = [0, x, c];
  } else if (h >= 240 && h < 300) {
    [r, g, b] = [x, 0, c];
  } else {
    [r, g, b] = [c, 0, x];
  }

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255)
  };
};

export {
  applyConvolution,
  rgbToHsv,
  hsvToRgb
}; 