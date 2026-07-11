/*==================================================
	Application Entry Point
==================================================*/

import { initializeAppInfo } from "./config/app-info.js";
import { initializeBooking } from "./components/booking.js";
import { initializePromotion } from "./components/promotion.js";
import { initializeHomeGallery } from "./components/gallery-home.js";

/*
 * Starts each independent website feature.
 * Add future components here instead of placing their implementation in main.js.
 */
async function initializeApplication() {
	await initializeAppInfo();
	await initializePromotion();
	await initializeHomeGallery();
	initializeBooking();
}

initializeApplication();
