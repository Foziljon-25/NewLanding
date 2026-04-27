"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useProcarePreferences, type LanguageCode, type ThemeMode } from "./use-procare-preferences";

const asset = (name: string) => `/assets/procare/${name}`;

type CalculatorVariant = "default" | "selection";

type Device = {
  id: string;
  title: Record<LanguageCode, string>;
  description: Record<LanguageCode, string>;
  icon: "phone" | "tablet" | "watch" | "laptop" | "earbuds" | "desktop";
};

type ServiceProblem = {
  id: string;
  title: Record<LanguageCode, string>;
  price: number;
  duration: Record<LanguageCode, string>;
};

type CalculatorContent = {
  header: {
    calculator: string;
    about: string;
    request: string;
    languageAria: string;
    logoAria: string;
    navAria: string;
    contactAria: string;
    themeLight: string;
    themeDark: string;
  };
  languageDialogTitle: string;
  breadcrumb: {
    home: string;
    current: string;
    back: string;
  };
  page: {
    eyebrow: string;
    title: string;
  };
  sections: {
    device: string;
    deviceMeta: string;
    expand: string;
    collapse: string;
    model: string;
    family: string;
    problems: string;
    selectedCount: string;
    search: string;
  };
  report: {
    number: string;
    title: string;
    deviceHint: string;
    selectedProblems: string;
    services: string;
    promoDiscount: string;
    total: string;
    cta: string;
    finePrint: string;
    empty: string;
    itemSuffix: string;
  };
  promo: {
    title: string;
    placeholder: string;
    button: string;
  };
  app: {
    appStore: string;
    playStore: string;
    qrText: string;
    note: string;
  };
  footer: {
    offer: string;
    privacy: string;
    address: string;
  };
};

type ProcareCalculatorPageProps = {
  variant?: CalculatorVariant;
};

const devices: Device[] = [
  {
    id: "iphone",
    title: { uz: "iPhone", ru: "iPhone", en: "iPhone" },
    description: { uz: "Smartfonlar", ru: "Смартфоны", en: "Smartphones" },
    icon: "phone"
  },
  {
    id: "ipad",
    title: { uz: "iPad", ru: "iPad", en: "iPad" },
    description: { uz: "Planshetlar", ru: "Планшеты", en: "Tablets" },
    icon: "tablet"
  },
  {
    id: "watch",
    title: { uz: "Apple Watch", ru: "Apple Watch", en: "Apple Watch" },
    description: { uz: "Soatlar", ru: "Часы", en: "Watches" },
    icon: "watch"
  },
  {
    id: "macbook",
    title: { uz: "MacBook", ru: "MacBook", en: "MacBook" },
    description: { uz: "Noutbuklar", ru: "Ноутбуки", en: "Laptops" },
    icon: "laptop"
  },
  {
    id: "airpods",
    title: { uz: "AirPods", ru: "AirPods", en: "AirPods" },
    description: { uz: "Quloqchinlar", ru: "Наушники", en: "Earbuds" },
    icon: "earbuds"
  },
  {
    id: "imac",
    title: { uz: "iMac", ru: "iMac", en: "iMac" },
    description: { uz: "Kompyuterlar", ru: "Компьютеры", en: "Desktops" },
    icon: "desktop"
  }
];

const models: Record<LanguageCode, string[]> = {
  uz: ["iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Pro"],
  ru: ["iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Pro"],
  en: ["iPhone 14 Pro", "iPhone 14 Pro Max", "iPhone 15", "iPhone 15 Pro"]
};

