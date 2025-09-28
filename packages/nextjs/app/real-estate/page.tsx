"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

// simple debounce hook
function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

const isAddr = (s: string) => /^0x[a-fA-F0-9]{40}$/.test(s || "");

export default function RealEstateMode() {
  // Inputs
  const [adminAddr, setAdminAddr] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amt, setAmt] = useState("0");

  // Debounced values to reduce RPC traffic
  const dFrom = useDebounced(from);
  const dTo = useDebounced(to);

  // Reads: KYC flags (only when valid, debounced)
  const { data: fromKyc, isLoading: fromLoading } = useScaffoldReadContract({
    contractName: "ComplianceRegistry",
    functionName: "isKYCd",
    args: [dFrom as `0x${string}`],
  });

  const { data: toKyc, isLoading: toLoading } = useScaffoldReadContract({
    contractName: "ComplianceRegistry",
    functionName: "isKYCd",
    args: [dTo as `0x${string}`],
  });

  const allowed = Boolean(isAddr(dFrom) && isAddr(dTo) && fromKyc && toKyc);

  // Writes
  const { writeContractAsync: writeRegistry } = useScaffoldWriteContract({ contractName: "ComplianceRegistry" });
  const { writeContractAsync: writeToken } = useScaffoldWriteContract({ contractName: "RestrictedToken" });

  const approveKYC = async (ok: boolean) => {
    if (!isAddr(adminAddr)) return;
    await writeRegistry({
      functionName: "setKYC",
      args: [adminAddr as `0x${string}`, ok],
    });
  };

  const doTransfer = async () => {
    if (!allowed) return;
    const n = Number(amt);
    if (!isFinite(n) || n <= 0) return;
    const wei = BigInt(Math.floor(n * 1e18));
    await writeToken({
      functionName: "transfer",
      args: [dTo as `0x${string}`, wei],
    });
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Real Estate Mode</h1>
          <Link href="/play" className="text-primary underline">
            Back to Play
          </Link>
        </div>
        <p className="text-gray-600 mt-1">KYC-gated transfers and an Asset Passport preview.</p>

        {/* Admin KYC */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <h2 className="text-xl font-semibold">Admin: KYC Control</h2>
          <div className="mt-3 flex gap-2">
            <input
              className="input input-bordered w-full"
              placeholder="0x... (address to approve/revoke)"
              value={adminAddr}
              onChange={e => setAdminAddr(e.target.value)}
            />
            <button className="btn btn-success" disabled={!isAddr(adminAddr)} onClick={() => approveKYC(true)}>
              Approve
            </button>
            <button className="btn btn-outline" disabled={!isAddr(adminAddr)} onClick={() => approveKYC(false)}>
              Revoke
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-1">Requires owner wallet (deployer) for setKYC.</div>
        </section>

        {/* Transfer Simulator */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <h2 className="text-xl font-semibold">Transfer Simulator</h2>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-sm text-gray-600">From</label>
              <input
                className="input input-bordered w-full"
                placeholder="0x..."
                value={from}
                onChange={e => setFrom(e.target.value)}
              />
              <div className="text-xs mt-1">
                {!isAddr(dFrom) ? (
                  <span className="text-gray-500">Enter a valid address</span>
                ) : fromLoading ? (
                  <span className="text-gray-500">Checking…</span>
                ) : (
                  <span className={fromKyc ? "text-green-600" : "text-rose-600"}>
                    {fromKyc ? "KYC: Approved" : "KYC: Not approved"}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">To</label>
              <input
                className="input input-bordered w-full"
                placeholder="0x..."
                value={to}
                onChange={e => setTo(e.target.value)}
              />
              <div className="text-xs mt-1">
                {!isAddr(dTo) ? (
                  <span className="text-gray-500">Enter a valid address</span>
                ) : toLoading ? (
                  <span className="text-gray-500">Checking…</span>
                ) : (
                  <span className={toKyc ? "text-green-600" : "text-rose-600"}>
                    {toKyc ? "KYC: Approved" : "KYC: Not approved"}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Amount (RTK)</label>
              <input
                className="input input-bordered w-full"
                placeholder="e.g., 1"
                value={amt}
                onChange={e => setAmt(e.target.value)}
              />
            </div>
          </div>

          <div className="mt-3 text-sm">
            Allowed? <span className={allowed ? "text-green-600" : "text-rose-600"}>{allowed ? "Yes" : "No"}</span>
          </div>
          <button className="btn btn-primary mt-3" disabled={!allowed} onClick={doTransfer}>
            Transfer
          </button>
        </section>

        {/* Asset Passport (Preview) */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white shadow-sm p-4">
          <h2 className="text-xl font-semibold">Asset Passport (Preview)</h2>
          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-gray-600">Property ID</div>
              <div className="font-mono">PROP-DEL-2025-001</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Issuer</div>
              <div>Integra Demo Issuer</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Jurisdiction</div>
              <div>IN-DEL</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Last Valuation</div>
              <div>2025-09-25</div>
            </div>
            <div className="md:col-span-2">
              <div className="text-sm text-gray-600">Attestation Hash</div>
              <div className="font-mono break-all">0xabc...demo-hash</div>
            </div>
          </div>
          <div className="mt-2 text-sm">
            Passport Verify:{" "}
            <span className={allowed ? "text-green-600" : "text-rose-600"}>{allowed ? "Compliant" : "Restricted"}</span>
          </div>
        </section>
      </div>
    </main>
  );
}
