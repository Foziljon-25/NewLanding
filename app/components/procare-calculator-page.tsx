"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AppDownload as SharedAppDownload,
  Faq as SharedFaq,
  Footer as SharedFooter,
  Header as SharedHeader,
  MaskIcon,
  RequestDialogPortal,
  type RequestDialogContent,
  type RequestDialogInitialDevice
} from "./procare-layout-sections";
import { useProcarePreferences, type LanguageCode, type ThemeMode } from "./use-procare-preferences";
import {
  getCalculatorOsTypes,
  getCalculatorPhoneCategories,
  getCalculatorProblemCategories,
  isCalculatorApiConfigured,
  type CalculatorOsTypeDto,
  type CalculatorPhoneCategoryDto,
  type CalculatorProblemCategoryDto
} from "../lib/calculator-api";
import {
  getMockCalculatorOsTypes,
  getMockCalculatorPhoneCategories,
  getMockCalculatorProblemCategories
} from "../lib/calculator-mock-data";

const asset = (name: string) => `/assets/procare/${name}`;

type CalculatorVariant = "default" | "selection";

type LoadState = "idle" | "loading" | "ready" | "error";

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
  requestDialog: RequestDialogContent;
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
    loading: string;
    retry: string;
    unavailable: string;
    empty: string;
    previous: string;
    chooseCategory: string;
    osMetaSuffix: string;
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
    socialsAria: string;
  };
};

type ProcareCalculatorPageProps = {
  variant?: CalculatorVariant;
};

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

const calculatorFooterSocialLinks = [
  { label: "Telegram", href: "https://t.me/proboxuzbot", icon: "footer-telegram.svg" },
  { label: "Instagram", href: "https://www.instagram.com/proboxuz", icon: "footer-instagram.svg" },
  { label: "YouTube", href: "https://www.youtube.com/@Proboxuz", icon: "footer-youtube.svg" },
  { label: "Facebook", href: "https://www.facebook.com/probox.apple.uz", icon: "footer-facebook.svg" }
] as const;

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
    requestDialog: {
      title: "Ariza qoldirish",
      namePlaceholder: "Ismingiz",
      phonePlaceholder: "+998 00 000 00 00",
      osTypePlaceholder: "Operatsion sistema",
      deviceTypePlaceholder: "Telefon turi",
      otherDevicePlaceholder: "Qurilma turini yozing",
      messagePlaceholder: "Izoh",
      deviceTypes: ["iPhone", "iPad", "MacBook", "Apple Watch", "Samsung", "Xiaomi", "Boshqa"],
      cancel: "Bekor qilish",
      submit: "Yuborish",
      submitting: "Yuborilmoqda",
      successTitle: "Tabriklaymiz!",
      successMessage: "Ariza qoldirganingiz uchun tashakkur. Tez orada operatorlarimiz siz bilan bog'lanishadi.",
      successMessageMobile:
        "Siz muvaffaqiyatli tarzda ariza qoldirdingiz. Tez orada operatorlarimiz siz bilan bog'lanishadi. E'tiboringiz uchun tashakkur!",
      success: "Arizangiz qabul qilindi. Operator tez orada bog'lanadi.",
      error: "Arizani yuborib bo'lmadi. Iltimos, keyinroq urinib ko'ring.",
      requiredError: "Ism, telefon raqam va telefon turini kiriting.",
      phoneError: "Telefon raqamni +998 00 000 00 00 formatida kiriting.",
      apiNotConfigured: "Ariza API manzili sozlanmagan.",
      closeAria: "Modal oynani yopish",
      clearOtherDeviceAria: "Boshqa qurilma turini olib tashlash"
    },
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
      search: "Qidirish",
      loading: "Yuklanmoqda...",
      retry: "Qayta urinish",
      unavailable: "Ma'lumotlarni yuklab bo'lmadi",
      empty: "Ma'lumot topilmadi",
      previous: "Orqaga",
      chooseCategory: "Qurilma/modelni tanlang",
      osMetaSuffix: "operatsion tizim"
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
      address: "Qoratosh ko'chasi, 5B",
      socialsAria: "Ijtimoiy tarmoqlar"
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
    requestDialog: {
      title: "Оставить заявку",
      namePlaceholder: "Ваше имя",
      phonePlaceholder: "+998 00 000 00 00",
      osTypePlaceholder: "Операционная система",
      deviceTypePlaceholder: "Тип телефона",
      otherDevicePlaceholder: "Напишите тип устройства",
      messagePlaceholder: "Комментарий",
      deviceTypes: ["iPhone", "iPad", "MacBook", "Apple Watch", "Samsung", "Xiaomi", "Другое"],
      cancel: "Отменить",
      submit: "Отправить",
      submitting: "Отправка",
      successTitle: "Поздравляем!",
      successMessage: "Спасибо за вашу заявку. Наши операторы скоро свяжутся с вами.",
      successMessageMobile: "Вы успешно оставили заявку. Наши операторы скоро свяжутся с вами. Спасибо за внимание!",
      success: "Заявка принята. Оператор скоро свяжется с вами.",
      error: "Не удалось отправить заявку. Попробуйте позже.",
      requiredError: "Укажите имя, номер телефона и тип телефона.",
      phoneError: "Введите номер телефона в формате +998 00 000 00 00.",
      apiNotConfigured: "Адрес API для заявок не настроен.",
      closeAria: "Закрыть модальное окно",
      clearOtherDeviceAria: "Удалить другой тип устройства"
    },
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
      search: "Поиск",
      loading: "Загрузка...",
      retry: "Повторить",
      unavailable: "Не удалось загрузить данные",
      empty: "Данные не найдены",
      previous: "Назад",
      chooseCategory: "Выберите устройство/модель",
      osMetaSuffix: "операционные системы"
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
      address: "ул. Каратас, 5B",
      socialsAria: "Социальные сети"
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
    requestDialog: {
      title: "Leave a request",
      namePlaceholder: "Your name",
      phonePlaceholder: "+998 00 000 00 00",
      osTypePlaceholder: "Operating system",
      deviceTypePlaceholder: "Phone type",
      otherDevicePlaceholder: "Describe the device type",
      messagePlaceholder: "Comment",
      deviceTypes: ["iPhone", "iPad", "MacBook", "Apple Watch", "Samsung", "Xiaomi", "Other"],
      cancel: "Cancel",
      submit: "Send",
      submitting: "Sending",
      successTitle: "Congratulations!",
      successMessage: "Thank you for leaving a request. Our operators will contact you soon.",
      successMessageMobile: "Your request was submitted successfully. Our operators will contact you soon. Thank you!",
      success: "Your request has been received. An operator will contact you soon.",
      error: "Could not send the request. Please try again later.",
      requiredError: "Enter your name, phone number and phone type.",
      phoneError: "Enter the phone number in +998 00 000 00 00 format.",
      apiNotConfigured: "Request API URL is not configured.",
      closeAria: "Close modal",
      clearOtherDeviceAria: "Remove other device type"
    },
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
      search: "Search",
      loading: "Loading...",
      retry: "Retry",
      unavailable: "Could not load data",
      empty: "No data found",
      previous: "Back",
      chooseCategory: "Choose device/model",
      osMetaSuffix: "operating systems"
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
      address: "Karatosh street, 5B",
      socialsAria: "Social networks"
    }
  }
};