const problems: ServiceProblem[] = [
  {
    id: "display",
    title: { uz: "Ekran moduli", ru: "Модуль экрана", en: "Display module" },
    price: 890000,
    duration: { uz: "30 minut", ru: "30 минут", en: "30 minutes" }
  },
  {
    id: "face-id",
    title: { uz: "Face ID diagnostika", ru: "Диагностика Face ID", en: "Face ID diagnostics" },
    price: 120000,
    duration: { uz: "20 minut", ru: "20 минут", en: "20 minutes" }
  },
  {
    id: "camera",
    title: { uz: "Orqa kamera", ru: "Задняя камера", en: "Rear camera" },
    price: 120000,
    duration: { uz: "25 minut", ru: "25 минут", en: "25 minutes" }
  },
  {
    id: "battery",
    title: { uz: "Batareya", ru: "Батарея", en: "Battery" },
    price: 120000,
    duration: { uz: "35 minut", ru: "35 минут", en: "35 minutes" }
  },
  {
    id: "speaker",
    title: { uz: "Dinamik", ru: "Динамик", en: "Speaker" },
    price: 120000,
    duration: { uz: "20 minut", ru: "20 минут", en: "20 minutes" }
  },
  {
    id: "back-glass",
    title: { uz: "Orqa oyna", ru: "Заднее стекло", en: "Back glass" },
    price: 120000,
    duration: { uz: "45 minut", ru: "45 минут", en: "45 minutes" }
  }
];

const languageOptions: Array<{
  code: LanguageCode;
  shortLabel: string;
  labels: Record<LanguageCode, string>;
  flagSrc: string;
}> = [
  { code: "uz", shortLabel: "O'zb", labels: { uz: "O'zbekcha", ru: "Узбекский", en: "Uzbek" }, flagSrc: asset("language-flag-uz.svg") },
  { code: "ru", shortLabel: "Рус", labels: { uz: "Ruscha", ru: "Русский", en: "Russian" }, flagSrc: asset("language-flag-ru.svg") },
  { code: "en", shortLabel: "Eng", labels: { uz: "Inglizcha", ru: "Английский", en: "English" }, flagSrc: asset("language-flag-en.svg") }
];

