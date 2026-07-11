/* #region Promotion Component */

import { PROMOTION_CONFIG } from "../config/promotion-config.js";
import { loadPromotions } from "../services/promotion-data.js";

const SELECTORS = Object.freeze({
	content: "#promotionContent",
	dialog: "#promotionDialog",
	dialogImage: "#promotionDialogImage",
	dialogClose: "#promotionDialogClose"
});

function parseLocalDate(dateValue, useEndOfDay = false) {
	if (!dateValue) {
		return null;
	}

	const timeValue = useEndOfDay ? "T23:59:59" : "T00:00:00";
	const parsedDate = new Date(`${dateValue}${timeValue}`);

	return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
}

function isPromotionAvailable(promotion, now = new Date()) {
	if (!promotion || promotion.isActive !== true) {
		return false;
	}

	const startDate = parseLocalDate(promotion.startDate);
	const endDate = parseLocalDate(promotion.endDate, true);

	if (startDate && now < startDate) {
		return false;
	}

	if (endDate && now > endDate) {
		return false;
	}

	return Boolean(
		promotion.id &&
		promotion.title &&
		promotion.desktopImage &&
		promotion.mobileImage
	);
}

function getActivePromotion(promotions) {
	return promotions
		.filter((promotion) => isPromotionAvailable(promotion))
		.sort((first, second) => {
			return (first.sortOrder || 0) - (second.sortOrder || 0);
		})[0] || null;
}

function createElement(tagName, className, textContent = "") {
	const element = document.createElement(tagName);

	if (className) {
		element.className = className;
	}

	if (textContent) {
		element.textContent = textContent;
	}

	return element;
}

function createPromotionPicture(promotion) {
	const picture = createElement("picture", "promotion-picture");
	const mobileSource = document.createElement("source");
	const image = document.createElement("img");

	mobileSource.media = `(max-width: ${PROMOTION_CONFIG.mobileBreakpoint})`;
	mobileSource.srcset = promotion.mobileImage;

	image.className = "promotion-image";
	image.src = promotion.desktopImage;
	image.alt = promotion.imageAlt || promotion.title;
	image.loading = "lazy";
	image.decoding = "async";
	image.width = 1450;
	image.height = 1024;

	picture.append(mobileSource, image);

	return {
		picture,
		image
	};
}

function createPromotionButton(promotion) {
	const button = createElement(
		"a",
		"promotion-action promotion-action-primary",
		promotion.buttonText || "立即預約"
	);

	button.href = promotion.buttonUrl || PROMOTION_CONFIG.lineUrl;
	button.target = "_blank";
	button.rel = "noopener noreferrer";

	return button;
}

function renderPromotion(contentElement, promotion, openDialog) {
	const article = createElement("article", "promotion-card promotion-card-active");
	const mediaButton = createElement("button", "promotion-media-button");
	const mediaHint = createElement("span", "promotion-media-hint", "點擊放大海報");
	const body = createElement("div", "promotion-body");
	const badge = createElement("span", "promotion-badge", "Limited Offer");
	const title = createElement("h2", "promotion-title", promotion.title);
	const description = createElement(
		"p",
		"promotion-text",
		promotion.description || ""
	);
	const actions = createElement("div", "promotion-links");
	const { picture, image } = createPromotionPicture(promotion);

	mediaButton.type = "button";
	mediaButton.setAttribute("aria-label", `放大查看「${promotion.title}」活動海報`);
	mediaButton.append(picture, mediaHint);
	mediaButton.addEventListener("click", () => {
		openDialog(promotion, image.currentSrc || image.src);
	});

	image.addEventListener("error", () => {
		mediaButton.classList.add("is-image-error");
		mediaHint.textContent = "活動海報暫時無法載入";
		mediaButton.disabled = true;
	});

	actions.append(createPromotionButton(promotion));
	body.append(badge, title, description, actions);
	article.append(mediaButton, body);

	contentElement.replaceChildren(article);
}

function renderFallback(contentElement) {
	const article = createElement("article", "promotion-card promotion-card-fallback");
	const badge = createElement("span", "promotion-badge", "Coming Soon");
	const title = createElement("h2", "promotion-title", PROMOTION_CONFIG.fallbackTitle);
	const text = createElement("p", "promotion-text", PROMOTION_CONFIG.fallbackText);
	const links = createElement("div", "promotion-links");
	const instagramLink = createElement("a", "promotion-action", "追蹤 Instagram");
	const lineLink = createElement("a", "promotion-action", "加入 LINE");

	instagramLink.href = PROMOTION_CONFIG.instagramUrl;
	instagramLink.target = "_blank";
	instagramLink.rel = "noopener noreferrer";

	lineLink.href = PROMOTION_CONFIG.lineUrl;
	lineLink.target = "_blank";
	lineLink.rel = "noopener noreferrer";

	links.append(instagramLink, lineLink);
	article.append(badge, title, text, links);
	contentElement.replaceChildren(article);
}

function createDialogController() {
	const dialog = document.querySelector(SELECTORS.dialog);
	const dialogImage = document.querySelector(SELECTORS.dialogImage);
	const closeButton = document.querySelector(SELECTORS.dialogClose);

	if (!dialog || !dialogImage || !closeButton) {
		return () => {};
	}

	function closeDialog() {
		dialog.close();
	}

	closeButton.addEventListener("click", closeDialog);
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) {
			closeDialog();
		}
	});

	return (promotion, imageUrl) => {
		dialogImage.src = imageUrl;
		dialogImage.alt = promotion.imageAlt || promotion.title;
		dialog.showModal();
	};
}

export async function initializePromotion() {
	const contentElement = document.querySelector(SELECTORS.content);

	if (!contentElement) {
		return;
	}

	const openDialog = createDialogController();

	try {
		const promotions = await loadPromotions();
		const activePromotion = getActivePromotion(promotions);

		if (!activePromotion) {
			renderFallback(contentElement);
			return;
		}

		renderPromotion(contentElement, activePromotion, openDialog);
	} catch (error) {
		console.warn("Unable to initialize promotion:", error);
		renderFallback(contentElement);
	}
}

/* #endregion */