const calculatorFaqCopy = {
  uz: {
    faq: {
      title: "Ko'p so'raladigan savollar",
      accent: "savollar",
      items: [
        {
          question: "iPhone’ni ta’mirlash qancha vaqt oladi?",
          subtext: "Ko‘p uchraydigan ta’mirlar odatda shu kunning o‘zida yakunlanadi.",
          answer:
            "Odatda ta’mirlash ishlari 30 daqiqadan 2 soatgacha davom etadi. Murakkab muammolar esa to‘liq diagnostikani talab qilishi mumkin."
        },
        {
          question: "Sizlar asl ehtiyot qismlardan foydalanasizlarmi?",
          subtext: "Har bir detal qurilmaga mosligi va sifat darajasi bo‘yicha tanlanadi.",
          answer:
            "Ha, imkon qadar original yoki originalga maksimal yaqin, tekshirilgan sifatdagi ehtiyot qismlar bilan ishlaymiz. Qurilmangiz modeli va ta’mir turiga qarab bir nechta variantni oldindan tushuntirib beramiz."
        },
        {
          question: "Apple mahsulotim ta'mirlangandan so'ng qanday kafolat olishim mumkin?",
          subtext: "Bajarilgan ish turiga qarab kafolat muddati rasmiy tarzda beriladi.",
          answer:
            "Ta’mirdan so‘ng bajarilgan ish va o‘rnatilgan detal turiga qarab kafolat beriladi. Qurilmani topshirayotganda kafolat shartlari, amal qilish muddati va murojaat qilish tartibini aniq ko‘rsatib beramiz."
        },
        {
          question: "Mahsulotimni ta'mirlash uchun qanday yo'l tutishim kerak?",
          subtext: "Qabul jarayoni sodda: murojaat, diagnostika, tasdiq va ta’mir.",
          answer:
            "Servis markazimizga qurilmangiz bilan kelishingiz yoki oldindan bog‘lanib muammo haqida qisqacha ma’lumot qoldirishingiz mumkin. Qurilma qabul qilingach diagnostika o‘tkaziladi, so‘ng narx va muddat tasdiqlanib, ta’mir jarayoni boshlanadi."
        },
        {
          question: "Agar men iPhone'ni o‘zim ta'mirlashga urinib ko‘rsam, bu kafolatga ta'sir qiladimi?",
          subtext: "Noto‘g‘ri ochish yoki aralashuv ayrim holatlarda keyingi servis jarayoniga ta’sir qiladi.",
          answer:
            "Ha, mustaqil ravishda noto‘g‘ri ochish, nomos detal ishlatish yoki ichki qismlarga zarar yetkazish kafolatga ta’sir qilishi mumkin. Shu sababli qurilmaga aralashishdan oldin servis diagnostikasidan o‘tkazish tavsiya etiladi."
        },
        {
          question: "Sizlar faqat iPhone’ni ta'mirlaysizlarmi, yoki boshqa Apple mahsulotlarini ham qabul qilasiz?",
          subtext: "Servis doiramiz iPhone bilan cheklanmaydi.",
          answer:
            "Yo‘q, biz iPhone bilan birga iPad, MacBook, Apple Watch va ayrim boshqa Apple qurilmalarini ham qabul qilamiz. Qurilma turiga qarab diagnostika va ta’mir tartibi alohida belgilanadi."
        }
      ]
    }
  },
  ru: {
    faq: {
      title: "Часто задаваемые вопросы",
      accent: "вопросы",
      items: [
        {
          question: "Сколько времени занимает ремонт iPhone?",
          subtext: "Распространенные виды ремонта обычно завершаются в тот же день.",
          answer:
            "Обычно ремонт занимает от 30 минут до 2 часов. Сложные неисправности могут потребовать полной диагностики."
        },
        {
          question: "Вы используете оригинальные запчасти?",
          subtext: "Каждая деталь подбирается по совместимости и уровню качества.",
          answer:
            "Да, по возможности мы используем оригинальные или максимально близкие к оригиналу проверенные запчасти. В зависимости от модели и типа ремонта заранее объясняем доступные варианты."
        },
        {
          question: "Какую гарантию я получу после ремонта Apple-устройства?",
          subtext: "Срок гарантии зависит от типа выполненной работы.",
          answer:
            "После ремонта гарантия предоставляется в зависимости от выполненной работы и установленной детали. При выдаче устройства мы четко объясняем условия, срок действия и порядок обращения."
        },
        {
          question: "Что нужно сделать, чтобы сдать устройство в ремонт?",
          subtext: "Процесс простой: обращение, диагностика, согласование и ремонт.",
          answer:
            "Вы можете прийти в сервисный центр с устройством или заранее связаться с нами и кратко описать проблему. После приема проводится диагностика, согласуются цена и сроки, затем начинается ремонт."
        },
        {
          question: "Повлияет ли самостоятельный ремонт iPhone на гарантию?",
          subtext: "Неправильное вскрытие или вмешательство может повлиять на дальнейшее обслуживание.",
          answer:
            "Да, самостоятельное вскрытие, использование неподходящих деталей или повреждение внутренних компонентов может повлиять на гарантию. Поэтому перед вмешательством рекомендуем пройти сервисную диагностику."
        },
        {
          question: "Вы ремонтируете только iPhone или принимаете другие устройства Apple?",
          subtext: "Наш сервис не ограничивается iPhone.",
          answer:
            "Нет, кроме iPhone мы также принимаем iPad, MacBook, Apple Watch и некоторые другие устройства Apple. Порядок диагностики и ремонта зависит от типа устройства."
        }
      ]
    }
  },
  en: {
    faq: {
      title: "Frequently asked questions",
      accent: "questions",
      items: [
        {
          question: "How long does iPhone repair take?",
          subtext: "Common repairs are usually completed the same day.",
          answer:
            "Repair usually takes from 30 minutes to 2 hours. More complex issues may require full diagnostics."
        },
        {
          question: "Do you use genuine spare parts?",
          subtext: "Each part is selected for device compatibility and quality level.",
          answer:
            "Yes. Whenever possible, we use original or carefully verified parts that are as close to original quality as possible. Depending on the model and repair type, we explain the available options in advance."
        },
        {
          question: "What warranty do I get after my Apple product is repaired?",
          subtext: "The warranty period is provided officially based on the work performed.",
          answer:
            "After repair, the warranty depends on the completed work and the installed part. When the device is returned, we clearly explain the warranty terms, duration and support process."
        },
        {
          question: "What should I do to repair my product?",
          subtext: "The intake process is simple: request, diagnostics, approval and repair.",
          answer:
            "You can visit our service center with your device or contact us in advance with a short description of the issue. After intake, diagnostics are performed, the price and timing are approved, and repair begins."
        },
        {
          question: "Will trying to repair my iPhone myself affect the warranty?",
          subtext: "Incorrect opening or intervention can affect further service in some cases.",
          answer:
            "Yes. Opening the device incorrectly, using incompatible parts or damaging internal components can affect the warranty. We recommend service diagnostics before any intervention."
        },
        {
          question: "Do you only repair iPhones, or do you accept other Apple products too?",
          subtext: "Our service scope is not limited to iPhone.",
          answer:
            "No, in addition to iPhone we also accept iPad, MacBook, Apple Watch and some other Apple devices. Diagnostics and repair flow are defined separately based on the device type."
        }
      ]
    }
  }
} satisfies Record<LanguageCode, { faq: { title: string; accent: string; items: Array<{ question: string; subtext: string; answer: string }> } }>;

