import type {
  CalculatorOsTypeDto,
  CalculatorPhoneCategoryDto,
  CalculatorProblemCategoryDto
} from "./calculator-api";

const mockOsTypes: CalculatorOsTypeDto[] = [
  {
    id: "mock-ios",
    name_uz: "iOS",
    name_ru: "iOS",
    name_en: "iOS",
    sort: 1,
    is_active: true
  },
  {
    id: "mock-ipados",
    name_uz: "iPadOS",
    name_ru: "iPadOS",
    name_en: "iPadOS",
    sort: 2,
    is_active: true
  },
  {
    id: "mock-macos",
    name_uz: "macOS",
    name_ru: "macOS",
    name_en: "macOS",
    sort: 3,
    is_active: true
  },
  {
    id: "mock-watchos",
    name_uz: "watchOS",
    name_ru: "watchOS",
    name_en: "watchOS",
    sort: 4,
    is_active: true
  }
];

const mockPhoneCategories: CalculatorPhoneCategoryDto[] = [
  {
    id: "mock-iphone-15-series",
    name_uz: "iPhone 15 seriyasi",
    name_ru: "Серия iPhone 15",
    name_en: "iPhone 15 series",
    phone_os_type_id: "mock-ios",
    parent_id: null,
    sort: 1,
    has_children: true,
    has_problems: false
  },
  {
    id: "mock-iphone-14-series",
    name_uz: "iPhone 14 seriyasi",
    name_ru: "Серия iPhone 14",
    name_en: "iPhone 14 series",
    phone_os_type_id: "mock-ios",
    parent_id: null,
    sort: 2,
    has_children: true,
    has_problems: false
  },
  {
    id: "mock-iphone-15-pro",
    name_uz: "iPhone 15 Pro",
    name_ru: "iPhone 15 Pro",
    name_en: "iPhone 15 Pro",
    phone_os_type_id: "mock-ios",
    parent_id: "mock-iphone-15-series",
    sort: 1,
    has_children: false,
    has_problems: true
  },
  {
    id: "mock-iphone-15-pro-max",
    name_uz: "iPhone 15 Pro Max",
    name_ru: "iPhone 15 Pro Max",
    name_en: "iPhone 15 Pro Max",
    phone_os_type_id: "mock-ios",
    parent_id: "mock-iphone-15-series",
    sort: 2,
    has_children: false,
    has_problems: true
  },
  {
    id: "mock-iphone-14-pro",
    name_uz: "iPhone 14 Pro",
    name_ru: "iPhone 14 Pro",
    name_en: "iPhone 14 Pro",
    phone_os_type_id: "mock-ios",
    parent_id: "mock-iphone-14-series",
    sort: 1,
    has_children: false,
    has_problems: true
  },
  {
    id: "mock-ipad-pro",
    name_uz: "iPad Pro",
    name_ru: "iPad Pro",
    name_en: "iPad Pro",
    phone_os_type_id: "mock-ipados",
    parent_id: null,
    sort: 1,
    has_children: false,
    has_problems: true
  },
  {
    id: "mock-ipad-air",
    name_uz: "iPad Air",
    name_ru: "iPad Air",
    name_en: "iPad Air",
    phone_os_type_id: "mock-ipados",
    parent_id: null,
    sort: 2,
    has_children: false,
    has_problems: true
  },
  {
    id: "mock-macbook-pro",
    name_uz: "MacBook Pro",
    name_ru: "MacBook Pro",
    name_en: "MacBook Pro",
    phone_os_type_id: "mock-macos",
    parent_id: null,
    sort: 1,
    has_children: false,
    has_problems: true
  },
  {
    id: "mock-macbook-air",
    name_uz: "MacBook Air",
    name_ru: "MacBook Air",
    name_en: "MacBook Air",
    phone_os_type_id: "mock-macos",
    parent_id: null,
    sort: 2,
    has_children: false,
    has_problems: true
  },
  {
    id: "mock-apple-watch-series-9",
    name_uz: "Apple Watch Series 9",
    name_ru: "Apple Watch Series 9",
    name_en: "Apple Watch Series 9",
    phone_os_type_id: "mock-watchos",
    parent_id: null,
    sort: 1,
    has_children: false,
    has_problems: true
  }
];

