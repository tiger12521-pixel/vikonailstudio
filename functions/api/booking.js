export async function onRequestGet(context) {
  return Response.json({
    message: "Booking API is working",
    week: context.request.url,
  });
}