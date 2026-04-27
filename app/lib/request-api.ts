const REQUEST_TIMEOUT_MS = 12_000;

export type ProcareRequestPayload = {
  name: string;
  phone: string;
  deviceType: string;
  message: string;
  source: "procare_landing";
};

const rawRequestUrl =
  process.env.NEXT_PUBLIC_PROCARE_REQUEST_API_URL ?? process.env.NEXT_PUBLIC_PROCARE_API_BASE_URL ?? "";

export const isRequestApiConfigured = rawRequestUrl.trim().length > 0;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getRequestUrl() {
  const url = trimTrailingSlash(rawRequestUrl.trim());

  if (!url) {
    throw new Error("Request API URL is not configured.");
  }

  return url.endsWith("/requests") ? url : `${url}/requests`;
}

export async function submitProcareRequest(payload: ProcareRequestPayload) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(getRequestUrl(), {
      body: JSON.stringify(payload),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Request API failed with ${response.status}.`);
    }
  } finally {
    window.clearTimeout(timeoutId);
  }
}
