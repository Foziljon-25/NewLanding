"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useProcarePreferences, type LanguageCode, type ThemeMode } from "./components/use-procare-preferences";

const asset = (name: string) => `/assets/procare/${name}`;

type PartnerLogo = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type ServiceTab = {
  label: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
  title: string;
  description: string;
  mediaNote: string;
  mediaPosition: string;
};

type WhyItem = {
  title: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
  mediaEyebrow: string;
  mediaBody: string;
  mediaStat: string;
  mediaStatLabel: string;
  panelBackground: string;
  iconBackground: string;
};

type TeamMember = {
  name: string;
  role: string;
  image: string;
  imageClass?: string;
};

type FaqItem = {
  question: string;
  subtext: string;
  answer: string;
};

type FooterSocialLink = {
  label: string;
  icon: string;
  width: number;
  height: number;
  defaultColor: string;
};

type LandingCopy = {
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
  hero: {
    beforeAccent: string;
    accent: string;
    afterAccent: string;
    subtitle: string;
    calculator: string;
    contact: string;
    scroll: string;
  };
  brandTitle: string;
  serviceTabs: ServiceTab[];
  servicesAria: string;
  serviceMediaAria: string;
  calculator: {
    imageAlt: string;
    qualityTitle: string;
    qualityText: string;
    speedTitle: string;
    speedText: string;
    titleBeforeAccent: string;
    accent: string;
    description: string;
    benefits: typeof calculatorBenefits;
    cta: string;
  };
  why: {
    title: string;
    accent: string;
    subtitle: string;
    aria: string;
    items: WhyItem[];
  };
  probox: {
    titleBeforeAccent: string;
    accent: string;
    titleAfterAccent: string;
    cta: string;
    imageAlt: string;
    noteLeftTitle: string;
    noteLeftText: string;
    noteRightTitle: string;
    noteRightText: string;
  };
  team: {
    title: string;
    accent: string;
    subtitle: string;
    aria: string;
    roles: string[];
  };
  app: {
    appleTitle: string;
    playTitle: string;
    qrText: string;
    note: string;
  };
  faq: {
    title: string;
    accent: string;
    items: FaqItem[];
  };
  footer: {
    offer: string;
    privacy: string;
    address: string;
    socialsAria: string;
  };
};

const partnerLogos: PartnerLogo[] = [
  { src: asset("brand-xiaomi.png"), alt: "Xiaomi", width: 110, height: 56 },
  { src: asset("brand-apple.png"), alt: "Apple", width: 104, height: 16 },
  { src: asset("brand-samsung.png"), alt: "Samsung", width: 78, height: 36 },
  { src: asset("brand-lg.png"), alt: "LG", width: 114, height: 32 }
];

const serviceTabs: ServiceTab[] = [
  {
    label: "Display va sensor",
    icon: asset("service-tab-display.svg"),
    iconWidth: 18,
    iconHeight: 22,
    title: "Displey va sensorni almashtirish va tuzatish",
    description:
      "Sensor noto‘g‘ri ishlayaptimi yoki umuman javob bermayaptimi? Biz buni to‘g‘rilaymiz yoki telefoningizning ekran, sensor va oynasini sifatli va tezda almashtirib beramiz.",
    mediaNote: "Original ekran komponentlari va nozik yig‘ish jarayoni bilan ishlaymiz.",
    mediaPosition: "52% 44%"
  },
  {
    label: "Orqa oyna",
    icon: asset("service-tab-back.svg"),
    iconWidth: 18,
    iconHeight: 22,
    title: "Orqa oynani almashtirish va tiklash",
    description:
      "Korpusning orqa qismi yorilgan yoki chizilib ketgan bo‘lsa, qurilmangiz ko‘rinishi va himoyasini yo‘qotmaydigan darajada ehtiyotkorlik bilan yangilaymiz.",
    mediaNote: "Korpus geometriyasi saqlangan holda toza va aniq montaj qilinadi.",
    mediaPosition: "44% 50%"
  },
  {
    label: "Smartfon ekrani",
    icon: asset("service-tab-screen.svg"),
    iconWidth: 18,
    iconHeight: 22,
    title: "Smartfon ekranini diagnostika qilish va tiklash",
    description:
      "Tasvir o‘chib qolsa, dog‘ tushsa yoki sensor qatlamida kechikish bo‘lsa, muammoni tezda aniqlab, eng mos ekran yechimini tavsiya qilamiz.",
    mediaNote: "Diagnostika, modul tanlash va sifat nazorati bir jarayonda bajariladi.",
    mediaPosition: "58% 48%"
  },
  {
    label: "Modem va antenna",
    icon: asset("service-tab-modem.svg"),
    iconWidth: 22,
    iconHeight: 20,
    title: "Modem va antenna bilan bog‘liq nosozliklar",
    description:
      "Signal sustligi, tarmoq ushlamaslik yoki qo‘ng‘iroq sifati bilan bog‘liq muammolarda plataning kerakli qismini tekshirib, aloqa sifatini qayta tiklaymiz.",
    mediaNote: "Signal barqarorligi va aloqa bloklari maxsus uskuna bilan tekshiriladi.",
    mediaPosition: "49% 40%"
  },
  {
    label: "Wi-Fi va Bluetooth",
    icon: asset("service-tab-wifi.svg"),
    iconWidth: 22,
    iconHeight: 22,
    title: "Wi‑Fi va Bluetooth ulanishlarini sozlash",
    description:
      "Qurilmangiz tarmoqqa ulanmasa yoki aksessuarlarni topmasa, modul, plata va dasturiy qatlamni tekshirib, ulanishlarni barqaror holatga keltiramiz.",
    mediaNote: "Simsiz aloqa modullari real ulanish senariylari bilan tekshirib chiqiladi.",
    mediaPosition: "54% 54%"
  },
  {
    label: "Batareya",
    icon: asset("service-tab-battery.svg"),
    iconWidth: 22,
    iconHeight: 17,
    title: "Batareyani almashtirish va quvvat tizimini tekshirish",
    description:
      "Telefon tez zaryadsizlanayotgan, qizib ketayotgan yoki foizlarni noto‘g‘ri ko‘rsatayotgan bo‘lsa, batareya va quvvat boshqaruvi qismlarini yangilaymiz.",
    mediaNote: "Yangi batareya o‘rnatilgach quvvat ishlashi va sikllar qayta kalibrlanadi.",
    mediaPosition: "60% 42%"
  }
];

