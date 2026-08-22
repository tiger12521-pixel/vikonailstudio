const $ = (selector) => document.querySelector(selector);

const elements = {
	mainInput: $("#retouchMainImage"),
	thumbInput: $("#retouchThumbImage"),
	mainPreview: $("#retouchMainPreview"),
	thumbPreview: $("#retouchThumbPreview"),
	create: $("#createRetouchButton"),
	download: $("#downloadRetouchButton"),
	send: $("#sendRetouchToGalleryButton"),
	message: $("#retouchMessage"),
	output: $("#retouchOutput"),
	testBadge: $("#retouchTestBadge"),
	watermarkX: $("#retouchWatermarkX"),
	watermarkY: $("#retouchWatermarkY")
};

const state = {
	main: null,
	thumb: null,
	mainImage: null,
	thumbImage: null,
	mainUrl: "",
	thumbUrl: "",
	detailPosition: "top-right",
	detailCanvasX: 100,
	detailCanvasY: 0,
	detailScale: 1,
	detailX: 50,
	detailY: 50,
	watermarkPosition: "bottom-left",
	watermarkStyle: "hero-script",
	watermarkAngle: 0,
	outputFile: null
};

let detailControls;

function setMessage(message, error = false) {
	elements.message.textContent = message;
	elements.message.style.color = error ? "var(--color-danger)" : "var(--color-muted)";
}

function loadImage(file) {
	return new Promise((resolve, reject) => {
		const image = new Image();
		const url = URL.createObjectURL(file);
		image.onload = () => {
			URL.revokeObjectURL(url);
			resolve(image);
		};
		image.onerror = () => reject(new Error("圖片無法讀取，請使用 JPG、PNG 或 WebP。"));
		image.src = url;
	});
}

async function updatePreview(input, preview, key) {
	const file = input.files?.[0];
	if (!file) return;

	if (state[`${key}Url`]) URL.revokeObjectURL(state[`${key}Url`]);
	state[key] = file;
	state[`${key}Url`] = URL.createObjectURL(file);
	preview.src = state[`${key}Url`];
	preview.hidden = false;
	state.outputFile = null;
	elements.download.disabled = true;
	elements.send.disabled = true;

	try {
		const image = await loadImage(file);
		if (state[key] !== file) return;
		state[`${key}Image`] = image;
		renderLivePreview();
	} catch (error) {
		setMessage(error.message, true);
	}
}

function drawDetail(ctx, image, width, height) {
	const size = Math.round(Math.min(width, height) * 0.28);
	const margin = Math.round(size * 0.1);
	const x = margin + (width - size - margin * 2) * state.detailCanvasX / 100;
	const y = margin + (height - size - margin * 2) * state.detailCanvasY / 100;
	const baseScale = Math.max(size / image.naturalWidth, size / image.naturalHeight);
	const scale = baseScale * state.detailScale;
	const sourceWidth = size / scale;
	const sourceHeight = size / scale;
	const maxX = Math.max(0, image.naturalWidth - sourceWidth);
	const maxY = Math.max(0, image.naturalHeight - sourceHeight);
	const sourceX = maxX * state.detailX / 100;
	const sourceY = maxY * state.detailY / 100;

	ctx.save();
	ctx.beginPath();
	ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
	ctx.clip();
	ctx.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, size, size);
	ctx.restore();

	ctx.save();
	ctx.strokeStyle = "rgba(255,255,255,.94)";
	ctx.lineWidth = Math.max(6, size * 0.027);
	ctx.beginPath();
	ctx.arc(x + size / 2, y + size / 2, size / 2 - ctx.lineWidth / 2, 0, Math.PI * 2);
	ctx.stroke();
	ctx.restore();
}

function drawWatermark(ctx, width, height) {
	const size = Math.max(18, Math.round(Math.min(width, height) * 0.027));
	const styles = {
		"hero-script": { label: "Nail Story", sub: "NAIL STUDIO", font: `400 ${size * 2.25}px "Allura", cursive`, width: size * 9.2, height: size * 3.6 },
		"hero-cn": { label: "薇可美甲工作坊", sub: "指尖的故事，從這裡開始", font: `600 ${size * 1.42}px "Noto Serif TC", serif`, width: size * 8.9, height: size * 3.1 }
	};
	const style = styles[state.watermarkStyle];

	ctx.save();
	const x = style.width / 2 + (width - style.width) * Number(elements.watermarkX.value) / 100;
	const y = style.height / 2 + (height - style.height) * Number(elements.watermarkY.value) / 100;
	ctx.translate(x, y);
	ctx.rotate(state.watermarkAngle * Math.PI / 180);
	ctx.fillStyle = "rgba(255,255,255,.92)";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.font = style.font;
	ctx.fillText(style.label, 0, -size * 0.25);
	ctx.font = `600 ${size * 0.48}px "Noto Sans TC", sans-serif`;
	ctx.fillText(style.sub, 0, size * 0.95);
	if (state.watermarkStyle === "hero-script") {
		ctx.strokeStyle = "rgba(255,255,255,.75)";
		ctx.lineWidth = Math.max(1, size * 0.04);
		ctx.beginPath();
		ctx.moveTo(-style.width * 0.42, size * 0.95);
		ctx.lineTo(-style.width * 0.17, size * 0.95);
		ctx.moveTo(style.width * 0.17, size * 0.95);
		ctx.lineTo(style.width * 0.42, size * 0.95);
		ctx.stroke();
	}
	ctx.restore();
}