function formatPrice(price: number) {
  return `${price.toLocaleString("ru-RU")} so'm`;
}

function getLocalizedName(
  item: Pick<CalculatorOsTypeDto | CalculatorPhoneCategoryDto | CalculatorProblemCategoryDto, "name_uz" | "name_ru" | "name_en">,
  language: LanguageCode
) {
  return item[`name_${language}`] || item.name_uz || item.name_ru || item.name_en;
}

function parseApiPrice(value: string) {
  const parsedPrice = Number.parseFloat(value);

  return Number.isFinite(parsedPrice) ? Math.round(parsedPrice) : 0;
}

function formatDuration(minutes: number, language: LanguageCode) {
  if (!minutes) {
    return "";
  }

  if (language === "ru") {
    return `${minutes} минут`;
  }

  if (language === "en") {
    return `${minutes} minutes`;
  }

  return `${minutes} minut`;
}

function getOsIcon(name: string): Device["icon"] {
  const normalizedName = name.toLowerCase();

  if (normalizedName.includes("watch")) {
    return "watch";
  }

  if (normalizedName.includes("ipad") || normalizedName.includes("tablet")) {
    return "tablet";
  }

  if (normalizedName.includes("mac") || normalizedName.includes("laptop")) {
    return "laptop";
  }

  return "phone";
}

