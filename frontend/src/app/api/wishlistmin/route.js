export async function GET(req) {
  try {
    const res = await fetch(`http://localhost:3001/api/getWishlistMinimal`, {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "", 
      },
      credentials: "include",
    });

    const data = await res.json();
    return Response.json(data, { status: res.status });
  } catch (err) {
    console.error("Proxy error:", err);
    return Response.json(
      { success: false, message: "Proxy failed" },
      { status: 500 }
    );
  }
}
