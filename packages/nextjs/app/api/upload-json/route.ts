// app/api/upload-json/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await req.json();
  // TODO: replace with real Walrus/IPFS upload; return real CID
  const fakeCid = "bafybeigdemo" + Math.random().toString(36).slice(2, 8);
  return NextResponse.json({ cid: fakeCid });
}