function mapOsToDevice(osType: CalculatorOsTypeDto, language: LanguageCode): Device {
  const name = getLocalizedName(osType, language);

  return {
    id: osType.id,
    title: {
      uz: getLocalizedName(osType, "uz"),
      ru: getLocalizedName(osType, "ru"),
      en: getLocalizedName(osType, "en")
    },
    description: {
      uz: "Operatsion tizim",
      ru: "Операционная система",
      en: "Operating system"
    },
    icon: getOsIcon(name)
  };
}

function mapProblemToService(problem: CalculatorProblemCategoryDto): ServiceProblem {
  return {
    id: problem.id,
    title: {
      uz: getLocalizedName(problem, "uz"),
      ru: getLocalizedName(problem, "ru"),
      en: getLocalizedName(problem, "en")
    },
    price: parseApiPrice(problem.cost || problem.price),
    duration: {
      uz: formatDuration(problem.estimated_minutes, "uz"),
      ru: formatDuration(problem.estimated_minutes, "ru"),
      en: formatDuration(problem.estimated_minutes, "en")
    }
  };
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
  if (type === "phone") {
    return <MaskIcon src={asset("calc-device-phone.svg")} width={17.5} height={21.5} color="currentColor" />;
  }

  if (type === "tablet") {
    return <MaskIcon src={asset("calc-device-tablet.svg")} width={16} height={20} color="currentColor" />;
  }

  if (type === "watch") {
    return <MaskIcon src={asset("calc-device-watch.svg")} width={12} height={20} color="currentColor" />;
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

  return <MaskIcon src={asset("calc-device-phone.svg")} width={17.5} height={21.5} color="currentColor" />;
}

function CheckIcon() {
  return <MaskIcon src={asset("calc-checkmark.svg")} width={16} height={16} color="currentColor" />;
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
  return <MaskIcon src={asset("calc-back-icon.svg")} width={20} height={20} color="currentColor" />;
}

function DropdownBackIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M12.5 4.5 7 10l5.5 5.5" />
      <path d="M7.5 10H16" />
    </svg>
  );
}

