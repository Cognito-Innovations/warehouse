import { createPreArrival } from "@/lib/api.service";
import { useState } from "react";

type PreArrivalPayload = {
  user?: string;
  suite?: string;
  otp: string | number;
  tracking_no?: string | null;
  trackingNumber?: string | null;
  estimate_arrival_time?: string | null;
  estimatedArrivalTime?: string | null;
  details?: string;
  status?: string;
};

export default function usePreArrival(defaults?: { user?: string; suite?: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitPreArrival = async (payload: PreArrivalPayload) => {
    setLoading(true);
    setError(null);

    const body = {
      user: payload.user ?? defaults?.user,
      suite: payload.suite ?? defaults?.suite,
      otp: Number(payload.otp),
      tracking_no: payload.tracking_no ?? payload["trackingNumber"] ?? null,
      estimate_arrival_time: payload.estimate_arrival_time ?? payload["estimatedArrivalTime"] ?? null,
      details: payload.details ?? null,
      status: payload.status ?? "pending",
    };

    try {
      const data = await createPreArrival(body);
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