function drawTestBadge(ctx, width, height) {
	if (!elements.testBadge.checked) return;
	const size = Math.max(18, Math.round(Math.min(width, height) * 0.026));
	const label = "測試示意・非同組作品";
	ctx.save();
	ctx.font = `700 ${size}px "Noto Sans TC", sans-serif`;
	const boxWidth = ctx.measureText(label).width + size * 2;
	const boxHeight = size * 2.2;
	const x = (width - boxWidth) / 2;
	const y = height - boxHeight - size * 1.25;
	ctx.fillStyle = "rgba(167,71,71,.88)";
	ctx.beginPath();
	ctx.roundRect(x, y, boxWidth, boxHeight, boxHeight / 2);
	ctx.fill();
	ctx.fillStyle = "#fff";
	ctx.textBaseline = "middle";
	ctx.fillText(label, x + size, y + boxHeight / 2);
	ctx.restore();
}

function composeCanvas(maxSize) {
	const main = state.mainImage;
	const thumb = state.thumbImage;
	if (!main || !thumb) return null;

	const scale = Math.min(1, maxSize / Math.max(main.naturalWidth, main.naturalHeight));
	const canvas = document.createElement("canvas");
	canvas.width = Math.round(main.naturalWidth * scale);
	canvas.height = Math.round(main.naturalHeight * scale);
	const ctx = canvas.getContext("2d");
	ctx.drawImage(main, 0, 0, canvas.width, canvas.height);
	drawDetail(ctx, thumb, canvas.width, canvas.height);
	drawWatermark(ctx, canvas.width, canvas.height);
	drawTestBadge(ctx, canvas.width, canvas.height);
	return canvas;
}

function renderLivePreview() {
	const canvas = composeCanvas(1200);
	if (!canvas) return;
	elements.output.src = canvas.toDataURL("image/jpeg", 0.9);
	elements.output.hidden = false;
	setMessage("預覽已更新；滿意後再按「製作作品照」下載高解析成品。");
}

async function createOutput() {
	if (!state.mainImage || !state.thumbImage) return setMessage("請先上傳主圖與拇指特寫。", true);
	elements.create.disabled = true;
	setMessage("正在製作高解析作品照…");
	try {
		const canvas = composeCanvas(2400);
		const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.94));
		if (!blob) throw new Error("無法建立成品圖片。請再試一次。");
		state.outputFile = new File([blob], `nail-story-${Date.now()}.jpg`, { type: "image/jpeg" });
		elements.output.src = URL.createObjectURL(blob);
		elements.output.hidden = false;
		elements.download.disabled = false;
		elements.send.disabled = false;
		setMessage("高解析成品已完成；可下載或直接送到作品管理。");
	} catch (error) {
		setMessage(error.message, true);
	} finally {
		elements.create.disabled = false;
	}
}

function updateSliderLabels() {
	$("output[for=retouchWatermarkX]").textContent = Number(elements.watermarkX.value) < 40 ? "左" : Number(elements.watermarkX.value) > 60 ? "右" : "中";
	$("output[for=retouchWatermarkY]").textContent = Number(elements.watermarkY.value) < 40 ? "上" : Number(elements.watermarkY.value) > 60 ? "下" : "中";
	if (detailControls) {
		detailControls.scaleOutput.textContent = `${Number(detailControls.scale.value).toFixed(1)}×`;
		detailControls.xOutput.textContent = `${detailControls.x.value}%`;
		detailControls.yOutput.textContent = `${detailControls.y.value}%`;
		detailControls.canvasXOutput.textContent = `${detailControls.canvasX.value}%`;
		detailControls.canvasYOutput.textContent = `${detailControls.canvasY.value}%`;
	}
	if (watermarkAngleControl) watermarkAngleControl.output.textContent = `${watermarkAngleControl.input.value}°`;
}

function selectPosition(event) {
	const button = event.target.closest("button[data-position]");
	if (!button) return;
	const group = button.closest("[data-retouch-position]");
	state[`${group.dataset.retouchPosition}Position`] = button.dataset.position;
	group.querySelectorAll("button").forEach((item) => item.classList.toggle("is-selected", item === button));
	if (group.dataset.retouchPosition === "watermark") {
		const values = { "top-left": [0, 0], "top-right": [100, 0], "bottom-left": [0, 100], "bottom-right": [100, 100] };
		[elements.watermarkX.value, elements.watermarkY.value] = values[button.dataset.position];
		updateSliderLabels();
	}
	if (group.dataset.retouchPosition === "detail") {
		const values = { "top-left": [0, 0], "top-right": [100, 0], "bottom-left": [0, 100], "bottom-right": [100, 100] };
		[state.detailCanvasX, state.detailCanvasY] = values[button.dataset.position];
		detailControls.canvasX.value = state.detailCanvasX;
		detailControls.canvasY.value = state.detailCanvasY;
		updateSliderLabels();
	}
	renderLivePreview();
}

