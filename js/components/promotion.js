/* #region Promotion Carousel Component */

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

	if (!promotion.isPermanent && endDate && now > endDate) {
		return false;
	}

	return Boolean(
		promotion.id &&
		promotion.title &&
		promotion.desktopImage &&
		promotion.mobileImage
	);
}

function getActivePromotions(promotions) {
	return promotions
		.filter((promotion) => isPromotionAvailable(promotion))
		.sort((first, second) => {
			const pinnedDifference = Number(Boolean(second.isPinned)) - Number(Boolean(first.isPinned));

			if (pinnedDifference !== 0) {
				return pinnedDifference;
			}

			return (first.sortOrder || 0) - (second.sortOrder || 0);
		});
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

function createPromotionSlide(promotion, index, openDialog) {
	const slide = createElement("article", "promotion-slide");
	const mediaButton = createElement("button", "promotion-media-button");
	const mediaHint = createElement("span", "promotion-media-hint", "點擊放大海報");
	const body = createElement("div", "promotion-body");
	const badgeText = promotion.isPermanent ? "常駐活動" : "最新優惠";
	const badge = createElement("span", "promotion-badge", badgeText);
	const title = createElement("h2", "promotion-title", promotion.title);
	const description = createElement("p", "promotion-text", promotion.description || "");
	const actions = createElement("div", "promotion-links");
	const { picture, image } = createPromotionPicture(promotion);

	slide.dataset.promotionIndex = String(index);
	slide.setAttribute("role", "group");
	slide.setAttribute("aria-roledescription", "投影片");

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
	slide.append(mediaButton, body);

	return slide;
}

function createNavigationButton(direction, label) {
	const button = createElement(
		"button",
		`promotion-carousel-button promotion-carousel-button-${direction}`
	);

	button.type = "button";
	button.setAttribute("aria-label", label);
	button.innerHTML = direction === "previous" ? "&#10094;" : "&#10095;";

	return button;
}

function renderPromotionCarousel(contentElement, promotions, openDialog) {
	const carousel = createElement("div", "promotion-carousel");
	const viewport = createElement("div", "promotion-carousel-viewport");
	const track = createElement("div", "promotion-carousel-track");
	const controls = createElement("div", "promotion-carousel-controls");
	const dots = createElement("div", "promotion-carousel-dots");
	const previousButton = createNavigationButton("previous", "顯示上一個優惠");
	const nextButton = createNavigationButton("next", "顯示下一個優惠");
	const slides = promotions.map((promotion, index) => {
		return createPromotionSlide(promotion, index, openDialog);
	});
	let activeIndex = 0;
	let autoplayTimer = null;
	let pointerStartX = null;

	track.append(...slides);
	viewport.append(track);
	carousel.append(viewport);

	function setActiveSlide(nextIndex, userInitiated = false) {
		activeIndex = (nextIndex + slides.length) % slides.length;
		track.style.transform = `translateX(-${activeIndex * 100}%)`;

		slides.forEach((slide, index) => {
			const isActive = index === activeIndex;
			slide.setAttribute("aria-hidden", String(!isActive));
			slide.setAttribute("aria-label", `${index + 1} / ${slides.length}`);
		});

		dots.querySelectorAll("button").forEach((dot, index) => {
			const isActive = index === activeIndex;
			dot.classList.toggle("is-active", isActive);
			dot.setAttribute("aria-current", isActive ? "true" : "false");
		});

		if (userInitiated) {
			restartAutoplay();
		}
	}

	function stopAutoplay() {
		if (autoplayTimer) {
			window.clearInterval(autoplayTimer);
			autoplayTimer = null;
		}
	}

	function startAutoplay() {
		if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			return;
		}

		stopAutoplay();
		autoplayTimer = window.setInterval(() => {
			setActiveSlide(activeIndex + 1);
		}, PROMOTION_CONFIG.autoplayInterval);
	}

	function restartAutoplay() {
		stopAutoplay();
		startAutoplay();
	}

	if (slides.length > 1) {
		previousButton.addEventListener("click", () => {
			setActiveSlide(activeIndex - 1, true);
		});

		nextButton.addEventListener("click", () => {
			setActiveSlide(activeIndex + 1, true);
		});

		promotions.forEach((promotion, index) => {
			const dot = createElement("button", "promotion-carousel-dot");

			dot.type = "button";
			dot.setAttribute("aria-label", `顯示「${promotion.title}」`);
			dot.addEventListener("click", () => {
				setActiveSlide(index, true);
			});
			dots.append(dot);
		});

		controls.append(previousButton, dots, nextButton);
		carousel.append(controls);

		viewport.addEventListener("pointerdown", (event) => {
			pointerStartX = event.clientX;
			stopAutoplay();
		});

		viewport.addEventListener("pointerup", (event) => {
			if (pointerStartX === null) {
				return;
			}

			const distance = event.clientX - pointerStartX;
			pointerStartX = null;

			if (Math.abs(distance) >= PROMOTION_CONFIG.swipeThreshold) {
				setActiveSlide(activeIndex + (distance < 0 ? 1 : -1), true);
				return;
			}

			startAutoplay();
		});

		viewport.addEventListener("pointercancel", () => {
			pointerStartX = null;
			startAutoplay();
		});

		carousel.addEventListener("mouseenter", stopAutoplay);
		carousel.addEventListener("mouseleave", startAutoplay);
		carousel.addEventListener("focusin", stopAutoplay);
		carousel.addEventListener("focusout", startAutoplay);
	}

	contentElement.replaceChildren(carousel);
	setActiveSlide(0);
	startAutoplay();
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
		const activePromotions = getActivePromotions(promotions);

		if (activePromotions.length === 0) {
			renderFallback(contentElement);
			return;
		}

		renderPromotionCarousel(contentElement, activePromotions, openDialog);
	} catch (error) {
		console.warn("Unable to initialize promotion:", error);
		renderFallback(contentElement);
	}
}

/* #endregion */
