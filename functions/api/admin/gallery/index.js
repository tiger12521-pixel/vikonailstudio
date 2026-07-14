import {
	createGalleryId,
	jsonResponse,
	readGallery,
	readGalleryForm,
	saveGalleryItem,
	sortGallery,
	uploadGalleryImage
} from "../../../_shared/gallery-utils.js";

export async function onRequestGet(context) {
	try {
		return jsonResponse({
			items: sortGallery((await readGallery(context.env)).items)
		});
	} catch (error) {
		return jsonResponse({ error: error.message }, 500);
	}
}

export async function onRequestPost(context) {
	try {
		const formData = await context.request.formData();
		const id = createGalleryId();
		const values = readGalleryForm(formData);
		const uploaded = await uploadGalleryImage(context.env, formData.get("image"), id);
		if (!uploaded) return jsonResponse({ error: "新增作品時必須上傳圖片。" }, 400);

		const now = new Date().toISOString();
		await saveGalleryItem(context.env, {
			id,
			...values,
			image: uploaded.url,
			imageKey: uploaded.key,
			createdAt: now,
			updatedAt: now
		});

		return jsonResponse({ id }, 201);
	} catch (error) {
		return jsonResponse({ error: error.message }, 400);
	}
}
