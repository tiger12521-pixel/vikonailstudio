export async function onRequestGet(context) {
	const key = Array.isArray(context.params.path)
		? context.params.path.join("/")
		: String(context.params.path || "");
	const object = await context.env.PROMOTION_IMAGES.get(key);

	if (!object) {
		return new Response("Not found", { status: 404 });
	}

	const headers = new Headers();
	object.writeHttpMetadata(headers);
	headers.set("etag", object.httpEtag);
	headers.set("Cache-Control", "public, max-age=31536000, immutable");

	return new Response(object.body, { headers });
}