const calculatorCopy: Record<LanguageCode, CalculatorContent> = {
  uz: {
    header: {
      calculator: "Kalkulyator",
      about: "Biz haqimizda",
      request: "Ariza qoldirish",
      languageAria: "Tilni tanlash",
      logoAria: "Procare bosh sahifasi",
      navAria: "Asosiy navigatsiya",
      contactAria: "Murojaat qilish",
      themeLight: "Light mode yoqish",
      themeDark: "Dark mode yoqish"
    },
    languageDialogTitle: "Ilova tili",
    breadcrumb: {
      home: "Asosiy",
      current: "Kalkulyator",
      back: "Bosh sahifaga qaytish"
    },
    page: {
      eyebrow: "Procare kalkulyatori",
      title: "Qurilma, model va muammoni tanlang"
    },
    sections: {
      device: "Qurilma turini tanlang",
      deviceMeta: "3 turdagi qurilma",
      expand: "Ko'proq ko'rsatish",
      collapse: "Kamroq ko'rsatish",
      model: "Modelni tanlang",
      family: "iPhone oilasi",
      problems: "Muammolarni tanlang",
      selectedCount: "ta tanlangan",
      search: "Qidirish"
    },
    report: {
      number: "Hisobot #PC-214",
      title: "Narx hisoboti",
      deviceHint: "Diagnostika va ta'mir ishlari",
      selectedProblems: "Tanlangan muammolar",
      services: "Xizmatlar",
      promoDiscount: "Promokod chegirmasi",
      total: "Jami to'lov",
      cta: "Ariza qoldirish",
      finePrint: "Haqiqiy narxlar diagnostikadan keyin tasdiqlanadi",
      empty: "Muammo tanlanmagan",
      itemSuffix: "ta"
    },
    promo: {
      title: "Promokod",
      placeholder: "Promokodni kiriting",
      button: "Qo'llash"
    },
    app: {
      appStore: "App Store QR-kodi",
      playStore: "Play Market QR-kodi",
      qrText: "Hoziroq buyurtmani boshlang",
      note: "Barcha huquqlar himoyalangan va yuklab olib xavfsizligi ta'minlangan"
    },
    footer: {
      offer: "Ommaviy offerta",
      privacy: "Maxfiylik siyosati",
      address: "Qoratosh ko'chasi, 5B"
    }
  },
  ru: {
    header: {
      calculator: "Калькулятор",
      about: "О нас",
      request: "Оставить заявку",
      languageAria: "Выбрать язык",
      logoAria: "Главная Procare",
      navAria: "Основная навигация",
      contactAria: "Связаться",
      themeLight: "Включить светлую тему",
      themeDark: "Включить темную тему"
    },
    languageDialogTitle: "Язык приложения",
    breadcrumb: {
      home: "Главная",
      current: "Калькулятор",
      back: "Вернуться на главную"
    },
    page: {
      eyebrow: "Калькулятор Procare",
      title: "Выберите устройство, модель и проблему"
    },
    sections: {
      device: "Выберите тип устройства",
      deviceMeta: "3 типа устройств",
      expand: "Показать больше",
      collapse: "Показать меньше",
      model: "Выберите модель",
      family: "Линейка iPhone",
      problems: "Выберите проблемы",
      selectedCount: "выбрано",
      search: "Поиск"
    },
    report: {
      number: "Отчет #PC-214",
      title: "Расчет стоимости",
      deviceHint: "Диагностика и ремонтные работы",
      selectedProblems: "Выбранные проблемы",
      services: "Услуги",
      promoDiscount: "Скидка по промокоду",
      total: "Итого",
      cta: "Оставить заявку",
      finePrint: "Финальная стоимость подтверждается после диагностики",
      empty: "Проблемы не выбраны",
      itemSuffix: "шт"
    },
    promo: {
      title: "Промокод",
      placeholder: "Введите промокод",
      button: "Применить"
    },
    app: {
      appStore: "QR-код App Store",
      playStore: "QR-код Play Market",
      qrText: "Начните заказ прямо сейчас",
      note: "Все права защищены, загрузка безопасна"
    },
    footer: {
      offer: "Публичная оферта",
      privacy: "Политика конфиденциальности",
      address: "ул. Каратас, 5B"
    }
  },
  en: {
    header: {
      calculator: "Calculator",
      about: "About us",
      request: "Leave a request",
      languageAria: "Choose language",
      logoAria: "Procare home",
      navAria: "Main navigation",
      contactAria: "Contact us",
      themeLight: "Switch to light mode",
      themeDark: "Switch to dark mode"
    },
    languageDialogTitle: "App language",
    breadcrumb: {
      home: "Home",
      current: "Calculator",
      back: "Back to home"
    },
    page: {
      eyebrow: "Procare calculator",
      title: "Choose device, model and issue"
    },
    sections: {
      device: "Choose device type",
      deviceMeta: "3 device types",
      expand: "Show more",
      collapse: "Show less",
      model: "Choose model",
      family: "iPhone lineup",
      problems: "Choose issues",
      selectedCount: "selected",
      search: "Search"
    },
    report: {
      number: "Report #PC-214",
      title: "Price report",
      deviceHint: "Diagnostics and repair service",
      selectedProblems: "Selected issues",
      services: "Services",
      promoDiscount: "Promo discount",
      total: "Total",
      cta: "Leave a request",
      finePrint: "Final pricing is confirmed after diagnostics",
      empty: "No issue selected",
      itemSuffix: "item"
    },
    promo: {
      title: "Promo code",
      placeholder: "Enter promo code",
      button: "Apply"
    },
    app: {
      appStore: "App Store QR code",
      playStore: "Play Market QR code",
      qrText: "Start your order now",
      note: "All rights reserved and the download is secured"
    },
    footer: {
      offer: "Public offer",
      privacy: "Privacy policy",
      address: "Karatosh street, 5B"
    }
  }
};

function formatPrice(price: number) {
  return `${price.toLocaleString("ru-RU")} so'm`;
}

function LanguageFlag({ src }: { src: string }) {
  return (
    <span className="language-flag" aria-hidden="true">
      <Image src={src} alt="" width={24} height={24} />
    </span>
  );
}