function ReportMarkIcon() {
  return <MaskIcon src={asset("calc-report-mark.svg")} width={16} height={16} color="currentColor" />;
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
  devices,
  activeDevice,
  expanded,
  language,
  content,
  status,
  error,
  onSelect,
  onRetry,
  onToggleExpanded
}: {
  devices: Device[];
  activeDevice: string;
  expanded: boolean;
  language: LanguageCode;
  content: CalculatorContent;
  status: LoadState;
  error: string | null;
  onSelect: (id: string) => void;
  onRetry: () => void;
  onToggleExpanded: () => void;
}) {
  const visibleDevices = expanded ? devices : devices.slice(0, 4);
  const deviceMeta = `${devices.length} ${content.sections.osMetaSuffix}`;

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
          <span>{deviceMeta}</span>
        </div>
        {status === "loading" ? <p className="calc-inline-state">{content.sections.loading}</p> : null}
        {status === "error" ? (
          <div className="calc-inline-state calc-inline-state--error">
            <span>{error || content.sections.unavailable}</span>
            <button type="button" onClick={onRetry}>
              {content.sections.retry}
            </button>
          </div>
        ) : null}
        {status === "ready" && devices.length === 0 ? <p className="calc-inline-state">{content.sections.empty}</p> : null}
        {devices.length > 0 ? (
          <>
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
            {devices.length > 4 ? (
              <button className="calc-more-button" type="button" onClick={onToggleExpanded}>
                {expanded ? content.sections.collapse : content.sections.expand}
              </button>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
}

function ModelSelector({
  language,
  model,
  categories,
  categoryTrail,
  searchQuery,
  status,
  error,
  isOpen,
  content,
  onCategorySelect,
  onCategoryBack,
  onSearchChange,
  onRetry,
  onToggleOpen
}: {
  language: LanguageCode;
  model: string;
  categories: CalculatorPhoneCategoryDto[];
  categoryTrail: CalculatorPhoneCategoryDto[];
  searchQuery: string;
  status: LoadState;
  error: string | null;
  isOpen: boolean;
  content: CalculatorContent;
  onCategorySelect: (category: CalculatorPhoneCategoryDto) => void;
  onCategoryBack: () => void;
  onSearchChange: (searchQuery: string) => void;
  onRetry: () => void;
  onToggleOpen: () => void;
}) {
  const familyLabel = categoryTrail.length
    ? categoryTrail.map((category) => getLocalizedName(category, language)).join(" / ")
    : content.sections.chooseCategory;

  useEffect(() => {
    if (!isOpen) {
      onSearchChange("");
    }
  }, [isOpen, onSearchChange]);

  const handleCategorySelect = (category: CalculatorPhoneCategoryDto) => {
    onSearchChange("");
    onCategorySelect(category);
  };

  return (
    <section className="calc-card calc-card--model">
      <div className="calc-section-title">
        <h2>{content.sections.model}</h2>
        <span>{familyLabel}</span>
      </div>
      <button className="calc-select" type="button" aria-expanded={isOpen} disabled={status === "loading"} onClick={onToggleOpen}>
        <span>{status === "loading" ? content.sections.loading : model || content.sections.chooseCategory}</span>
        <ChevronIcon />
      </button>
      {isOpen ? (
        <div className="calc-dropdown">
          <label className="calc-dropdown-search">
            <SearchIcon />
            <input
              aria-label={content.sections.search}
              placeholder={content.sections.search}
              type="search"
              maxLength={100}
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value.slice(0, 100))}
            />
          </label>
          {categoryTrail.length > 0 ? (
            <button className="calc-dropdown-back" type="button" onClick={onCategoryBack}>
              <DropdownBackIcon />
              <span>{content.sections.previous}</span>
            </button>
          ) : null}
          <div className="calc-dropdown-list">
            {status === "loading" ? <p className="calc-inline-state">{content.sections.loading}</p> : null}
            {status === "error" ? (
              <div className="calc-inline-state calc-inline-state--error">
                <span>{error || content.sections.unavailable}</span>
                <button type="button" onClick={onRetry}>
                  {content.sections.retry}
                </button>
              </div>
            ) : null}
            {status === "ready" && categories.length === 0 ? <p className="calc-inline-state">{content.sections.empty}</p> : null}
            {categories.map((category) => (
              <button
                className={model === getLocalizedName(category, language) ? "is-active" : ""}
                key={category.id}
                type="button"
                onClick={() => handleCategorySelect(category)}
              >
                {getLocalizedName(category, language)}
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
  problems,
  status,
  error,
  selectedProblems,
  onToggleProblem,
  onRetry
}: {
  language: LanguageCode;
  content: CalculatorContent;
  problems: ServiceProblem[];
  status: LoadState;
  error: string | null;
  selectedProblems: string[];
  onToggleProblem: (id: string) => void;
  onRetry: () => void;
}) {
  return (
    <section className="calc-card calc-card--problems">
      <div className="calc-section-title">
        <h2>{content.sections.problems}</h2>
        <span>
          <b>{selectedProblems.length}</b> {content.sections.selectedCount}
        </span>
      </div>
      {status === "loading" ? <p className="calc-inline-state">{content.sections.loading}</p> : null}
      {status === "error" ? (
        <div className="calc-inline-state calc-inline-state--error">
          <span>{error || content.sections.unavailable}</span>
          <button type="button" onClick={onRetry}>
            {content.sections.retry}
          </button>
        </div>
      ) : null}
      {status === "ready" && problems.length === 0 ? <p className="calc-inline-state">{content.sections.empty}</p> : null}
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
  total,
  onRequestOpen,
  showPromo = false
}: {
  language: LanguageCode;
  model: string;
  content: CalculatorContent;
  selectedProblemItems: ServiceProblem[];
  total: number;
  onRequestOpen: () => void;
  showPromo?: boolean;
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
          <strong>{model || content.sections.chooseCategory}</strong>
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
                <ReportMarkIcon />
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
      {showPromo ? <ReportPromoCode content={content} /> : null}
      <button className="calc-report-cta" type="button" onClick={onRequestOpen}>
        {content.report.cta}
      </button>
      <p className="calc-report-fine">{content.report.finePrint}</p>
    </div>
  );
}

function PromoCodeCard({ content }: { content: CalculatorContent }) {
  return (
    <section className="calc-card calc-promo-card">
      <h2>{content.promo.title}</h2>
      <PromoCodeFields content={content} />
    </section>
  );
}

function PromoCodeFields({ content }: { content: CalculatorContent }) {
  return (
    <div className="calc-promo-fields">
      <input aria-label={content.promo.title} placeholder={content.promo.placeholder} />
      <button type="button">{content.promo.button}</button>
    </div>
  );
}

function ReportPromoCode({ content }: { content: CalculatorContent }) {
  return (
    <section className="calc-report-card calc-report-promo">
      <h3>{content.promo.title}</h3>
      <PromoCodeFields content={content} />
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
          {calculatorFooterSocialLinks.map((link) => (
            <a href={link.href} key={link.label} aria-label={link.label} target="_blank" rel="noreferrer">
              <Image src={asset(link.icon)} alt="" width={20} height={20} />
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
  const [osTypes, setOsTypes] = useState<CalculatorOsTypeDto[]>([]);
  const [osState, setOsState] = useState<LoadState>("idle");
  const [osError, setOsError] = useState<string | null>(null);
  const [activeDevice, setActiveDevice] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<CalculatorPhoneCategoryDto[]>([]);
  const [categoryTrail, setCategoryTrail] = useState<CalculatorPhoneCategoryDto[]>([]);
  const [categorySearchQuery, setCategorySearchQuery] = useState("");
  const [debouncedCategorySearchQuery, setDebouncedCategorySearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CalculatorPhoneCategoryDto | null>(null);
  const [categoryState, setCategoryState] = useState<LoadState>("idle");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [problemOptions, setProblemOptions] = useState<ServiceProblem[]>([]);
  const [problemState, setProblemState] = useState<LoadState>("idle");
  const [problemError, setProblemError] = useState<string | null>(null);
  const [selectedProblems, setSelectedProblems] = useState<string[]>([]);
  const [isMobileReportOpen, setMobileReportOpen] = useState(false);
  const [isRequestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestDialogInitialDevice, setRequestDialogInitialDevice] = useState<RequestDialogInitialDevice | null>(null);
  const [isUsingMockData, setUsingMockData] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const content = calculatorCopy[language];
  const faqContent = calculatorFaqCopy[language];
  const deviceOptions = osTypes.map((osType) => mapOsToDevice(osType, language));
  const selectedModel = selectedCategory
    ? getLocalizedName(selectedCategory, language)
    : categoryTrail.length
      ? getLocalizedName(categoryTrail[categoryTrail.length - 1], language)
      : "";
  const selectedProblemItems = problemOptions.filter((problem) => selectedProblems.includes(problem.id));
  const total = selectedProblemItems.reduce((sum, problem) => sum + problem.price, 0);
  const selectedRequestDevice = useMemo<RequestDialogInitialDevice | null>(
    () =>
      selectedCategory
        ? {
            id: selectedCategory.id,
            title: {
              uz: getLocalizedName(selectedCategory, "uz"),
              ru: getLocalizedName(selectedCategory, "ru"),
              en: getLocalizedName(selectedCategory, "en")
            },
            source: isUsingMockData ? "fallback" : "api",
            osTypeId: activeDevice
          }
        : null,
    [activeDevice, isUsingMockData, selectedCategory]
  );

  const activateMockCalculatorData = useCallback(() => {
    const nextOsTypes = getMockCalculatorOsTypes();

    setUsingMockData(true);
    setOsTypes(nextOsTypes);
    setActiveDevice(nextOsTypes[0]?.id ?? "");
    setOsState("ready");
    setOsError(null);
    setCategoryError(null);
    setProblemError(null);
  }, []);

  useEffect(() => {
    if (!isCalculatorApiConfigured) {
      activateMockCalculatorData();
      return;
    }

    const controller = new AbortController();

    async function loadOsTypes() {
      setOsState("loading");
      setOsError(null);
      setUsingMockData(false);

      try {
        const nextOsTypes = await getCalculatorOsTypes(controller.signal);

        setOsTypes(nextOsTypes);
        setActiveDevice((current) => (nextOsTypes.some((osType) => osType.id === current) ? current : nextOsTypes[0]?.id ?? ""));
        setOsState("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        activateMockCalculatorData();
      }
    }

    loadOsTypes();

    return () => controller.abort();
  }, [activateMockCalculatorData, reloadToken]);

  useEffect(() => {
    setCategoryTrail([]);
    setCategorySearchQuery("");
    setDebouncedCategorySearchQuery("");
    setSelectedCategory(null);
    setSelectedProblems([]);
    setProblemOptions([]);
  }, [activeDevice]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedCategorySearchQuery(categorySearchQuery.trim().slice(0, 100));
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [categorySearchQuery]);

  useEffect(() => {
    if (!activeDevice || osState !== "ready") {
      setCategoryOptions([]);
      setCategoryState("idle");
      return;
    }

    const controller = new AbortController();
    const parentCategory = categoryTrail[categoryTrail.length - 1];

    if (isUsingMockData) {
      const nextCategories = getMockCalculatorPhoneCategories(activeDevice, parentCategory?.id, debouncedCategorySearchQuery);

      setCategoryOptions(nextCategories);
      setCategoryState("ready");
      setCategoryError(null);
      return;
    }

    async function loadCategories() {
      setCategoryState("loading");
      setCategoryError(null);

      try {
        const nextCategories = await getCalculatorPhoneCategories(
          activeDevice,
          parentCategory?.id,
          debouncedCategorySearchQuery,
          controller.signal
        );

        setCategoryOptions(nextCategories);
        setCategoryState("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        activateMockCalculatorData();
      }
    }

    loadCategories();

    return () => controller.abort();
  }, [
    activateMockCalculatorData,
    activeDevice,
    categoryTrail,
    content.sections.unavailable,
    debouncedCategorySearchQuery,
    isUsingMockData,
    osState,
    reloadToken
  ]);

  useEffect(() => {
    if (!selectedCategory?.has_problems) {
      setProblemOptions([]);
      setSelectedProblems([]);
      setProblemState(selectedCategory ? "ready" : "idle");
      return;
    }

    const controller = new AbortController();
    const category = selectedCategory;

    if (isUsingMockData) {
      const nextProblems = getMockCalculatorProblemCategories(category.id).map(mapProblemToService);

      setProblemOptions(nextProblems);
      setSelectedProblems(nextProblems[0] ? [nextProblems[0].id] : []);
      setProblemState("ready");
      setProblemError(null);
      return;
    }

    async function loadProblems() {
      setProblemState("loading");
      setProblemError(null);

      try {
        const nextProblems = (await getCalculatorProblemCategories(category.id, controller.signal)).map(mapProblemToService);

        setProblemOptions(nextProblems);
        setSelectedProblems(nextProblems[0] ? [nextProblems[0].id] : []);
        setProblemState("ready");
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        activateMockCalculatorData();
      }
    }

    loadProblems();

    return () => controller.abort();
  }, [activateMockCalculatorData, content.sections.unavailable, isUsingMockData, reloadToken, selectedCategory]);

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

  const retryApi = () => {
    setReloadToken((current) => current + 1);
  };

  const handleDeviceSelect = (id: string) => {
    setActiveDevice(id);
    setDropdownOpen(false);
  };

  const openBlankRequestDialog = () => {
    setRequestDialogInitialDevice(null);
    setRequestDialogOpen(true);
  };

  const openCalculatorRequestDialog = () => {
    setRequestDialogInitialDevice(selectedRequestDevice);
    setMobileReportOpen(false);
    setRequestDialogOpen(true);
  };

  const closeRequestDialog = () => {
    setRequestDialogOpen(false);
    setRequestDialogInitialDevice(null);
  };

  const handleCategorySearchChange = useCallback((searchQuery: string) => {
    setCategorySearchQuery(searchQuery.slice(0, 100));
  }, []);

  const handleCategorySelect = (category: CalculatorPhoneCategoryDto) => {
    if (category.has_children) {
      setCategoryTrail((current) => [...current, category]);
      setSelectedCategory(null);
      setProblemOptions([]);
      setSelectedProblems([]);
      setDropdownOpen(true);
      return;
    }

    setSelectedCategory(category);
    setDropdownOpen(false);
  };

  const handleCategoryBack = () => {
    setCategoryTrail((current) => current.slice(0, -1));
    setSelectedCategory(null);
    setProblemOptions([]);
    setSelectedProblems([]);
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
      <SharedHeader
        theme={theme}
        language={language}
        content={content}
        onThemeToggle={toggleTheme}
        onLanguageChange={setLanguage}
        onRequestOpen={openBlankRequestDialog}
      />
      <main className="calc-page" data-language={language} data-theme={theme}>
        <div className="calc-shell">
          <CalculatorBreadcrumb content={content} />
          <div className="calc-workspace">
            <div className="calc-form-column">
              <DeviceSelector
                devices={deviceOptions}
                activeDevice={activeDevice}
                expanded={isExpanded}
                language={language}
                content={content}
                status={osState}
                error={osError}
                onSelect={handleDeviceSelect}
                onRetry={retryApi}
                onToggleExpanded={() => setExpanded((current) => !current)}
              />
              <ModelSelector
                language={language}
                isOpen={isDropdownOpen}
                model={selectedModel}
                categories={categoryOptions}
                categoryTrail={categoryTrail}
                searchQuery={categorySearchQuery}
                status={categoryState}
                error={categoryError}
                content={content}
                onCategorySelect={handleCategorySelect}
                onCategoryBack={handleCategoryBack}
                onSearchChange={handleCategorySearchChange}
                onRetry={retryApi}
                onToggleOpen={() => setDropdownOpen((current) => !current)}
              />
              <ProblemsSelector
                language={language}
                content={content}
                problems={problemOptions}
                status={problemState}
                error={problemError}
                selectedProblems={selectedProblems}
                onToggleProblem={handleToggleProblem}
                onRetry={retryApi}
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
                  onRequestOpen={openCalculatorRequestDialog}
                />
              </aside>
              <PromoCodeCard content={content} />
            </div>
          </div>
        </div>
        <div className="page-frame page-frame--content calc-shared-sections">
          <SharedAppDownload
            content={{
              app: {
                appleTitle: content.app.appStore,
                playTitle: content.app.playStore,
                qrText: content.app.qrText,
                note: content.app.note
              }
            }}
          />
          <SharedFaq content={faqContent} />
        </div>
        <SharedFooter content={content} />
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
              onRequestOpen={openCalculatorRequestDialog}
              showPromo
            />
          </aside>
        </div>
      ) : null}

      {isRequestDialogOpen ? (
        <RequestDialogPortal
          content={content.requestDialog}
          initialDevice={requestDialogInitialDevice}
          language={language}
          titleId="calculator-request-dialog-title"
          onClose={closeRequestDialog}
        />
      ) : null}
    </>
  );
}