const calculatorBenefits = [
  { label: "Bepul hisoblash", icon: asset("calculator-free.svg"), tone: "green" },
  { label: "Aniq narxlar", icon: asset("calculator-price.svg"), tone: "violet" },
  { label: "24/7 mavjud", icon: asset("calculator-hours.svg"), tone: "sky" }
];

const whyItems: WhyItem[] = [
  {
    title: "Maxsus chegirma va bonus dasturlari",
    icon: asset("why-discount.svg"),
    iconWidth: 24,
    iconHeight: 24,
    mediaEyebrow: "Sodiqlik dasturi",
    mediaBody:
      "Doimiy mijozlar uchun bonus, qayta murojaatlarda qulay narx va mavsumiy takliflar bilan xizmatni yanada foydali qilamiz.",
    mediaStat: "12+",
    mediaStatLabel: "faol aksiya va bonus yo‘nalishi",
    panelBackground: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
    iconBackground: "rgba(0, 191, 255, 0.12)"
  },
  {
    title: "Tezkor xizmat va qulay lokatsiyalar",
    icon: asset("why-location.svg"),
    iconWidth: 24,
    iconHeight: 24,
    mediaEyebrow: "Qulay servis nuqtalari",
    mediaBody:
      "Servis markazlarimizga tez yetib kelish mumkin, ichki jarayonlar esa ortiqcha kutishsiz qabul qilish va topshirishga moslashtirilgan.",
    mediaStat: "2",
    mediaStatLabel: "asosiy lokatsiya va tez qabul tizimi",
    panelBackground: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 120%)",
    iconBackground: "rgba(255, 255, 255, 0.1)"
  },
  {
    title: "Premium himoya xizmatlari",
    icon: asset("why-premium.svg"),
    iconWidth: 24,
    iconHeight: 24,
    mediaEyebrow: "Qo‘shimcha himoya",
    mediaBody:
      "Ta’mirdan keyingi holatni uzoq saqlash uchun himoya aksessuarlari, profilaktika va foydalanish bo‘yicha amaliy tavsiyalarni ham beramiz.",
    mediaStat: "360°",
    mediaStatLabel: "qurilma holatini kompleks yondashuv",
    panelBackground: "linear-gradient(135deg, #1e293b 0%, #111827 100%)",
    iconBackground: "rgba(255, 255, 255, 0.08)"
  },
  {
    title: "Diagnostika va maslahat",
    icon: asset("why-diagnostic.svg"),
    iconWidth: 24,
    iconHeight: 24,
    mediaEyebrow: "Aniq tashxis",
    mediaBody:
      "Muammo manbasini almashtirishdan oldin to‘liq tekshirib chiqamiz, shuning uchun mijozga keraksiz xarajat emas, aniq yechim tavsiya qilinadi.",
    mediaStat: "1:1",
    mediaStatLabel: "muhandis maslahati va real tashxis",
    panelBackground: "linear-gradient(135deg, #1e293b 0%, #164e63 120%)",
    iconBackground: "rgba(255, 255, 255, 0.08)"
  },
  {
    title: "Rasmiy ehtiyot qismlari bilan ta’mirlash",
    icon: asset("why-official.svg"),
    iconWidth: 24,
    iconHeight: 24,
    mediaEyebrow: "Ishonchli komplektatsiya",
    mediaBody:
      "Taqdim etilayotgan detallar sifat va moslik bo‘yicha sinchiklab tanlanadi, shu bois ta’mirdan keyingi ishlash muddati barqaror bo‘ladi.",
    mediaStat: "100%",
    mediaStatLabel: "mos komponent va sifat nazorati",
    panelBackground: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 120%)",
    iconBackground: "rgba(255, 255, 255, 0.08)"
  }
];

const teamMembers: TeamMember[] = [
  {
    name: "Kurbanov Muzafar Mirazimovich",
    role: "Expert",
    image: asset("team-kurbanov-expert.png")
  },
  {
    name: "Nazarov Kamolidin Abzalovich",
    role: "Specialist",
    image: asset("team-nazarov.png"),
    imageClass: "member-photo--tall"
  },
  {
    name: "Marupov Abdulloh Olimjon o‘g‘li",
    role: "Pro",
    image: asset("team-marupov.png"),
    imageClass: "member-photo--tall member-photo--lower"
  },
  {
    name: "Abdumannopov Abduboriy Farhod o‘g‘li",
    role: "Specialist",
    image: asset("team-abdumannopov.png"),
    imageClass: "member-photo--tall member-photo--lower"
  }
];

const faqItems: FaqItem[] = [
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
];

