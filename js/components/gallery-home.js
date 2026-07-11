import { HOME_FEATURED_LIMIT, GALLERY_PAGE_URL } from "../config/gallery-config.js";
import { fetchGalleryItems } from "../services/gallery-data.js";

function createCard(item) {
	const link = document.createElement("a");
	link.className = "gallery-card";
	link.href = `${GALLERY_PAGE_URL}#work-${encodeURIComponent(item.id)}`;
	link.setAttribute("aria-label", item.title || "查看美甲作品");
	const image = document.createElement("img");
	image.src = item.image;
	image.alt = item.title || `薇可美甲作品 ${item.category?.join("、") || ""}`.trim();
	image.loading = "lazy";
	link.append(image);
	return link;
}

export async function initializeHomeGallery() {
	const grid = document.querySelector("#featuredGalleryGrid");
	if (!grid) return;
	try {
		const items = await fetchGalleryItems({ featured: true, limit: HOME_FEATURED_LIMIT });
		if (!items.length) return;
		grid.replaceChildren(...items.map(createCard));
	} catch (error) {
		console.warn("Unable to load featured gallery:", error);
	}
}
