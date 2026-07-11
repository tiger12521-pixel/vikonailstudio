import { ensureGalleryLoaded, initializeGalleryAdmin } from "./gallery-admin.js";

const API_URL = "/api/admin/promotions";
const DEFAULT_LINE_URL = "https://line.me/ti/p/6Tmd0fH59r";

const elements = {
	environmentNotice: document.querySelector("#environmentNotice"),
	promotionList: document.querySelector("#promotionList"),
	createButton: document.querySelector("#createPromotionButton"),
	dialog: document.querySelector("#promotionDialog"),
	form: document.querySelector("#promotionForm"),
	editorTitle: document.querySelector("#editorTitle"),
	closeButton: document.querySelector("#closeDialogButton"),
	cancelButton: document.querySelector("#cancelButton"),
	saveButton: document.querySelector("#saveButton"),
	formMessage: document.querySelector("#formMessage"),
	endDateField: document.querySelector("#endDateField"),
	isPermanent: document.querySelector("#isPermanent")
};

let promotions = [];

function isLocalEnvironment() {
	return ["localhost", "127.0.0.1"].includes(window.location.hostname);
}

function escapeText(value) {
	return String(value ?? "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

function formatDateRange(promotion) {
	if (promotion.isPermanent) {
		return "常駐活動";
	}

	const start = promotion.startDate || "未設定";
	const end = promotion.endDate || "未設定";
	return `${start} ～ ${end}`;
}

function renderPromotions() {
	if (!promotions.length) {
		elements.promotionList.innerHTML = '<p class="empty-message">目前尚未建立活動。</p>';
		return;
	}

	elements.promotionList.replaceChildren(...promotions.map((promotion) => {
		const article = document.createElement("article");
		const imageUrl = promotion.desktopImage || promotion.mobileImage || "";
		article.className = "promotion-item";
		article.innerHTML = `
			<div class="promotion-thumb">${imageUrl ? `<img src="${imageUrl}" alt="" />` : ""}</div>
			<div class="promotion-info">
				<h3>${escapeText(promotion.title)}</h3>
				<div class="promotion-meta">
					<span class="status-chip ${promotion.isActive ? "" : "is-hidden"}">${promotion.isActive ? "公開中" : "已隱藏"}</span>
					<span>${formatDateRange(promotion)}</span>
					<span>排序 ${promotion.sortOrder ?? 0}</span>
					${promotion.isPinned ? "<span>置頂</span>" : ""}
				</div>
			</div>
			<div class="promotion-actions">
				<button class="button" type="button" data-action="edit" data-id="${promotion.id}">編輯</button>
				<button class="button" type="button" data-action="toggle" data-id="${promotion.id}">${promotion.isActive ? "隱藏" : "顯示"}</button>
				<button class="button button-danger" type="button" data-action="delete" data-id="${promotion.id}">刪除</button>
			</div>
		`;
		return article;
	}));
}

async function request(url, options = {}) {
	const response = await fetch(url, {
		cache: "no-store",
		...options
	});

	if (!response.ok) {
		let message = `HTTP ${response.status}`;
		try {
			const data = await response.json();
			message = data.error || message;
		} catch {}
		throw new Error(message);
	}

	return response.status === 204 ? null : response.json();
}

async function loadPromotions() {
	try {
		const data = await request(`${API_URL}?t=${Date.now()}`);
		promotions = data.promotions || [];
		renderPromotions();
	} catch (error) {
		elements.promotionList.innerHTML = `<p class="empty-message">無法載入活動：${escapeText(error.message)}</p>`;
	}
}

function setFieldValue(name, value) {
	const field = elements.form.elements.namedItem(name);
	if (!field) return;
	if (field.type === "checkbox") field.checked = Boolean(value);
	else field.value = value ?? "";
}

function syncPermanentState() {
	const isPermanent = elements.isPermanent.checked;
	elements.endDateField.hidden = isPermanent;
	if (isPermanent) setFieldValue("endDate", "");
}

function openEditor(promotion = null) {
	elements.form.reset();
	elements.formMessage.textContent = "";
	elements.editorTitle.textContent = promotion ? "編輯活動" : "新增活動";
	setFieldValue("buttonText", "立即預約");
	setFieldValue("buttonUrl", DEFAULT_LINE_URL);
	setFieldValue("sortOrder", 0);
	setFieldValue("isActive", true);

	if (promotion) {
		["id", "title", "description", "imageAlt", "startDate", "endDate", "sortOrder", "buttonText", "buttonUrl", "isActive", "isPermanent", "isPinned"].forEach((name) => {
			setFieldValue(name, promotion[name]);
		});
	}

	syncPermanentState();
	elements.dialog.showModal();
}

function closeEditor() {
	elements.dialog.close();
}

async function savePromotion(event) {
	event.preventDefault();
	elements.formMessage.textContent = "";
	elements.saveButton.disabled = true;
	elements.saveButton.textContent = "儲存中...";

	try {
		const formData = new FormData(elements.form);
		formData.set("isActive", String(elements.form.isActive.checked));
		formData.set("isPermanent", String(elements.form.isPermanent.checked));
		formData.set("isPinned", String(elements.form.isPinned.checked));
		const id = formData.get("id");
		const method = id ? "PUT" : "POST";
		const url = id ? `${API_URL}/${encodeURIComponent(id)}` : API_URL;
		await request(url, { method, body: formData });
		closeEditor();
		await loadPromotions();
	} catch (error) {
		elements.formMessage.textContent = `儲存失敗：${error.message}`;
	} finally {
		elements.saveButton.disabled = false;
		elements.saveButton.textContent = "儲存並發布";
	}
}

async function handleListAction(event) {
	const button = event.target.closest("button[data-action]");
	if (!button) return;
	const promotion = promotions.find((item) => item.id === button.dataset.id);
	if (!promotion) return;

	if (button.dataset.action === "edit") {
		openEditor(promotion);
		return;
	}

	if (button.dataset.action === "toggle") {
		const formData = new FormData();
		Object.entries({ ...promotion, isActive: !promotion.isActive }).forEach(([key, value]) => {
			if (value !== null && value !== undefined) formData.set(key, String(value));
		});
		await request(`${API_URL}/${encodeURIComponent(promotion.id)}`, { method: "PUT", body: formData });
		await loadPromotions();
		return;
	}

	if (button.dataset.action === "delete") {
		if (!window.confirm(`確定刪除「${promotion.title}」嗎？此動作無法復原。`)) return;
		await request(`${API_URL}/${encodeURIComponent(promotion.id)}`, { method: "DELETE" });
		await loadPromotions();
	}
}

function initializeAdminTabs() {
	document.querySelectorAll("[data-admin-tab]").forEach((button) => {
		button.addEventListener("click", async () => {
			const tab = button.dataset.adminTab;
			document.querySelectorAll("[data-admin-tab]").forEach((item) => item.classList.toggle("is-active", item === button));
			document.querySelectorAll("[data-admin-panel]").forEach((panel) => { panel.hidden = panel.dataset.adminPanel !== tab; });
			if (tab === "gallery") await ensureGalleryLoaded();
		});
	});
}

function initialize() {
	if (isLocalEnvironment()) elements.environmentNotice.hidden = false;
	initializeAdminTabs();
	initializeGalleryAdmin();
	elements.createButton.addEventListener("click", () => openEditor());
	elements.closeButton.addEventListener("click", closeEditor);
	elements.cancelButton.addEventListener("click", closeEditor);
	elements.isPermanent.addEventListener("change", syncPermanentState);
	elements.form.addEventListener("submit", savePromotion);
	elements.promotionList.addEventListener("click", (event) => {
		handleListAction(event).catch((error) => window.alert(`操作失敗：${error.message}`));
	});
	loadPromotions();
}

initialize();