const footerSocialLinks: FooterSocialLink[] = [
  { label: "Telegram", icon: asset("footer-telegram.svg"), width: 18, height: 18, defaultColor: "#ffffff" },
  { label: "Instagram", icon: asset("footer-instagram.svg"), width: 20, height: 20, defaultColor: "#ffffff" },
  { label: "YouTube", icon: asset("footer-youtube.svg"), width: 20, height: 15, defaultColor: "#ffffff" },
  { label: "Facebook", icon: asset("footer-facebook.svg"), width: 11, height: 20, defaultColor: "#ffffff" }
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

const copy: Record<LanguageCode, LandingCopy> = {
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
    hero: {
      beforeAccent: "Professional ",
      accent: "servis",
      afterAccent: " markazi",
      subtitle:
        "Sizning qurilmalaringiz uchun ishonchli va sifatli ta'mirlash xizmatlari. Biz bilan qurilmalaringiz ishonchli qo'llarda.",
      calculator: "Kalkulyator",
      contact: "Murojaat qilish",
      scroll: "Scroll qiling"
    },
    brandTitle: "Bizning xizmatlarimiz",
    serviceTabs,
    servicesAria: "Xizmat yo'nalishlari",
    serviceMediaAria: "Ta'mirlash jarayoni",
    calculator: {
      imageAlt: "Procare ta'mirlash kalkulyatori",
      qualityTitle: "Sifat kafolati!",
      qualityText: "Har bir qurilma uchun bir yillik kafolat beramiz!",
      speedTitle: "Tezkor ta'mirlash",
      speedText: "Har bir qurilma tez va sifatli ta'mirlab beriladi",
      titleBeforeAccent: "Ta'mirlash narxini ",
      accent: "hisoblang",
      description:
        "Qurilmangiz ta'mirlash narxini bilish uchun kalkulyatorimizdan foydalaning. Aniq narxni bir necha soniyada bilib oling.",
      benefits: calculatorBenefits,
      cta: "Narxni hisoblash"
    },
    why: {
      title: "Nima uchun Procare?",
      accent: "Procare?",
      subtitle: "Bizning mijozlarimiz tanlashimizning asosiy sabablari",
      aria: "Procare afzalliklari",
      items: whyItems
    },
    probox: {
      titleBeforeAccent: "Atiga ",
      accent: "1 000 000 so'm",
      titleAfterAccent: " boshlang'ich to'lov bilan Iphone 17 ga ega bo'ling",
      cta: "Probox'ga o'tish",
      imageAlt: "Probox iPhone 17 taklifi",
      noteLeftTitle: "24 soat ichida",
      noteLeftText: "Ariza ko'rib chiqiladi va operator bog'lanadi",
      noteRightTitle: "Rasmiy hujjatlar",
      noteRightText: "Har bir qurilma tekshiruv va hujjatlar bilan topshiriladi"
    },
    team: {
      title: "Bizning jamoamiz!",
      accent: "jamoamiz!",
      subtitle: "Mutaxassislarimiz qurilmangizga ehtiyotkorlik bilan yondashadi",
      aria: "Jamoa a'zolari",
      roles: ["Ekspert", "Mutaxassis", "Pro", "Mutaxassis"]
    },
    app: {
      appleTitle: "App Store QR-kodi",
      playTitle: "Play Market QR-kodi",
      qrText: "Hoziroq buyurtmani boshlang",
      note: "Barcha huquqlar himoyalangan va yuklab olib xavfsizligi ta'minlangan"
    },
    faq: {
      title: "Ko'p so'raladigan savollar",
      accent: "savollar",
      items: faqItems
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
    hero: {
      beforeAccent: "Профессиональный ",
      accent: "сервисный",
      afterAccent: " центр",
      subtitle:
        "Надежный и качественный ремонт для ваших устройств. С нами ваши устройства в надежных руках.",
      calculator: "Калькулятор",
      contact: "Связаться",
      scroll: "Прокрутите"
    },
    brandTitle: "Наши услуги",
    serviceTabs: [
      {
        ...serviceTabs[0],
        label: "Дисплей и сенсор",
        title: "Замена и ремонт дисплея и сенсора",
        description:
          "Сенсор работает некорректно или совсем не реагирует? Мы исправим проблему или быстро и качественно заменим экран, сенсор и стекло вашего телефона.",
        mediaNote: "Работаем с оригинальными экранными компонентами и аккуратной сборкой."
      },
      {
        ...serviceTabs[1],
        label: "Заднее стекло",
        title: "Замена и восстановление заднего стекла",
        description:
          "Если задняя часть корпуса треснула или поцарапана, мы аккуратно восстановим внешний вид и защиту устройства.",
        mediaNote: "Чистый и точный монтаж с сохранением геометрии корпуса."
      },
      {
        ...serviceTabs[2],
        label: "Экран смартфона",
        title: "Диагностика и восстановление экрана смартфона",
        description:
          "Если изображение пропадает, появились пятна или сенсор реагирует с задержкой, мы быстро найдем причину и предложим подходящее решение.",
        mediaNote: "Диагностика, подбор модуля и контроль качества в одном процессе."
      },
      {
        ...serviceTabs[3],
        label: "Модем и антенна",
        title: "Неисправности модема и антенны",
        description:
          "При слабом сигнале, проблемах с сетью или качеством звонков проверим нужные участки платы и восстановим стабильную связь.",
        mediaNote: "Стабильность сигнала и блоки связи проверяются специальным оборудованием."
      },
      {
        ...serviceTabs[4],
        label: "Wi-Fi и Bluetooth",
        title: "Настройка Wi-Fi и Bluetooth подключений",
        description:
          "Если устройство не подключается к сети или не видит аксессуары, проверим модуль, плату и программную часть.",
        mediaNote: "Беспроводные модули проверяются в реальных сценариях подключения."
      },
      {
        ...serviceTabs[5],
        label: "Батарея",
        title: "Замена батареи и проверка системы питания",
        description:
          "Если телефон быстро разряжается, нагревается или неверно показывает проценты, обновим батарею и компоненты питания.",
        mediaNote: "После установки новой батареи проверяем питание и калибруем циклы."
      }
    ],
    servicesAria: "Направления услуг",
    serviceMediaAria: "Процесс ремонта",
    calculator: {
      imageAlt: "Калькулятор ремонта Procare",
      qualityTitle: "Гарантия качества!",
      qualityText: "Даем годовую гарантию на каждое устройство!",
      speedTitle: "Быстрый ремонт",
      speedText: "Каждое устройство ремонтируется быстро и качественно",
      titleBeforeAccent: "Рассчитайте ",
      accent: "стоимость ремонта",
      description:
        "Используйте наш калькулятор, чтобы узнать стоимость ремонта устройства. Точную цену можно получить за несколько секунд.",
      benefits: [
        { ...calculatorBenefits[0], label: "Бесплатный расчет" },
        { ...calculatorBenefits[1], label: "Точные цены" },
        { ...calculatorBenefits[2], label: "Доступно 24/7" }
      ],
      cta: "Рассчитать цену"
    },
    why: {
      title: "Почему Procare?",
      accent: "Procare?",
      subtitle: "Главные причины, по которым клиенты выбирают нас",
      aria: "Преимущества Procare",
      items: [
        {
          ...whyItems[0],
          title: "Специальные скидки и бонусные программы",
          mediaEyebrow: "Программа лояльности",
          mediaBody:
            "Для постоянных клиентов мы предлагаем бонусы, выгодные цены при повторном обращении и сезонные предложения.",
          mediaStatLabel: "активных акций и бонусных направлений"
        },
        {
          ...whyItems[1],
          title: "Быстрый сервис и удобные локации",
          mediaEyebrow: "Удобные сервисные точки",
          mediaBody:
            "До наших сервисных центров легко добраться, а процессы приема и выдачи настроены без лишнего ожидания.",
          mediaStatLabel: "основные локации и быстрая система приема"
        },
        {
          ...whyItems[2],
          title: "Премиальные услуги защиты",
          mediaEyebrow: "Дополнительная защита",
          mediaBody:
            "Чтобы результат ремонта сохранялся дольше, мы также предлагаем защитные аксессуары, профилактику и практичные рекомендации.",
          mediaStatLabel: "комплексный подход к состоянию устройства"
        },
        {
          ...whyItems[3],
          title: "Диагностика и консультация",
          mediaEyebrow: "Точный диагноз",
          mediaBody:
            "Перед заменой деталей мы полностью проверяем источник проблемы и рекомендуем точное решение без лишних расходов.",
          mediaStatLabel: "консультация инженера и реальная диагностика"
        },
        {
          ...whyItems[4],
          title: "Ремонт с официальными комплектующими",
          mediaEyebrow: "Надежная комплектация",
          mediaBody:
            "Детали тщательно подбираются по качеству и совместимости, поэтому устройство стабильно работает после ремонта.",
          mediaStatLabel: "совместимые компоненты и контроль качества"
        }
      ]
    },
    probox: {
      titleBeforeAccent: "Получите iPhone 17 с первоначальным взносом всего ",
      accent: "1 000 000 сум",
      titleAfterAccent: "",
      cta: "Перейти в Probox",
      imageAlt: "Предложение Probox iPhone 17",
      noteLeftTitle: "В течение 24 часов",
      noteLeftText: "Заявка будет рассмотрена, и оператор свяжется с вами",
      noteRightTitle: "Официальные документы",
      noteRightText: "Каждое устройство передается с проверкой и документами"
    },
    team: {
      title: "Наша команда!",
      accent: "команда!",
      subtitle: "Наши специалисты бережно относятся к вашему устройству",
      aria: "Члены команды",
      roles: ["Эксперт", "Специалист", "Pro", "Специалист"]
    },
    app: {
      appleTitle: "QR-код App Store",
      playTitle: "QR-код Play Market",
      qrText: "Начните заказ прямо сейчас",
      note: "Все права защищены, загрузка безопасна"
    },
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
    hero: {
      beforeAccent: "Professional ",
      accent: "service",
      afterAccent: " center",
      subtitle: "Reliable, high-quality repair services for your devices. With us, your devices are in trusted hands.",
      calculator: "Calculator",
      contact: "Contact us",
      scroll: "Scroll"
    },
    brandTitle: "Our services",
    serviceTabs: [
      {
        ...serviceTabs[0],
        label: "Display and sensor",
        title: "Display and sensor replacement and repair",
        description:
          "Is the sensor working incorrectly or not responding at all? We will fix it or quickly replace your phone's screen, sensor and glass with care.",
        mediaNote: "We work with original screen components and a precise assembly process."
      },
      {
        ...serviceTabs[1],
        label: "Back glass",
        title: "Back glass replacement and restoration",
        description:
          "If the back of the body is cracked or scratched, we carefully renew the look and protection of your device.",
        mediaNote: "Clean, accurate installation while preserving the body geometry."
      },
      {
        ...serviceTabs[2],
        label: "Smartphone screen",
        title: "Smartphone screen diagnostics and restoration",
        description:
          "If the image disappears, stains appear, or the touch layer responds slowly, we quickly identify the issue and recommend the right screen solution.",
        mediaNote: "Diagnostics, module selection and quality control are handled in one process."
      },
      {
        ...serviceTabs[3],
        label: "Modem and antenna",
        title: "Modem and antenna related issues",
        description:
          "For weak signal, network issues or call quality problems, we check the required board sections and restore stable connectivity.",
        mediaNote: "Signal stability and communication blocks are checked with dedicated equipment."
      },
      {
        ...serviceTabs[4],
        label: "Wi-Fi and Bluetooth",
        title: "Wi-Fi and Bluetooth connection setup",
        description:
          "If your device cannot connect to a network or find accessories, we check the module, board and software layer.",
        mediaNote: "Wireless modules are tested through real connection scenarios."
      },
      {
        ...serviceTabs[5],
        label: "Battery",
        title: "Battery replacement and power system check",
        description:
          "If the phone drains fast, overheats or shows incorrect percentages, we update the battery and power management parts.",
        mediaNote: "After installing a new battery, we check power behavior and recalibrate cycles."
      }
    ],
    servicesAria: "Service categories",
    serviceMediaAria: "Repair process",
    calculator: {
      imageAlt: "Procare repair calculator",
      qualityTitle: "Quality guarantee!",
      qualityText: "We provide a one-year warranty for every device!",
      speedTitle: "Fast repair",
      speedText: "Every device is repaired quickly and carefully",
      titleBeforeAccent: "Calculate the ",
      accent: "repair price",
      description:
        "Use our calculator to learn the repair price for your device. Get an accurate estimate in just a few seconds.",
      benefits: [
        { ...calculatorBenefits[0], label: "Free estimate" },
        { ...calculatorBenefits[1], label: "Clear pricing" },
        { ...calculatorBenefits[2], label: "Available 24/7" }
      ],
      cta: "Calculate price"
    },
    why: {
      title: "Why Procare?",
      accent: "Procare?",
      subtitle: "The main reasons our customers choose us",
      aria: "Procare advantages",
      items: [
        {
          ...whyItems[0],
          title: "Special discounts and bonus programs",
          mediaEyebrow: "Loyalty program",
          mediaBody:
            "We make service more valuable for returning customers with bonuses, better repeat-visit pricing and seasonal offers.",
          mediaStatLabel: "active promotions and bonus directions"
        },
        {
          ...whyItems[1],
          title: "Fast service and convenient locations",
          mediaEyebrow: "Convenient service points",
          mediaBody:
            "Our service centers are easy to reach, and internal processes are tuned for quick intake and handover.",
          mediaStatLabel: "main locations and a fast intake system"
        },
        {
          ...whyItems[2],
          title: "Premium protection services",
          mediaEyebrow: "Additional protection",
          mediaBody:
            "To keep the post-repair condition longer, we also provide protective accessories, prevention and practical usage advice.",
          mediaStatLabel: "complete device-care approach"
        },
        {
          ...whyItems[3],
          title: "Diagnostics and consultation",
          mediaEyebrow: "Precise diagnostics",
          mediaBody:
            "Before replacing anything, we fully check the source of the problem and recommend an exact solution without unnecessary costs.",
          mediaStatLabel: "engineer consultation and real diagnostics"
        },
        {
          ...whyItems[4],
          title: "Repair with official spare parts",
          mediaEyebrow: "Reliable components",
          mediaBody:
            "The parts we provide are carefully selected for quality and compatibility, helping the device work steadily after repair.",
          mediaStatLabel: "compatible components and quality control"
        }
      ]
    },
    probox: {
      titleBeforeAccent: "Get an iPhone 17 with only ",
      accent: "1,000,000 UZS",
      titleAfterAccent: " as the initial payment",
      cta: "Go to Probox",
      imageAlt: "Probox iPhone 17 offer",
      noteLeftTitle: "Within 24 hours",
      noteLeftText: "The request is reviewed and an operator contacts you",
      noteRightTitle: "Official documents",
      noteRightText: "Every device is handed over with inspection and documents"
    },
    team: {
      title: "Our team!",
      accent: "team!",
      subtitle: "Our specialists handle your device with care",
      aria: "Team members",
      roles: ["Expert", "Specialist", "Pro", "Specialist"]
    },
    app: {
      appleTitle: "App Store QR code",
      playTitle: "Play Market QR code",
      qrText: "Start your order now",
      note: "All rights reserved and the download is secured"
    },
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
    },
    footer: {
      offer: "Public offer",
      privacy: "Privacy policy",
      address: "Karatosh street, 5B",
      socialsAria: "Social networks"
    }
  }
};

