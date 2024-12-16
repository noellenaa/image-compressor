// 获取DOM元素
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const previewArea = document.getElementById('previewArea');
const originalImage = document.getElementById('originalImage');
const compressedImage = document.getElementById('compressedImage');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('quality');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 拖拽上传
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImage(file);
    }
});

// 点击上传
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImage(file);
    }
});

// 处理图片
function handleImage(file) {
    // 显示原图大小
    originalSize.textContent = formatFileSize(file.size);
    
    // 读取并显示原图
    const reader = new FileReader();
    reader.onload = (e) => {
        originalImage.src = e.target.result;
        compressImage(e.target.result, qualitySlider.value / 100);
    };
    reader.readAsDataURL(file);
    
    // 显示预览区域
    previewArea.style.display = 'block';
}

// 压缩图片
function compressImage(base64, quality) {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置canvas尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        
        // 绘制图片
        ctx.drawImage(img, 0, 0);
        
        // 压缩图片
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        compressedImage.src = compressedBase64;
        
        // 计算压缩后大小
        const compressedSize = Math.round((compressedBase64.length * 3) / 4);
        document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
    };
}

// 质量滑块事件
qualitySlider.addEventListener('input', (e) => {
    const quality = e.target.value;
    qualityValue.textContent = quality + '%';
    if (originalImage.src) {
        compressImage(originalImage.src, quality / 100);
    }
});

// 下载按钮事件
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed_image.jpg';
    link.href = compressedImage.src;
    link.click();
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 