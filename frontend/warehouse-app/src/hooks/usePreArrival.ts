import { useState } from "react";

type PreArrivalPayload = {
  customer?: string;
  suite?: string;
  otp: string | number;
  tracking_no?: string | null;
  trackingNumber?: string | null;
  estimate_arrival_time?: string | null;
  estimatedArrivalTime?: string | null;
  details?: string;
  status?: string;
};

export default function usePreArrival(defaults?: { customer?: string; suite?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPreArrival = async (payload: PreArrivalPayload) => {
    setLoading(true);
    setError(null);

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(/\/$/, "");
    const body = {
      customer: payload.customer ?? defaults?.customer ?? "Rohit Sharma",
      suite: payload.suite ?? defaults?.suite ?? "102-529",
      otp: Number(payload.otp),
      tracking_no: payload.tracking_no ?? payload["trackingNumber"] ?? null,
      estimate_arrival_time: payload.estimate_arrival_time ?? payload["estimatedArrivalTime"] ?? null,
      details: payload.details ?? null,
      status: payload.status ?? "pending",
    };

    try {
      const res = await fetch(`${API_URL}/pre-arrival`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      setError(err?.message || "Failed to submit pre-arrival");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    submitPreArrival,
    loading,
    error,
  };
}
