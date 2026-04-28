const REQUEST_TIMEOUT_MS = 12_000;
const OPEN_REPAIR_ORDER_PATH = "/repair-orders/open";

export type ProcareRequestPayload = {
  name: string;
  phone_number: string;
  phone_category: string;
  description: string;
};

export type ProcareRequestResponse = {
  id: string;
  number_id: number;
  phone_number: string;
  name: string;
  description: string | null;
};

export type ProcareRequestApiError = {
  statusCode?: number;
  message?: string;
  error?: string;
  location?: "name" | "phone_number" | "phone_category" | "description" | string;
};

const rawRequestUrl =
  process.env.NEXT_PUBLIC_PROCARE_REQUEST_API_URL ??
  process.env.NEXT_PUBLIC_PROCARE_API_BASE_URL ??
  process.env.NEXT_PUBLIC_CALCULATOR_API_BASE_URL ??
  "";

export const isRequestApiConfigured = rawRequestUrl.trim().length > 0;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function stripCalculatorPath(value: string) {
  return value.endsWith("/calculator") ? trimTrailingSlash(value.slice(0, -"/calculator".length)) : value;
}

function getRequestUrl() {
  const url = stripCalculatorPath(trimTrailingSlash(rawRequestUrl.trim()));

  if (!url) {
    throw new Error("Request API URL is not configured.");
  }

  if (url.endsWith(OPEN_REPAIR_ORDER_PATH)) {
    return url;
  }

  if (url.endsWith("/requests")) {
    const baseUrl = trimTrailingSlash(url.slice(0, -"/requests".length));

    return `${baseUrl}${OPEN_REPAIR_ORDER_PATH}`;
  }

  return `${url}${OPEN_REPAIR_ORDER_PATH}`;
}

export async function submitProcareRequest(payload: ProcareRequestPayload): Promise<ProcareRequestResponse> {
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

    const data = (await response.json().catch(() => null)) as ProcareRequestResponse | ProcareRequestApiError | null;

    if (!response.ok) {
      throw data ?? new Error(`Request API failed with ${response.status}.`);
    }

    return data as ProcareRequestResponse;
  } finally {
    window.clearTimeout(timeoutId);
  }
}
