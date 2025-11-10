import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authenticationParameters = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
    });

    return NextResponse.json({
      token: authenticationParameters.token,
      signature: authenticationParameters.signature,
      expire: authenticationParameters.expire,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
      urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
    });
  } catch (error) {
    console.error("ImageKit Auth Error:", error);
    return NextResponse.json(
      { error: "Authentication for ImageKit failed" },
      { status: 500 }
    );
  }
}