const commonPhoneProblems = [
  {
    id: "display",
    name_uz: "Ekran moduli",
    name_ru: "Модуль экрана",
    name_en: "Display module",
    price: "890000",
    cost: "890000",
    estimated_minutes: 45,
    sort: 1
  },
  {
    id: "battery",
    name_uz: "Batareya almashtirish",
    name_ru: "Замена батареи",
    name_en: "Battery replacement",
    price: "390000",
    cost: "390000",
    estimated_minutes: 35,
    sort: 2
  },
  {
    id: "camera",
    name_uz: "Orqa kamera",
    name_ru: "Задняя камера",
    name_en: "Rear camera",
    price: "420000",
    cost: "420000",
    estimated_minutes: 30,
    sort: 3
  },
  {
    id: "diagnostics",
    name_uz: "To'liq diagnostika",
    name_ru: "Полная диагностика",
    name_en: "Full diagnostics",
    price: "0",
    cost: "0",
    estimated_minutes: 20,
    sort: 4
  }
] satisfies Array<Omit<CalculatorProblemCategoryDto, "parent_id">>;

const commonComputerProblems = [
  {
    id: "keyboard",
    name_uz: "Klaviatura ta'miri",
    name_ru: "Ремонт клавиатуры",
    name_en: "Keyboard repair",
    price: "650000",
    cost: "650000",
    estimated_minutes: 90,
    sort: 1
  },
  {
    id: "battery",
    name_uz: "Batareya almashtirish",
    name_ru: "Замена батареи",
    name_en: "Battery replacement",
    price: "780000",
    cost: "780000",
    estimated_minutes: 70,
    sort: 2
  },
  {
    id: "diagnostics",
    name_uz: "To'liq diagnostika",
    name_ru: "Полная диагностика",
    name_en: "Full diagnostics",
    price: "0",
    cost: "0",
    estimated_minutes: 30,
    sort: 3
  }
] satisfies Array<Omit<CalculatorProblemCategoryDto, "parent_id">>;

const mockProblemCategories: CalculatorProblemCategoryDto[] = [
  ...["mock-iphone-15-pro", "mock-iphone-15-pro-max", "mock-iphone-14-pro", "mock-ipad-pro", "mock-ipad-air"].flatMap(
    (parentId) => commonPhoneProblems.map((problem) => ({ ...problem, id: `${parentId}-${problem.id}`, parent_id: parentId }))
  ),
  ...["mock-macbook-pro", "mock-macbook-air"].flatMap((parentId) =>
    commonComputerProblems.map((problem) => ({ ...problem, id: `${parentId}-${problem.id}`, parent_id: parentId }))
  ),
  {
    id: "mock-apple-watch-series-9-display",
    name_uz: "Ekran oynasi",
    name_ru: "Стекло дисплея",
    name_en: "Display glass",
    parent_id: "mock-apple-watch-series-9",
    price: "520000",
    cost: "520000",
    estimated_minutes: 50,
    sort: 1
  },
  {
    id: "mock-apple-watch-series-9-battery",
    name_uz: "Batareya almashtirish",
    name_ru: "Замена батареи",
    name_en: "Battery replacement",
    parent_id: "mock-apple-watch-series-9",
    price: "310000",
    cost: "310000",
    estimated_minutes: 40,
    sort: 2
  }
];

function sortBySortField<T extends { sort?: number }>(items: T[]) {
  return [...items].sort((first, second) => (first.sort ?? 0) - (second.sort ?? 0));
}

export function getMockCalculatorOsTypes() {
  return sortBySortField(mockOsTypes).filter((item) => item.is_active ?? true);
}

export function getMockCalculatorPhoneCategories(osTypeId: string, parentId?: string | null) {
  return sortBySortField(
    mockPhoneCategories.filter((category) => {
      const normalizedParentId = parentId ?? null;

      return category.phone_os_type_id === osTypeId && (category.parent_id ?? null) === normalizedParentId;
    })
  );
}

export function getMockCalculatorProblemCategories(phoneCategoryId: string) {
  return sortBySortField(mockProblemCategories.filter((problem) => problem.parent_id === phoneCategoryId));
}