function LanguageChoiceList({
  activeLanguage,
  currentLanguage,
  onLanguageChange
}: {
  activeLanguage: LanguageCode;
  currentLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}) {
  return (
    <div className="language-options" role="listbox" aria-label={calculatorCopy[currentLanguage].header.languageAria}>
      {languageOptions.map((language) => {
        const isActive = language.code === activeLanguage;

        return (
          <button
            aria-selected={isActive}
            className={`language-option ${isActive ? "is-active" : ""}`}
            key={language.code}
            role="option"
            type="button"
            onClick={() => onLanguageChange(language.code)}
          >
            <LanguageFlag src={language.flagSrc} />
            <span>{language.labels[currentLanguage]}</span>
            <span className="language-radio" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}

function HeaderSunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="header-action-icon header-action-icon--sun"
      focusable="false"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM4.39861 4.39861C4.6915 4.10572 5.16638 4.10572 5.45927 4.39861L5.85211 4.79145C6.145 5.08434 6.145 5.55921 5.85211 5.85211C5.55921 6.145 5.08434 6.145 4.79145 5.85211L4.39861 5.45927C4.10572 5.16638 4.10572 4.6915 4.39861 4.39861ZM19.6011 4.39887C19.894 4.69176 19.894 5.16664 19.6011 5.45953L19.2083 5.85237C18.9154 6.14526 18.4405 6.14526 18.1476 5.85237C17.8547 5.55947 17.8547 5.0846 18.1476 4.79171L18.5405 4.39887C18.8334 4.10598 19.3082 4.10598 19.6011 4.39887ZM12 6.75C9.1005 6.75 6.75 9.1005 6.75 12C6.75 14.8995 9.1005 17.25 12 17.25C14.8995 17.25 17.25 14.8995 17.25 12C17.25 9.1005 14.8995 6.75 12 6.75ZM5.25 12C5.25 8.27208 8.27208 5.25 12 5.25C15.7279 5.25 18.75 8.27208 18.75 12C18.75 15.7279 15.7279 18.75 12 18.75C8.27208 18.75 5.25 15.7279 5.25 12ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12ZM18.1476 18.1476C18.4405 17.8547 18.9154 17.8547 19.2083 18.1476L19.6011 18.5405C19.894 18.8334 19.894 19.3082 19.6011 19.6011C19.3082 19.894 18.8334 19.894 18.5405 19.6011L18.1476 19.2083C17.8547 18.9154 17.8547 18.4405 18.1476 18.1476ZM5.85211 18.1479C6.145 18.4408 6.145 18.9157 5.85211 19.2086L5.45927 19.6014C5.16638 19.8943 4.6915 19.8943 4.39861 19.6014C4.10572 19.3085 4.10572 18.8336 4.39861 18.5407L4.79145 18.1479C5.08434 17.855 5.55921 17.855 5.85211 18.1479ZM12 20.25C12.4142 20.25 12.75 20.5858 12.75 21V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V21C11.25 20.5858 11.5858 20.25 12 20.25Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function DeviceIcon({ type }: { type: Device["icon"] }) {
  if (type === "tablet") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6" y="3" width="12" height="18" rx="2.5" />
        <path d="M11.4 18h1.2" />
      </svg>
    );
  }

  if (type === "watch") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 5.2 9.8 2h4.4l.8 3.2" />
        <rect x="8" y="5" width="8" height="14" rx="4" />
        <path d="m9 18.8.8 3.2h4.4l.8-3.2M11 9h2" />
      </svg>
    );
  }

  if (type === "laptop") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.5A1.5 1.5 0 0 1 6.5 5h11A1.5 1.5 0 0 1 19 6.5V16H5z" />
        <path d="M3 18h18l-1.4 1.5H4.4z" />
      </svg>
    );
  }

  if (type === "earbuds") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.5 5.5a3 3 0 0 0-3 3v2a2 2 0 0 0 2 2h1v5.2a1.8 1.8 0 0 0 3.6 0V8.8a3.3 3.3 0 0 0-3.6-3.3Z" />
        <path d="M15.5 5.5a3 3 0 0 1 3 3v2a2 2 0 0 1-2 2h-1v5.2a1.8 1.8 0 0 1-3.6 0V8.8a3.3 3.3 0 0 1 3.6-3.3Z" />
      </svg>
    );
  }

  if (type === "desktop") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4" y="4" width="16" height="12" rx="2" />
        <path d="M10 20h4M12 16v4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="7" y="3" width="10" height="18" rx="2.5" />
      <path d="M11 6h2" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m3.5 8.2 2.6 2.6 6.4-6.6" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="7" cy="7" r="4.8" />
      <path d="m10.8 10.8 2.7 2.7" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m5 6 3-3 3 3M5 10l3 3 3-3" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 6 9 12l6 6" />
    </svg>
  );
}

