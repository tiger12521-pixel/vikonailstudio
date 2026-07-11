import { GALLERY_API_URL } from "../config/gallery-config.js";

export async function fetchGalleryItems(params = {}) {
	const url = new URL(GALLERY_API_URL, window.location.origin);
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== "") url.searchParams.set(key, String(value));
	});
	url.searchParams.set("t", Date.now());
	const response = await fetch(url, { cache: "no-store" });
	if (!response.ok) throw new Error(`HTTP ${response.status}`);
	const data = await response.json();
	return Array.isArray(data.items) ? data.items : [];
}
