class ImageProcessor {
  static async loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  static createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  static async generateThumbnail(imageUrl, maxSize = 100) {
    const img = await this.loadImage(imageUrl);
    const scale = Math.min(maxSize / img.width, maxSize / img.height);
    const canvas = this.createCanvas(
      Math.round(img.width * scale),
      Math.round(img.height * scale)
    );
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
  }

  static async compressImage(file, options = {}) {
    const {
      maxWidth = 2048,
      maxHeight = 2048,
      quality = 0.8,
      format = 'image/jpeg'
    } = options;

    const img = await this.loadImage(URL.createObjectURL(file));
    let width = img.width;
    let height = img.height;

    // 计算缩放比例
    if (width > maxWidth || height > maxHeight) {
      const scale = Math.min(maxWidth / width, maxHeight / height);
      width *= scale;
      height *= scale;
    }

    const canvas = this.createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob),
        format,
        quality
      );
    });
  }

  static async applyWatermark(imageUrl, text) {
    const img = await this.loadImage(imageUrl);
    const canvas = this.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    // 绘制原图
    ctx.drawImage(img, 0, 0);

    // 设置水印样式
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '24px Arial';
    ctx.rotate(-Math.PI / 6);

    // 重复绘制水印
    const textWidth = ctx.measureText(text).width;
    const gap = textWidth + 50;
    for (let y = -img.height; y < img.height * 2; y += gap) {
      for (let x = -img.width; x < img.width * 2; x += gap) {
        ctx.fillText(text, x, y);
      }
    }

    return canvas.toDataURL();
  }

  static getImageInfo(imageUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          size: imageUrl.length * 0.75, // 近似大小（base64）
        });
      };
      img.src = imageUrl;
    });
  }

  static async rotateImage(imageUrl, angle) {
    const img = await this.loadImage(imageUrl);
    const canvas = this.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((angle * Math.PI) / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);

    return canvas.toDataURL();
  }

  static async flipImage(imageUrl, horizontal = true) {
    const img = await this.loadImage(imageUrl);
    const canvas = this.createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    if (horizontal) {
      ctx.scale(-1, 1);
      ctx.drawImage(img, -img.width, 0);
    } else {
      ctx.scale(1, -1);
      ctx.drawImage(img, 0, -img.height);
    }

    return canvas.toDataURL();
  }

  static async cropImage(imageUrl, cropArea) {
    const img = await this.loadImage(imageUrl);
    const canvas = this.createCanvas(cropArea.width, cropArea.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      img,
      cropArea.x, cropArea.y,
      cropArea.width, cropArea.height,
      0, 0,
      cropArea.width, cropArea.height
    );

    return canvas.toDataURL();
  }

  static downloadImage(dataUrl, filename) {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export default ImageProcessor; 