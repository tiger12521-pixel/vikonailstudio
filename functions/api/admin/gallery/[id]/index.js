import {
	deleteGalleryItem,
	jsonResponse,
	readGallery,
	readGalleryForm,
	saveGalleryItem,
	uploadGalleryImage
} from "../../../../_shared/gallery-utils.js";

export async function onRequestPut(context) {
	try {
		const data = await readGallery(context.env);
		const existing = data.items.find(item => item.id === context.params.id);
		if (!existing) return jsonResponse({ error: "找不到指定作品。" }, 404);

		const formData = await context.request.formData();
		const values = readGalleryForm(formData, existing);
		const uploaded = await uploadGalleryImage(context.env, formData.get("image"), existing.id);
		if (uploaded && existing.imageKey) await context.env.GALLERY_ASSETS.delete(existing.imageKey);

		await saveGalleryItem(context.env, {
			...existing,
			...values,
			image: uploaded?.url || existing.image,
			imageKey: uploaded?.key || existing.imageKey,
			updatedAt: new Date().toISOString()
		});

		return jsonResponse({ id: existing.id });
	} catch (error) {
		return jsonResponse({ error: error.message }, 400);
	}
}

export async function onRequestDelete(context) {
	try {
		const data = await readGallery(context.env);
		const existing = data.items.find(item => item.id === context.params.id);
		if (!existing) return jsonResponse({ error: "找不到指定作品。" }, 404);

		if (existing.imageKey) await context.env.GALLERY_ASSETS.delete(existing.imageKey);
		await deleteGalleryItem(context.env, existing.id);
		return new Response(null, { status: 204 });
	} catch (error) {
		return jsonResponse({ error: error.message }, 500);
	}
}
