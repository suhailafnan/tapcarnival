export type Snapshot = {
  timestamp: number;
  entries: Array<{ address: string; score: string }>;
};

const GATEWAY_UPLOAD = "/api/upload-json"; // implement in Next API if desired
const GATEWAY_FETCH = "https://ipfs.io/ipfs"; // replace with Walrus or your gateway base

export async function uploadJSON(obj: unknown): Promise<string> {
  // Demo: client-side POST to API that returns a CID; or call a Walrus SDK here.
  const res = await fetch(GATEWAY_UPLOAD, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
  if (!res.ok) throw new Error("Upload failed");
  const { cid } = await res.json();
  return cid as string;
}

export async function fetchJSON<T = unknown>(cid: string): Promise<T> {
  const url = `${GATEWAY_FETCH}/${cid}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Fetch failed");
  return (await res.json()) as T;
}
