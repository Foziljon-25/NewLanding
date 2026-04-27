export type CalculatorOsTypeDto = {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  sort?: number;
  is_active?: boolean;
};

export type CalculatorPhoneCategoryDto = {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  telegram_sticker?: string | null;
  phone_os_type_id?: string;
  parent_id?: string | null;
  sort?: number;
  has_children: boolean;
  has_problems: boolean;
};

export type CalculatorProblemCategoryDto = {
  id: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  parent_id?: string | null;
  price: string;
  cost: string;
  estimated_minutes: number;
  sort?: number;
};

const REQUEST_TIMEOUT_MS = 12_000;

const rawCalculatorBaseUrl =
  process.env.NEXT_PUBLIC_CALCULATOR_API_BASE_URL ?? process.env.NEXT_PUBLIC_PROCARE_API_BASE_URL ?? "";

export const isCalculatorApiConfigured = rawCalculatorBaseUrl.trim().length > 0;

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

function getCalculatorBaseUrl() {
  const baseUrl = trimTrailingSlash(rawCalculatorBaseUrl.trim());

  if (!baseUrl) {
    throw new Error("Calculator API base URL is not configured.");
  }

  return baseUrl.endsWith("/calculator") ? baseUrl : `${baseUrl}/calculator`;
}

function sortBySortField<T extends { sort?: number }>(items: T[]) {
  return [...items].sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0));
}

async function fetchCalculatorJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  const abortRequest = () => controller.abort();
  signal?.addEventListener("abort", abortRequest, { once: true });

  try {
    const response = await fetch(`${getCalculatorBaseUrl()}${path}`, {
      headers: {
        Accept: "application/json"
      },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Calculator API request failed with ${response.status}.`);
    }

    return (await response.json()) as T;
  } finally {
    window.clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
}

export async function getCalculatorOsTypes(signal?: AbortSignal) {
  const items = await fetchCalculatorJson<CalculatorOsTypeDto[]>("/os-types", signal);

  return sortBySortField(items).filter((item) => item.is_active ?? true);
}

export async function getCalculatorPhoneCategories(osTypeId: string, parentId?: string | null, signal?: AbortSignal) {
  const params = parentId ? `?parent_id=${encodeURIComponent(parentId)}` : "";
  const items = await fetchCalculatorJson<CalculatorPhoneCategoryDto[]>(
    `/phone-categories/${encodeURIComponent(osTypeId)}${params}`,
    signal
  );

  return sortBySortField(items);
}

export async function getCalculatorProblemCategories(phoneCategoryId: string, signal?: AbortSignal) {
  const items = await fetchCalculatorJson<CalculatorProblemCategoryDto[]>(
    `/problem-categories/${encodeURIComponent(phoneCategoryId)}`,
    signal
  );

  return sortBySortField(items);
}