function buildMaskStyle({
  src,
  width,
  height,
  color
}: {
  src: string;
  width: number;
  height: number;
  color?: string;
}) {
  return {
    width: `${width}px`,
    height: `${height}px`,
    ...(color ? { backgroundColor: color } : {}),
    WebkitMaskImage: `url("${src}")`,
    WebkitMaskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    WebkitMaskSize: "contain",
    maskImage: `url("${src}")`,
    maskRepeat: "no-repeat",
    maskPosition: "center",
    maskSize: "contain"
  } as CSSProperties;
}

function MaskIcon({
  src,
  width,
  height,
  className,
  color
}: {
  src: string;
  width: number;
  height: number;
  className?: string;
  color?: string;
}) {
  return <span aria-hidden="true" className={["mask-icon", className].filter(Boolean).join(" ")} style={buildMaskStyle({ src, width, height, color })} />;
}

function useHorizontalCarousel({
  autoScroll = false,
  speed = 0.45,
  loop = false,
  pauseOnHover = true,
  respectReducedMotion = true
}: {
  autoScroll?: boolean;
  speed?: number;
  loop?: boolean;
  pauseOnHover?: boolean;
  respectReducedMotion?: boolean;
} = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    let animationFrame = 0;
    let hovering = false;
    let dragging = false;
    let touching = false;
    let startX = 0;
    let startScrollLeft = 0;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const getLoopWidth = () => {
      if (!autoScroll && !loop) {
        return 0;
      }

      const firstSet = element.querySelector<HTMLElement>("[data-carousel-set='true']");

      if (!firstSet) {
        return element.scrollWidth / 2;
      }

      const track = firstSet.parentElement;
      const trackStyle = track ? window.getComputedStyle(track) : null;
      const trackGap = trackStyle ? Number.parseFloat(trackStyle.columnGap || trackStyle.gap || "0") : 0;

      return firstSet.offsetWidth + (Number.isFinite(trackGap) ? trackGap : 0);
    };

    const normalizeLoop = () => {
      const loopWidth = getLoopWidth();

      if (!loopWidth) {
        return;
      }

      while (element.scrollLeft >= loopWidth) {
        element.scrollLeft -= loopWidth;
      }
    };

    const tick = () => {
      const shouldReduceMotion = respectReducedMotion && mediaQuery.matches;

      if (autoScroll && !shouldReduceMotion && !dragging && !touching && !(pauseOnHover && hovering)) {
        element.scrollLeft += speed;
        normalizeLoop();
      }

      animationFrame = window.requestAnimationFrame(tick);
    };

    const handleMouseDown = (event: MouseEvent) => {
      dragging = true;
      startX = event.pageX;
      startScrollLeft = element.scrollLeft;
      element.classList.add("is-dragging");
      event.preventDefault();
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!dragging) {
        return;
      }

      element.scrollLeft = startScrollLeft - (event.pageX - startX);
      normalizeLoop();
    };

    const handleMouseUp = () => {
      if (!dragging) {
        return;
      }

      dragging = false;
      element.classList.remove("is-dragging");
    };

    const handleMouseEnter = () => {
      if (pauseOnHover) {
        hovering = true;
      }
    };

    const handleMouseLeave = () => {
      hovering = false;
    };

    const handleFocus = () => {
      if (pauseOnHover) {
        hovering = true;
      }
    };

    const handleBlur = () => {
      hovering = false;
    };

    const handleTouchStart = () => {
      touching = true;
    };

    const handleTouchEnd = () => {
      touching = false;
      normalizeLoop();
    };

    const handleScroll = () => {
      if (!loop || dragging) {
        return;
      }

      normalizeLoop();
    };

    animationFrame = window.requestAnimationFrame(tick);
    element.addEventListener("mousedown", handleMouseDown);
    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("focus", handleFocus);
    element.addEventListener("blur", handleBlur);
    element.addEventListener("touchstart", handleTouchStart, { passive: true });
    element.addEventListener("touchend", handleTouchEnd, { passive: true });
    element.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    element.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      element.removeEventListener("mousedown", handleMouseDown);
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("focus", handleFocus);
      element.removeEventListener("blur", handleBlur);
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchend", handleTouchEnd);
      element.removeEventListener("touchcancel", handleTouchEnd);
      element.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [autoScroll, loop, pauseOnHover, respectReducedMotion, speed]);

  return ref;
}