function selectWatermarkStyle(event) {
	const button = event.target.closest("button[data-style]");
	if (!button) return;
	state.watermarkStyle = button.dataset.style;
	button.closest("[data-watermark-style]").querySelectorAll("button").forEach((item) => item.classList.toggle("is-selected", item === button));
	renderLivePreview();
}

let watermarkAngleControl;

function configureWatermarkControls() {
	const styleOptions = $("[data-watermark-style]");
	styleOptions.innerHTML = `
		<button type="button" data-style="hero-script" class="is-selected"><em>Nail Story</em><span>首頁英文品牌字樣</span></button>
		<button type="button" data-style="hero-cn"><strong>薇可美甲工作坊</strong><span>首頁中文品牌字樣</span></button>`;

	const angleLabel = document.createElement("label");
	angleLabel.innerHTML = `角度 <input id="retouchWatermarkAngle" type="range" min="-30" max="30" step="1" value="0" /><output>0°</output>`;
	$(".watermark-sliders").append(angleLabel);
	watermarkAngleControl = { input: $("#retouchWatermarkAngle"), output: angleLabel.querySelector("output") };
	watermarkAngleControl.input.addEventListener("input", () => {
		state.watermarkAngle = Number(watermarkAngleControl.input.value);
		updateSliderLabels();
		renderLivePreview();
	});
}

function createDetailControls() {
	const fieldset = document.createElement("fieldset");
	fieldset.className = "retouch-detail-adjustments";
	fieldset.innerHTML = `
		<legend>拇指特寫微調</legend>
		<p>可放大並移動圓圈內的特寫；調整會立即顯示於下方成品示意圖。</p>
		<div class="retouch-detail-sliders">
			<label>圓圈左右 <input id="retouchDetailCanvasX" type="range" min="0" max="100" value="100" /><output>100%</output></label>
			<label>圓圈上下 <input id="retouchDetailCanvasY" type="range" min="0" max="100" value="0" /><output>0%</output></label>
			<label>縮放 <input id="retouchDetailScale" type="range" min="1" max="3" step="0.1" value="1" /><output>1.0×</output></label>
			<label>左右 <input id="retouchDetailX" type="range" min="0" max="100" value="50" /><output>50%</output></label>
			<label>上下 <input id="retouchDetailY" type="range" min="0" max="100" value="50" /><output>50%</output></label>
		</div>`;
	$(".retouch-controls").prepend(fieldset);
	detailControls = {
		scale: $("#retouchDetailScale"),
		x: $("#retouchDetailX"),
		y: $("#retouchDetailY"),
		canvasX: $("#retouchDetailCanvasX"),
		canvasY: $("#retouchDetailCanvasY"),
		canvasXOutput: fieldset.querySelectorAll("output")[0],
		canvasYOutput: fieldset.querySelectorAll("output")[1],
		scaleOutput: fieldset.querySelectorAll("output")[2],
		xOutput: fieldset.querySelectorAll("output")[3],
		yOutput: fieldset.querySelectorAll("output")[4]
	};
	[detailControls.scale, detailControls.x, detailControls.y, detailControls.canvasX, detailControls.canvasY].forEach((input) => input.addEventListener("input", () => {
		state.detailScale = Number(detailControls.scale.value);
		state.detailX = Number(detailControls.x.value);
		state.detailY = Number(detailControls.y.value);
		state.detailCanvasX = Number(detailControls.canvasX.value);
		state.detailCanvasY = Number(detailControls.canvasY.value);
		updateSliderLabels();
		renderLivePreview();
	}));
}

function downloadOutput() {
	if (!state.outputFile) return;
	const url = URL.createObjectURL(state.outputFile);
	const link = document.createElement("a");
	link.href = url;
	link.download = state.outputFile.name;
	link.click();
	setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function initializeRetouchTool({ openGalleryWithImage }) {
	createDetailControls();
	configureWatermarkControls();
	elements.mainInput.addEventListener("change", () => updatePreview(elements.mainInput, elements.mainPreview, "main"));
	elements.thumbInput.addEventListener("change", () => updatePreview(elements.thumbInput, elements.thumbPreview, "thumb"));
	document.querySelectorAll("[data-retouch-position]").forEach((group) => group.addEventListener("click", selectPosition));
	$("[data-watermark-style]").addEventListener("click", selectWatermarkStyle);
	[elements.watermarkX, elements.watermarkY].forEach((input) => input.addEventListener("input", () => {
		updateSliderLabels();
		renderLivePreview();
	}));
	elements.testBadge.addEventListener("change", renderLivePreview);
	updateSliderLabels();
	document.fonts?.ready.then(renderLivePreview);
	elements.create.addEventListener("click", createOutput);
	elements.download.addEventListener("click", downloadOutput);
	elements.send.addEventListener("click", () => {
		if (state.outputFile) openGalleryWithImage(state.outputFile);
	});
}
