import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    // Example validation logic
    if (code === "valid-code") {
      return NextResponse.json({ message: "QR Code Validated Successfully" });
    } else {
      return NextResponse.json({ message: "Invalid QR Code" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error processing request:", error); // Log the error for debugging
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