function ProcareCalculatorHeader({
  theme,
  language,
  content,
  onThemeToggle,
  onLanguageChange
}: {
  theme: ThemeMode;
  language: LanguageCode;
  content: CalculatorContent;
  onThemeToggle: () => void;
  onLanguageChange: (language: LanguageCode) => void;
}) {
  const [isLanguagePickerOpen, setLanguagePickerOpen] = useState(false);
  const languageSwitcherRef = useRef<HTMLDivElement>(null);
  const selectedLanguage = languageOptions.find((option) => option.code === language) ?? languageOptions[0];
  const nextThemeLabel = theme === "dark" ? content.header.themeLight : content.header.themeDark;

  useEffect(() => {
    if (!isLanguagePickerOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLanguagePickerOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLanguagePickerOpen]);

  useEffect(() => {
    if (!isLanguagePickerOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (languageSwitcherRef.current?.contains(target)) {
        return;
      }

      if (target instanceof Element && target.closest(".language-dialog")) {
        return;
      }

      setLanguagePickerOpen(false);
    };

    window.addEventListener("pointerdown", handlePointerDown);

    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, [isLanguagePickerOpen]);

  const handleLanguageChange = (nextLanguage: LanguageCode) => {
    onLanguageChange(nextLanguage);
    setLanguagePickerOpen(false);
  };

  return (
    <header className="calc-site-header">
      <button
        aria-expanded={isLanguagePickerOpen}
        aria-haspopup="dialog"
        className="calc-language-button"
        type="button"
        aria-label={content.header.languageAria}
        onClick={() => setLanguagePickerOpen(true)}
      >
        <LanguageFlag src={selectedLanguage.flagSrc} />
      </button>

      <Link className="calc-logo-link" href="/" aria-label={content.header.logoAria}>
        <Image src={asset("procare-logo-header.svg")} alt="Procare" width={136} height={45} priority />
      </Link>

      <nav className="calc-main-nav" aria-label={content.header.navAria}>
        <Link href="/calculator">{content.header.calculator}</Link>
        <Link href="/#why-procare">{content.header.about}</Link>
      </nav>

      <div className="calc-header-actions">
        <button
          aria-label={nextThemeLabel}
          aria-pressed={theme === "dark"}
          className="calc-icon-button"
          type="button"
          onClick={onThemeToggle}
        >
          {theme === "dark" ? (
            <HeaderSunIcon />
          ) : (
            <Image className="header-action-icon" src={asset("header-moon.svg")} alt="" width={20} height={20} />
          )}
        </button>
        <span className="calc-header-divider" aria-hidden="true" />
        <div className="language-switcher" ref={languageSwitcherRef}>
          <button
            aria-expanded={isLanguagePickerOpen}
            aria-haspopup="listbox"
            className="calc-language-switch"
            type="button"
            aria-label={content.header.languageAria}
            onClick={() => setLanguagePickerOpen((isOpen) => !isOpen)}
          >
            <LanguageFlag src={selectedLanguage.flagSrc} />
            <span>{selectedLanguage.shortLabel}</span>
          </button>
          {isLanguagePickerOpen ? (
            <div className="language-menu">
              <LanguageChoiceList
                activeLanguage={language}
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          ) : null}
        </div>
        <Link className="calc-request-link" href="/#contact">
          {content.header.request}
        </Link>
        <Link className="calc-icon-button calc-mobile-chat" href="/#contact" aria-label={content.header.contactAria}>
          <Image className="header-action-icon" src={asset("header-chat.svg")} alt="" width={20} height={20} />
        </Link>
      </div>

      {isLanguagePickerOpen ? (
        <div className="language-modal-backdrop" role="presentation" onClick={() => setLanguagePickerOpen(false)}>
          <div
            aria-modal="true"
            className="language-dialog"
            role="dialog"
            aria-labelledby="calculator-language-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="calculator-language-dialog-title">{content.languageDialogTitle}</h2>
            <button
              className="language-dialog-close"
              type="button"
              aria-label="Close"
              onClick={() => setLanguagePickerOpen(false)}
            />
            <LanguageChoiceList
              activeLanguage={language}
              currentLanguage={language}
              onLanguageChange={handleLanguageChange}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

function CalculatorBreadcrumb({ content }: { content: CalculatorContent }) {
  return (
    <div className="calc-breadcrumb">
      <Link className="calc-back-button" href="/" aria-label={content.breadcrumb.back}>
        <ArrowLeftIcon />
      </Link>
      <div>
        <Link href="/">{content.breadcrumb.home}</Link>
        <span>/</span>
        <span>{content.breadcrumb.current}</span>
      </div>
    </div>
  );
}

function DeviceSelector({
  activeDevice,
  expanded,
  language,
  content,
  onSelect,
  onToggleExpanded
}: {
  activeDevice: string;
  expanded: boolean;
  language: LanguageCode;
  content: CalculatorContent;
  onSelect: (id: string) => void;
  onToggleExpanded: () => void;
}) {
  const visibleDevices = expanded ? devices : devices.slice(0, 4);

  return (
    <section className={`calc-card calc-card--device ${expanded ? "is-expanded" : ""}`}>
      <div className="calc-card-heading">
        <div>
          <p>{content.page.eyebrow}</p>
          <h1>{content.page.title}</h1>
        </div>
      </div>
      <div className="calc-inner-panel">
        <div className="calc-section-title">
          <h2>{content.sections.device}</h2>
          <span>{content.sections.deviceMeta}</span>
        </div>
        <div className="calc-device-grid">
          {visibleDevices.map((device) => {
            const isSelected = device.id === activeDevice;

            return (
              <button
                className={`calc-option calc-device-option ${isSelected ? "is-selected" : ""}`}
                key={device.id}
                type="button"
                onClick={() => onSelect(device.id)}
              >
                <span className="calc-option-icon">
                  <DeviceIcon type={device.icon} />
                </span>
                <span className="calc-option-copy">
                  <strong>{device.title[language]}</strong>
                  <small>{device.description[language]}</small>
                </span>
                <span className="calc-choice-state">{isSelected ? <CheckIcon /> : null}</span>
              </button>
            );
          })}
        </div>
        <button className="calc-more-button" type="button" onClick={onToggleExpanded}>
          {expanded ? content.sections.collapse : content.sections.expand}
        </button>
      </div>
    </section>
  );
}

function ModelSelector({
  language,
  model,
  isOpen,
  content,
  onModelChange,
  onToggleOpen
}: {
  language: LanguageCode;
  model: string;
  isOpen: boolean;
  content: CalculatorContent;
  onModelChange: (model: string) => void;
  onToggleOpen: () => void;
}) {
  const languageModels = models[language];

  return (
    <section className="calc-card calc-card--model">
      <div className="calc-section-title">
        <h2>{content.sections.model}</h2>
        <span>{content.sections.family}</span>
      </div>
      <button className="calc-select" type="button" aria-expanded={isOpen} onClick={onToggleOpen}>
        <span>{model}</span>
        <ChevronIcon />
      </button>
      {isOpen ? (
        <div className="calc-dropdown">
          <div className="calc-dropdown-search">
            <SearchIcon />
            <span>{content.sections.search}</span>
          </div>
          <div className="calc-dropdown-list">
            {languageModels.map((nextModel) => (
              <button
                className={nextModel === model ? "is-active" : ""}
                key={nextModel}
                type="button"
                onClick={() => {
                  onModelChange(nextModel);
                  onToggleOpen();
                }}
              >
                {nextModel}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ProblemsSelector({
  language,
  content,
  selectedProblems,
  onToggleProblem
}: {
  language: LanguageCode;
  content: CalculatorContent;
  selectedProblems: string[];
  onToggleProblem: (id: string) => void;
}) {
  return (
    <section className="calc-card calc-card--problems">
      <div className="calc-section-title">
        <h2>{content.sections.problems}</h2>
        <span>
          <b>{selectedProblems.length}</b> {content.sections.selectedCount}
        </span>
      </div>
      <div className="calc-problem-grid">
        {problems.map((problem) => {
          const isSelected = selectedProblems.includes(problem.id);

          return (
            <button
              className={`calc-problem-option ${isSelected ? "is-selected" : ""}`}
              key={problem.id}
              type="button"
              onClick={() => onToggleProblem(problem.id)}
            >
              <span className="calc-checkbox">{isSelected ? <CheckIcon /> : null}</span>
              <span>
                <strong>{problem.title[language]}</strong>
                <small>{formatPrice(problem.price)}</small>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function ReportContent({
  language,
  model,
  content,
  selectedProblemItems,
  total
}: {
  language: LanguageCode;
  model: string;
  content: CalculatorContent;
  selectedProblemItems: ServiceProblem[];
  total: number;
}) {
  const selectedCount = selectedProblemItems.length;
  const itemLabel =
    language === "en"
      ? `${selectedCount} ${selectedCount === 1 ? content.report.itemSuffix : `${content.report.itemSuffix}s`}`
      : `${selectedCount} ${content.report.itemSuffix}`;

  return (
    <div className="calc-report-content">
      <div className="calc-report-heading">
        <p>{content.report.number}</p>
        <h2>{content.report.title}</h2>
      </div>
      <div className="calc-report-device">
        <span className="calc-option-icon">
          <DeviceIcon type="phone" />
        </span>
        <span>
          <strong>{model}</strong>
          <small>{content.report.deviceHint}</small>
        </span>
      </div>
      <div className="calc-report-card">
        <div className="calc-report-card-title">
          <h3>{content.report.selectedProblems}</h3>
          <span>{itemLabel}</span>
        </div>
        {selectedProblemItems.length ? (
          selectedProblemItems.map((problem) => (
            <div className="calc-report-service" key={problem.id}>
              <span className="calc-service-mark">
                <CheckIcon />
              </span>
              <span>
                <strong>{problem.title[language]}</strong>
                <small>{problem.duration[language]}</small>
              </span>
              <b>{formatPrice(problem.price)}</b>
            </div>
          ))
        ) : (
          <p className="calc-empty-report">{content.report.empty}</p>
        )}
      </div>
      <div className="calc-report-card calc-report-total">
        <div>
          <span>{content.report.services}</span>
          <strong>{formatPrice(total)}</strong>
        </div>
        <div>
          <span>{content.report.promoDiscount}</span>
          <strong>{formatPrice(0)}</strong>
        </div>
        <hr />
        <div className="calc-final-row">
          <span>{content.report.total}</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>
      <Link className="calc-report-cta" href="/#contact">
        {content.report.cta}
      </Link>
      <p className="calc-report-fine">{content.report.finePrint}</p>
    </div>
  );
}

function PromoCodeCard({ content }: { content: CalculatorContent }) {
  return (
    <section className="calc-card calc-promo-card">
      <h2>{content.promo.title}</h2>
      <div>
        <input aria-label={content.promo.title} placeholder={content.promo.placeholder} />
        <button type="button">{content.promo.button}</button>
      </div>
    </section>
  );
}

function CalculatorAppPromo({ content }: { content: CalculatorContent }) {
  return (
    <section className="calc-app-promo">
      <div className="calc-qr-card calc-qr-card--left">
        <Image src={asset("qr-image.svg")} alt="" width={90} height={90} />
        <div>
          <h2>{content.app.appStore}</h2>
          <p>{content.app.qrText}</p>
        </div>
      </div>
      <div className="calc-qr-card calc-qr-card--right">
        <div>
          <h2>{content.app.playStore}</h2>
          <p>{content.app.qrText}</p>
        </div>
        <Image src={asset("qr-image.svg")} alt="" width={90} height={90} />
      </div>
      <Image className="calc-app-logo" src={asset("procare-logo-header.svg")} alt="Procare" width={189} height={63} />
      <p className="calc-app-note">* {content.app.note}</p>
      <Image className="calc-app-phone calc-app-phone--left" src={asset("app-phone-left.png")} alt="" width={402} height={789} />
      <Image className="calc-app-phone calc-app-phone--top" src={asset("app-phone-top.png")} alt="" width={408} height={801} />
    </section>
  );
}

function CalculatorFooter({ content }: { content: CalculatorContent }) {
  return (
    <footer className="calc-footer">
      <div className="calc-footer-card">
        <Image src={asset("footer-logo.svg")} alt="Procare" width={136} height={45} />
        <div className="calc-footer-contacts">
          <a href="tel:+998781134774">+998 78 113 47 74</a>
          <a href="mailto:procare@gmail.com">procare@gmail.com</a>
          <span>{content.footer.address}</span>
        </div>
        <div className="calc-footer-socials">
          {["footer-telegram.svg", "footer-instagram.svg", "footer-youtube.svg", "footer-facebook.svg"].map((icon) => (
            <a href="#" key={icon} aria-label={icon.replace("footer-", "").replace(".svg", "")}>
              <Image src={asset(icon)} alt="" width={20} height={20} />
            </a>
          ))}
        </div>
      </div>
      <div className="calc-footer-bottom">
        <p>©Procare, 2026</p>
        <div>
          <a href="#">{content.footer.offer}</a>
          <a href="#">{content.footer.privacy}</a>
        </div>
      </div>
    </footer>
  );
}

export default function ProcareCalculatorPage({ variant = "default" }: ProcareCalculatorPageProps) {
  const { theme, setTheme, language, setLanguage } = useProcarePreferences();
  const [isExpanded, setExpanded] = useState(variant === "selection");
  const [isDropdownOpen, setDropdownOpen] = useState(variant === "selection");
  const [activeDevice, setActiveDevice] = useState("iphone");
  const [selectedModel, setSelectedModel] = useState(models.uz[0]);
  const [selectedProblems, setSelectedProblems] = useState<string[]>(["display"]);
  const [isMobileReportOpen, setMobileReportOpen] = useState(false);
  const content = calculatorCopy[language];
  const selectedProblemItems = problems.filter((problem) => selectedProblems.includes(problem.id));
  const total = selectedProblemItems.reduce((sum, problem) => sum + problem.price, 0);

  useEffect(() => {
    setSelectedModel((current) => (models[language].includes(current) ? current : models[language][0]));
  }, [language]);

  useEffect(() => {
    if (!isMobileReportOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMobileReportOpen]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  const handleToggleProblem = (id: string) => {
    setSelectedProblems((current) => {
      if (current.includes(id)) {
        return current.filter((problemId) => problemId !== id);
      }

      return [...current, id];
    });
  };

  return (
    <>
      <ProcareCalculatorHeader
        theme={theme}
        language={language}
        content={content}
        onThemeToggle={toggleTheme}
        onLanguageChange={setLanguage}
      />
      <main className="calc-page" data-language={language} data-theme={theme}>
        <div className="calc-shell">
          <CalculatorBreadcrumb content={content} />
          <div className="calc-workspace">
            <div className="calc-form-column">
              <DeviceSelector
                activeDevice={activeDevice}
                expanded={isExpanded}
                language={language}
                content={content}
                onSelect={setActiveDevice}
                onToggleExpanded={() => setExpanded((current) => !current)}
              />
              <ModelSelector
                language={language}
                isOpen={isDropdownOpen}
                model={selectedModel}
                content={content}
                onModelChange={setSelectedModel}
                onToggleOpen={() => setDropdownOpen((current) => !current)}
              />
              <ProblemsSelector
                language={language}
                content={content}
                selectedProblems={selectedProblems}
                onToggleProblem={handleToggleProblem}
              />
            </div>
            <div className="calc-side-column">
              <aside className="calc-report-desktop" aria-label={content.report.title}>
                <ReportContent
                  language={language}
                  model={selectedModel}
                  content={content}
                  selectedProblemItems={selectedProblemItems}
                  total={total}
                />
              </aside>
              <PromoCodeCard content={content} />
            </div>
          </div>
          <CalculatorAppPromo content={content} />
        </div>
        <CalculatorFooter content={content} />
      </main>

      <button
        className="calc-mobile-sheet-preview"
        type="button"
        aria-expanded={isMobileReportOpen}
        onClick={() => setMobileReportOpen(true)}
      >
        <span className="calc-sheet-handle" />
        <span className="calc-final-row">
          <span>{content.report.total}</span>
          <strong>{formatPrice(total)}</strong>
        </span>
        <span className="calc-report-cta">{content.report.cta}</span>
        <small>{content.report.finePrint}</small>
      </button>

      {isMobileReportOpen ? (
        <div className="calc-sheet-backdrop" role="presentation" onClick={() => setMobileReportOpen(false)}>
          <aside
            className="calc-mobile-sheet"
            aria-label={content.report.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="calc-sheet-close" type="button" aria-label="Yopish" onClick={() => setMobileReportOpen(false)}>
              <span className="calc-sheet-handle" />
            </button>
            <ReportContent
              language={language}
              model={selectedModel}
              content={content}
              selectedProblemItems={selectedProblemItems}
              total={total}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
