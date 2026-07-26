// CamRapidPay KHQR (Bakong) client — thin wrapper around the merchant API.
const BASE_URL = "https://pay.camrapidpay.com";

export function getApiKey() {
  return process.env.CAMRAPIDPAY_API_KEY || null;
}

export async function createKhqrPayment({ amount, reference, successUrl, webhookUrl }) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("CAMRAPIDPAY_API_KEY is not configured");

  const res = await fetch(`${BASE_URL}/api/v1/khqr/create-payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      amount,
      reference,
      success_url: successUrl,
      webhook_url: webhookUrl
    })
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "Failed to create KHQR payment");
  }
  return data;
}

export async function checkKhqrTransaction(reference) {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("CAMRAPIDPAY_API_KEY is not configured");

  const url = new URL(`${BASE_URL}/check-transaction-api`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("reference", reference);

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" }
  });
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || "Failed to check transaction status");
  }
  return data;
}
