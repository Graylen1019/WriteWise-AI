import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const backendRes = await fetch("http://localhost:3001/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!backendRes.ok) {
      const errorText = await backendRes.text();
      console.error("Backend error:", errorText);
      return NextResponse.json({ error: "Backend failed" }, { status: 500 });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Proxy error:", error);
    return NextResponse.json({ error: "Proxy server error" }, { status: 500 });
  }
}