function ButtonLink({
  children,
  href = "#contact",
  variant = "primary"
}: {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "glass" | "outline";
}) {
  return (
    <a className={`button button--${variant}`} href={href}>
      {children}
    </a>
  );
}

function SectionTitle({
  eyebrow,
  title,
  accent
}: {
  eyebrow?: string;
  title: string;
  accent: string;
}) {
  const [before, after] = title.split(accent);

  return (
    <div className="section-title">
      {eyebrow ? <p>{eyebrow}</p> : null}
      <h2>
        {before}
        <span>{accent}</span>
        {after}
      </h2>
    </div>
  );
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
    <div className="language-options" role="listbox" aria-label={copy[currentLanguage].header.languageAria}>
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
        clipRule="evenodd"
        d="M12 1.25C12.4142 1.25 12.75 1.58579 12.75 2V3C12.75 3.41421 12.4142 3.75 12 3.75C11.5858 3.75 11.25 3.41421 11.25 3V2C11.25 1.58579 11.5858 1.25 12 1.25ZM4.39861 4.39861C4.6915 4.10572 5.16638 4.10572 5.45927 4.39861L5.85211 4.79145C6.145 5.08434 6.145 5.55921 5.85211 5.85211C5.55921 6.145 5.08434 6.145 4.79145 5.85211L4.39861 5.45927C4.10572 5.16638 4.10572 4.6915 4.39861 4.39861ZM19.6011 4.39887C19.894 4.69176 19.894 5.16664 19.6011 5.45953L19.2083 5.85237C18.9154 6.14526 18.4405 6.14526 18.1476 5.85237C17.8547 5.55947 17.8547 5.0846 18.1476 4.79171L18.5405 4.39887C18.8334 4.10598 19.3082 4.10598 19.6011 4.39887ZM12 6.75C9.1005 6.75 6.75 9.1005 6.75 12C6.75 14.8995 9.1005 17.25 12 17.25C14.8995 17.25 17.25 14.8995 17.25 12C17.25 9.1005 14.8995 6.75 12 6.75ZM5.25 12C5.25 8.27208 8.27208 5.25 12 5.25C15.7279 5.25 18.75 8.27208 18.75 12C18.75 15.7279 15.7279 18.75 12 18.75C8.27208 18.75 5.25 15.7279 5.25 12ZM1.25 12C1.25 11.5858 1.58579 11.25 2 11.25H3C3.41421 11.25 3.75 11.5858 3.75 12C3.75 12.4142 3.41421 12.75 3 12.75H2C1.58579 12.75 1.25 12.4142 1.25 12ZM20.25 12C20.25 11.5858 20.5858 11.25 21 11.25H22C22.4142 11.25 22.75 11.5858 22.75 12C22.75 12.4142 22.4142 12.75 22 12.75H21C20.5858 12.75 20.25 12.4142 20.25 12ZM18.1476 18.1476C18.4405 17.8547 18.9154 17.8547 19.2083 18.1476L19.6011 18.5405C19.894 18.8334 19.894 19.3082 19.6011 19.6011C19.3082 19.894 18.8334 19.894 18.5405 19.6011L18.1476 19.2083C17.8547 18.9154 17.8547 18.4405 18.1476 18.1476ZM5.85211 18.1479C6.145 18.4408 6.145 18.9157 5.85211 19.2086L5.45927 19.6014C5.16638 19.8943 4.6915 19.8943 4.39861 19.6014C4.10572 19.3085 4.10572 18.8336 4.39861 18.5407L4.79145 18.1479C5.08434 17.855 5.55921 17.855 5.85211 18.1479ZM12 20.25C12.4142 20.25 12.75 20.5858 12.75 21V22C12.75 22.4142 12.4142 22.75 12 22.75C11.5858 22.75 11.25 22.4142 11.25 22V21C11.25 20.5858 11.5858 20.25 12 20.25Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function Header({
  theme,
  language,
  content,
  onThemeToggle,
  onLanguageChange
}: {
  theme: ThemeMode;
  language: LanguageCode;
  content: LandingCopy;
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
    <header className="site-header" data-node-id="3035:35828">
      <button
        aria-expanded={isLanguagePickerOpen}
        aria-haspopup="dialog"
        className="mobile-flag-button"
        type="button"
        aria-label={content.header.languageAria}
        onClick={() => setLanguagePickerOpen(true)}
      >
        <LanguageFlag src={selectedLanguage.flagSrc} />
      </button>

      <a className="logo-link" href="#hero" aria-label={content.header.logoAria}>
        <Image src={asset("procare-logo-header.svg")} alt="Procare" width={136} height={45} priority />
      </a>

      <nav className="main-nav" aria-label={content.header.navAria}>
        <a href="/calculator">{content.header.calculator}</a>
        <a href="#why-procare">{content.header.about}</a>
      </nav>

      <div className="header-actions">
        <button
          aria-label={nextThemeLabel}
          aria-pressed={theme === "dark"}
          className="theme-toggle"
          type="button"
          onClick={onThemeToggle}
        >
          {theme === "dark" ? (
            <HeaderSunIcon />
          ) : (
            <Image className="header-action-icon" src={asset("header-moon.svg")} alt="" width={20} height={20} />
          )}
        </button>
        <span className="header-divider" aria-hidden="true" />
        <div className="language-switcher" ref={languageSwitcherRef}>
          <button
            aria-expanded={isLanguagePickerOpen}
            aria-haspopup="listbox"
            className="language-switch"
            type="button"
            aria-label={content.header.languageAria}
            onClick={() => setLanguagePickerOpen((isOpen) => !isOpen)}
          >
            <LanguageFlag src={selectedLanguage.flagSrc} />
            <span>{selectedLanguage.shortLabel}</span>
          </button>
          {isLanguagePickerOpen ? (
            <div className="language-menu" data-node-id="3127:31664">
              <LanguageChoiceList
                activeLanguage={language}
                currentLanguage={language}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          ) : null}
        </div>
        <ButtonLink href="#contact" variant="outline">
          {content.header.request}
        </ButtonLink>
        <a className="mobile-chat-button" href="#contact" aria-label={content.header.contactAria}>
          <Image className="header-action-icon" src={asset("header-chat.svg")} alt="" width={20} height={20} />
        </a>
      </div>
      {isLanguagePickerOpen ? (
        <div className="language-modal-backdrop" role="presentation" onClick={() => setLanguagePickerOpen(false)}>
          <div
            aria-modal="true"
            className="language-dialog"
            role="dialog"
            aria-labelledby="language-dialog-title"
            data-node-id="3127:33719"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="language-dialog-title">{content.languageDialogTitle}</h2>
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

function Hero({ content }: { content: LandingCopy }) {
  return (
    <section className="hero-section" id="hero" data-node-id="3035:35923">
      <video
        autoPlay
        className="hero-video"
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={asset("hero-video.mp4")} type="video/mp4" />
      </video>
      <div className="hero-overlay" aria-hidden="true" />

      <div className="hero-copy">
        <h1>
          {content.hero.beforeAccent}
          <span>{content.hero.accent}</span>
          {content.hero.afterAccent}
        </h1>
        <p>{content.hero.subtitle}</p>
        <div className="hero-actions">
          <ButtonLink href="/calculator" variant="glass">
            {content.hero.calculator}
          </ButtonLink>
          <ButtonLink href="#contact">{content.hero.contact}</ButtonLink>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span />
        <small>{content.hero.scroll}</small>
      </div>
    </section>
  );
}

function BrandStrip({ content }: { content: LandingCopy }) {
  const brandRef = useHorizontalCarousel({
    autoScroll: true,
    loop: true,
    pauseOnHover: false,
    respectReducedMotion: false,
    speed: 0.5
  });
  const carouselCopies = Array.from({ length: 4 }, (_, index) => index);

  return (
    <section className="brand-strip" aria-label={content.brandTitle} data-node-id="3040:35961">
      <p>{content.brandTitle}</p>
      <div className="brand-viewport" ref={brandRef} tabIndex={0} aria-label={content.brandTitle}>
        <div className="brand-track">
          {carouselCopies.map((copyIndex) => (
            <div
              aria-hidden={copyIndex > 0}
              className="brand-track-set"
              data-carousel-set={copyIndex === 0 ? "true" : undefined}
              key={`brand-set-${copyIndex}`}
            >
              {partnerLogos.map((logo, logoIndex) => (
                <div className="brand-card" key={`${copyIndex}-${logo.alt}-${logoIndex}`}>
                  <Image
                    src={logo.src}
                    alt={copyIndex === 0 ? logo.alt : ""}
                    width={logo.width}
                    height={logo.height}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceFeature({ content }: { content: LandingCopy }) {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const activeService = content.serviceTabs[activeServiceIndex];

  return (
    <section className="service-grid" id="services">
      <article className="service-card service-card--content" data-node-id="3042:36013">
        <Image className="service-watermark" src={asset("service-logo-watermark.svg")} alt="" width={285} height={94} />
        <div className="service-copy">
          <h2>{activeService.title}</h2>
          <p>{activeService.description}</p>
          <ButtonLink href="#contact">{content.hero.contact}</ButtonLink>
        </div>

        <div className="service-tabs" role="tablist" aria-label={content.servicesAria}>
          {content.serviceTabs.map((tab, index) => {
            const isActive = index === activeServiceIndex;

            return (
              <button
                aria-selected={isActive}
                className={`service-tab ${isActive ? "is-active" : ""}`}
                id={`service-tab-${index}`}
                key={tab.label}
                role="tab"
                tabIndex={isActive ? 0 : -1}
                type="button"
                onClick={() => setActiveServiceIndex(index)}
              >
                <MaskIcon
                  className="service-tab-icon"
                  src={tab.icon}
                  width={tab.iconWidth}
                  height={tab.iconHeight}
                />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </article>

      <article
        aria-label={content.serviceMediaAria}
        aria-labelledby={`service-tab-${activeServiceIndex}`}
        className="service-card service-card--media"
        data-node-id="3042:36014"
      >
        <div className="video-fill-fallback" style={{ backgroundPosition: activeService.mediaPosition }} />
        <video
          autoPlay
          className="service-video"
          loop
          muted
          playsInline
          preload="metadata"
          style={{ objectPosition: activeService.mediaPosition }}
          aria-hidden="true"
        >
          <source src={asset("hero-video.mp4")} type="video/mp4" />
        </video>
        <div className="service-media-overlay" aria-hidden="true" />
        <Image className="media-logo" src={asset("procare-logo-header.svg")} alt="Procare" width={67} height={22} />
      </article>
    </section>
  );
}

function Calculator({ content }: { content: LandingCopy }) {
  return (
    <section className="calculator-grid" id="calculator">
      <article className="repair-visual" data-node-id="3049:36400">
        <Image src={asset("repair-phone.png")} alt={content.calculator.imageAlt} width={287} height={287} />
        <div className="glass-note glass-note--quality">
          <strong>{content.calculator.qualityTitle}</strong>
          <span>{content.calculator.qualityText}</span>
        </div>
        <div className="glass-note glass-note--speed">
          <strong>{content.calculator.speedTitle}</strong>
          <span>{content.calculator.speedText}</span>
        </div>
      </article>

      <article className="calculator-card" data-node-id="3062:38356">
        <div className="calculator-copy">
          <h2>
            {content.calculator.titleBeforeAccent}
            <span>{content.calculator.accent}</span>
          </h2>
          <p>{content.calculator.description}</p>
        </div>

        <div className="calculator-benefits">
          {content.calculator.benefits.map((item, index) => (
            <a className="calculator-benefit" href={index === 1 ? "/calculator/selection" : "/calculator"} key={item.label}>
              <span className={`calculator-icon calculator-icon--${item.tone}`}>
                <Image src={item.icon} alt="" width={24} height={24} />
              </span>
              <b>{item.label}</b>
            </a>
          ))}
        </div>

        <ButtonLink href="/calculator">{content.calculator.cta}</ButtonLink>
      </article>
    </section>
  );
}

function WhyProcare({ content }: { content: LandingCopy }) {
  const [activeWhyIndex, setActiveWhyIndex] = useState(0);
  const activeWhy = content.why.items[activeWhyIndex];

  return (
    <section className="why-section" id="why-procare" data-node-id="3062:38463">
      <SectionTitle title={content.why.title} accent={content.why.accent} />
      <p className="section-subtitle">{content.why.subtitle}</p>

      <div className="why-grid">
        <div className="why-list" role="tablist" aria-label={content.why.aria}>
          {content.why.items.map((item, index) => {
            const isActive = index === activeWhyIndex;

            return (
              <button
                aria-selected={isActive}
                className={`why-item ${isActive ? "is-active" : ""}`}
                id={`why-tab-${index}`}
                key={item.title}
                role="tab"
                type="button"
                onClick={() => setActiveWhyIndex(index)}
              >
                <span>
                  <Image
                    className="why-item-icon-image"
                    src={item.icon}
                    alt=""
                    width={item.iconWidth}
                    height={item.iconHeight}
                  />
                </span>
                <h3>{item.title}</h3>
              </button>
            );
          })}
        </div>
        <div className="why-media">
          <div
            aria-labelledby={`why-tab-${activeWhyIndex}`}
            className="why-media-panel"
            role="tabpanel"
            style={{ background: activeWhy.panelBackground }}
          >
            <div className="why-media-brand">
              <Image src={asset("why-logo.svg")} alt="Procare by Probox" width={148} height={49} loading="eager" />
            </div>
            <div className="why-media-visual" style={{ background: activeWhy.iconBackground }}>
              <Image src={activeWhy.icon} alt="" width={84} height={84} />
            </div>
            <div className="why-media-copy">
              <p>{activeWhy.mediaEyebrow}</p>
              <h3>{activeWhy.title}</h3>
              <span>{activeWhy.mediaBody}</span>
            </div>
            <div className="why-media-stat">
              <strong>{activeWhy.mediaStat}</strong>
              <span>{activeWhy.mediaStatLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProboxBanner({ content }: { content: LandingCopy }) {
  return (
    <section className="probox-banner" data-node-id="3067:42090">
      <Image className="probox-logo" src={asset("probox-logo.svg")} alt="Probox" width={125} height={42} loading="eager" />
      <div className="probox-copy">
        <h2>
          {content.probox.titleBeforeAccent}
          <span>{content.probox.accent}</span>
          {content.probox.titleAfterAccent}
        </h2>
        <ButtonLink href="#contact">{content.probox.cta}</ButtonLink>
      </div>
      <Image
        className="probox-phone"
        src={asset("probox-banner-phone.png")}
        alt={content.probox.imageAlt}
        width={1033}
        height={689}
        loading="eager"
      />
      <div className="glass-note probox-note probox-note--left">
        <strong>{content.probox.noteLeftTitle}</strong>
        <span>{content.probox.noteLeftText}</span>
      </div>
      <div className="glass-note probox-note probox-note--right">
        <strong>{content.probox.noteRightTitle}</strong>
        <span>{content.probox.noteRightText}</span>
      </div>
    </section>
  );
}

function Team({ content }: { content: LandingCopy }) {
  const teamRef = useHorizontalCarousel();

  return (
    <section className="team-section" data-node-id="3059:36612">
      <SectionTitle title={content.team.title} accent={content.team.accent} />
      <p className="section-subtitle">{content.team.subtitle}</p>
      <div className="team-track" ref={teamRef} tabIndex={0} aria-label={content.team.aria}>
        {teamMembers.map((member, index) => (
          <article className="team-card" key={`${member.name}-${member.role}`}>
            <div className="member-photo">
              <Image className={member.imageClass} src={member.image} alt={member.name} width={304} height={440} loading="eager" />
            </div>
            <div className="member-info">
              <h3>{member.name}</h3>
              <p>{content.team.roles[index] ?? member.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AppDownload({ content }: { content: LandingCopy }) {
  return (
    <section className="app-section" id="contact" data-node-id="3067:40407">
      <div className="qr-card qr-card--apple">
        <div className="qr-code">
          <Image src={asset("qr-image.svg")} alt="" width={90} height={90} />
          <span>
            <Image src={asset("qr-apple-logo.svg")} alt="" width={18} height={18} />
          </span>
        </div>
        <div>
          <h3>{content.app.appleTitle}</h3>
          <p>{content.app.qrText}</p>
        </div>
      </div>

      <div className="app-phone-crop app-phone-crop--left" aria-hidden="true">
        <Image
          className="app-phone-image app-phone-image--left"
          src={asset("app-phone-left.png")}
          alt=""
          width={402}
          height={789}
          loading="eager"
        />
      </div>
      <div className="app-phone-crop app-phone-crop--top" aria-hidden="true">
        <Image
          className="app-phone-image app-phone-image--top"
          src={asset("app-phone-top.png")}
          alt=""
          width={408}
          height={801}
          loading="eager"
        />
      </div>

      <div className="qr-card qr-card--play">
        <div>
          <h3>{content.app.playTitle}</h3>
          <p>{content.app.qrText}</p>
        </div>
        <div className="qr-code">
          <Image src={asset("qr-image.svg")} alt="" width={90} height={90} />
          <span>
            <Image src={asset("qr-play-logo.svg")} alt="" width={15} height={16} />
          </span>
        </div>
      </div>

      <Image className="app-brand" src={asset("app-logo.svg")} alt="Procare" width={189} height={63} loading="eager" />
      <p className="app-note">
        <span>* </span>
        {content.app.note}
      </p>
    </section>
  );
}

function Faq({ content }: { content: LandingCopy }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section className="faq-section" data-node-id="3059:36579">
      <SectionTitle title={content.faq.title} accent={content.faq.accent} />
      <div className="faq-list">
        {content.faq.items.map((item, index) => {
          const isOpen = openFaqIndex === index;

          return (
            <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={item.question}>
              <button
                aria-expanded={isOpen}
                className="faq-trigger"
                type="button"
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
              >
                <div className="faq-heading">
                  <h3>{item.question}</h3>
                </div>
                <span className="faq-chevron" aria-hidden="true" />
              </button>
              {isOpen ? (
                <div className="faq-answer">
                  <p>{item.answer}</p>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

function Footer({ content }: { content: LandingCopy }) {
  return (
    <footer className="site-footer" data-node-id="3056:36402">
      <div className="footer-card">
        <Image className="footer-logo" src={asset("footer-logo.svg")} alt="Procare" width={136} height={45} loading="eager" />
        <div className="footer-contacts">
          <a href="tel:+998781134774">
            <span className="footer-contact-icon footer-phone-icon">
              <MaskIcon className="footer-phone-main" src={asset("footer-phone-1.svg")} width={19} height={19} color="var(--blue)" />
              <MaskIcon className="footer-phone-accent" src={asset("footer-phone-2.svg")} width={8} height={8} color="var(--blue)" />
            </span>
            <span>+998 78 113 47 74</span>
          </a>
          <a href="mailto:procare@gmail.com">
            <span className="footer-contact-icon">
              <MaskIcon className="footer-contact-symbol" src={asset("footer-mail.svg")} width={20} height={16} color="var(--blue)" />
            </span>
            <span>procare@gmail.com</span>
          </a>
          <a href="https://maps.google.com/?q=Qoratosh%20ko%E2%80%98chasi%2C%205B">
            <span className="footer-contact-icon">
              <MaskIcon className="footer-contact-symbol" src={asset("footer-location.svg")} width={18} height={22} color="var(--blue)" />
            </span>
            <span>{content.footer.address}</span>
          </a>
        </div>
        <div className="social-links" aria-label={content.footer.socialsAria}>
          {footerSocialLinks.map((link) => (
            <a href="#" aria-label={link.label} key={link.label}>
              <MaskIcon
                className="social-icon"
                src={link.icon}
                width={link.width}
                height={link.height}
                color={link.defaultColor}
              />
            </a>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <p>© Procare, 2026</p>
        <div>
          <a href="#">{content.footer.offer}</a>
          <a href="#">{content.footer.privacy}</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const { theme, setTheme, language, setLanguage } = useProcarePreferences();
  const content = copy[language];

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <main data-theme={theme} data-language={language}>
      <div className="page-frame">
        <Header
          theme={theme}
          language={language}
          content={content}
          onThemeToggle={toggleTheme}
          onLanguageChange={setLanguage}
        />
        <Hero content={content} />
      </div>
      <BrandStrip content={content} />
      <div className="page-frame page-frame--content">
        <ServiceFeature content={content} />
        <Calculator content={content} />
        <WhyProcare content={content} />
        <ProboxBanner content={content} />
        <Team content={content} />
        <AppDownload content={content} />
        <Faq content={content} />
      </div>
      <Footer content={content} />
    </main>
  );
}
