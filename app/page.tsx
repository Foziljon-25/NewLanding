"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";

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

type ThemeMode = "light" | "dark";

const partnerLogos: PartnerLogo[] = [
  { src: asset("brand-xiaomi.png"), alt: "Xiaomi", width: 110, height: 56 },
  { src: asset("brand-apple.png"), alt: "Apple", width: 104, height: 16 },
  { src: asset("brand-samsung.png"), alt: "Samsung", width: 78, height: 36 },
  { src: asset("brand-lg.png"), alt: "LG", width: 114, height: 32 },
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
  speed = 0.45
}: {
  autoScroll?: boolean;
  speed?: number;
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
    let startX = 0;
    let startScrollLeft = 0;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const getLoopWidth = () => (autoScroll ? element.scrollWidth / 2 : 0);

    const normalizeLoop = () => {
      const loopWidth = getLoopWidth();

      if (!loopWidth) {
        return;
      }

      if (element.scrollLeft >= loopWidth) {
        element.scrollLeft -= loopWidth;
      }
    };

    const tick = () => {
      if (autoScroll && !mediaQuery.matches && !hovering && !dragging) {
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
      hovering = true;
    };

    const handleMouseLeave = () => {
      hovering = false;
    };

    const handleFocus = () => {
      hovering = true;
    };

    const handleBlur = () => {
      hovering = false;
    };

    const handleTouchStart = () => {
      hovering = true;
    };

    const handleTouchEnd = () => {
      hovering = false;
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [autoScroll, speed]);

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
  onThemeToggle
}: {
  theme: ThemeMode;
  onThemeToggle: () => void;
}) {
  const nextThemeLabel = theme === "dark" ? "Light mode yoqish" : "Dark mode yoqish";

  return (
    <header className="site-header" data-node-id="3035:35828">
      <button className="mobile-flag-button" type="button" aria-label="Tilni tanlash">
        <Image src={asset("uzbekistan-flag.svg")} alt="" width={20} height={20} />
      </button>

      <a className="logo-link" href="#hero" aria-label="Procare bosh sahifasi">
        <Image src={asset("procare-logo-header.svg")} alt="Procare" width={136} height={45} priority />
      </a>

      <nav className="main-nav" aria-label="Asosiy navigatsiya">
        <a href="#calculator">Kalkulyator</a>
        <a href="#why-procare">Biz haqimizda</a>
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
        <button className="language-switch" type="button" aria-label="Tilni tanlash">
          <Image src={asset("uzbekistan-flag.svg")} alt="" width={24} height={24} />
          <span>O’zb</span>
        </button>
        <ButtonLink href="#contact" variant="outline">
          Ariza qoldirish
        </ButtonLink>
        <a className="mobile-chat-button" href="#contact" aria-label="Murojaat qilish">
          <Image className="header-action-icon" src={asset("header-chat.svg")} alt="" width={20} height={20} />
        </a>
      </div>
    </header>
  );
}

function Hero() {
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
          Professional <span>servis</span> markazi
        </h1>
        <p>Sizning qurilmalaringiz uchun ishonchli va sifatli ta'mirlash xizmatlari. Biz bilan qurilmalaringiz ishonchli qo'llarda.</p>
        <div className="hero-actions">
          <ButtonLink href="#calculator" variant="glass">
            Kalkulyator
          </ButtonLink>
          <ButtonLink href="#contact">Murojaat qilish</ButtonLink>
        </div>
      </div>

      <div className="scroll-cue" aria-hidden="true">
        <span />
        <small>Scroll qiling</small>
      </div>
    </section>
  );
}

function BrandStrip() {
  const brandRef = useHorizontalCarousel({ autoScroll: true, speed: 0.5 });

  return (
    <section className="brand-strip" aria-label="Bizning xizmatlarimiz" data-node-id="3040:35961">
      <p>Bizning xizmatlarimiz</p>
      <div className="brand-viewport" ref={brandRef} tabIndex={0} aria-label="Brendlar ro‘yxati">
        <div className="brand-track">
          {partnerLogos.map((logo, index) => (
            <div className="brand-card" key={`${logo.alt}-${index}`}>
              <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceFeature() {
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const activeService = serviceTabs[activeServiceIndex];

  return (
    <section className="service-grid" id="services">
      <article className="service-card service-card--content" data-node-id="3042:36013">
        <Image className="service-watermark" src={asset("service-logo-watermark.svg")} alt="" width={285} height={94} />
        <div className="service-copy">
          <h2>{activeService.title}</h2>
          <p>{activeService.description}</p>
          <ButtonLink href="#contact">Murojaat qilish</ButtonLink>
        </div>

        <div className="service-tabs" role="tablist" aria-label="Xizmat yo‘nalishlari">
          {serviceTabs.map((tab, index) => {
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
        aria-label="Ta'mirlash jarayoni"
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

function Calculator() {
  return (
    <section className="calculator-grid" id="calculator">
      <article className="repair-visual" data-node-id="3049:36400">
        <Image src={asset("repair-phone.png")} alt="Procare ta'mirlash kalkulyatori" width={287} height={287} />
        <div className="glass-note glass-note--quality">
          <strong>Sifat kafolati!</strong>
          <span>Har bir qurilma uchun bir yillik kafolat beramiz!</span>
        </div>
        <div className="glass-note glass-note--speed">
          <strong>Tezkor ta’mirlash</strong>
          <span>Har bir qurilma tez va sifatli ta’mirlab beriladi</span>
        </div>
      </article>

      <article className="calculator-card" data-node-id="3062:38356">
        <div className="calculator-copy">
          <h2>
            Ta'mirlash narxini <span>hisoblang</span>
          </h2>
          <p>Qurilmangiz ta'mirlash narxini bilish uchun kalkulyatorimizdan foydalaning. Aniq narxni bir necha soniyada bilib oling.</p>
        </div>

        <div className="calculator-benefits">
          {calculatorBenefits.map((item) => (
            <div className="calculator-benefit" key={item.label}>
              <span className={`calculator-icon calculator-icon--${item.tone}`}>
                <Image src={item.icon} alt="" width={24} height={24} />
              </span>
              <b>{item.label}</b>
            </div>
          ))}
        </div>

        <ButtonLink href="#contact">Narxni hisoblash</ButtonLink>
      </article>
    </section>
  );
}

function WhyProcare() {
  const [activeWhyIndex, setActiveWhyIndex] = useState(0);
  const activeWhy = whyItems[activeWhyIndex];

  return (
    <section className="why-section" id="why-procare" data-node-id="3062:38463">
      <SectionTitle title="Nima uchun Procare?" accent="Procare?" />
      <p className="section-subtitle">Bizning mijozlarimiz tanlashimizning asosiy sabablari</p>

      <div className="why-grid">
        <div className="why-list" role="tablist" aria-label="Procare afzalliklari">
          {whyItems.map((item, index) => {
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

function ProboxBanner() {
  return (
    <section className="probox-banner" data-node-id="3067:42090">
      <Image className="probox-logo" src={asset("probox-logo.svg")} alt="Probox" width={125} height={42} loading="eager" />
      <div className="probox-copy">
        <h2>
          Atiga <span>1 000 000 so‘m</span> boshlang‘ich to‘lov bilan Iphone 17 ga ega bo‘ling
        </h2>
        <ButtonLink href="#contact">Probox’ga o’tish</ButtonLink>
      </div>
      <Image
        className="probox-phone"
        src={asset("probox-banner-phone.png")}
        alt="Probox iPhone 17 taklifi"
        width={1033}
        height={689}
        loading="eager"
      />
      <div className="glass-note probox-note probox-note--left">
        <strong>24 soat ichida</strong>
        <span>Ariza ko‘rib chiqiladi va operator bog‘lanadi</span>
      </div>
      <div className="glass-note probox-note probox-note--right">
        <strong>Rasmiy hujjatlar</strong>
        <span>Har bir qurilma tekshiruv va hujjatlar bilan topshiriladi</span>
      </div>
    </section>
  );
}

function Team() {
  const teamRef = useHorizontalCarousel();

  return (
    <section className="team-section" data-node-id="3059:36612">
      <SectionTitle title="Bizning jamoamiz!" accent="jamoamiz!" />
      <p className="section-subtitle">Mutaxassislarimiz qurilmangizga ehtiyotkorlik bilan yondashadi</p>
      <div className="team-track" ref={teamRef} tabIndex={0} aria-label="Jamoa a’zolari">
        {teamMembers.map((member) => (
          <article className="team-card" key={`${member.name}-${member.role}`}>
            <div className="member-photo">
              <Image className={member.imageClass} src={member.image} alt={member.name} width={304} height={440} loading="eager" />
            </div>
            <div className="member-info">
              <h3>{member.name}</h3>
              <p>{member.role}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function AppDownload() {
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
          <h3>App Store QR-kodi</h3>
          <p>Hoziroq buyurtmani boshlang</p>
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
          <h3>Play Market QR-kodi</h3>
          <p>Hoziroq buyurtmani boshlang</p>
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
        <span>* </span>Barcha huquqlar himoyalangan va yuklab olib xavfsizligi ta’minlangan
      </p>
    </section>
  );
}

function Faq() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <section className="faq-section" data-node-id="3059:36579">
      <SectionTitle title="Ko‘p so‘raladigan savollar" accent="savollar" />
      <div className="faq-list">
        {faqItems.map((item, index) => {
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

function Footer() {
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
            <span>Qoratosh ko‘chasi, 5B</span>
          </a>
        </div>
        <div className="social-links" aria-label="Ijtimoiy tarmoqlar">
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
          <a href="#">Ommaviy offerta</a>
          <a href="#">Maxfiylik siyosati</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("procare-theme");

    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    }

    setThemeLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    if (themeLoaded) {
      window.localStorage.setItem("procare-theme", theme);
    }
  }, [theme, themeLoaded]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  return (
    <main data-theme={theme}>
      <div className="page-frame">
        <Header theme={theme} onThemeToggle={toggleTheme} />
        <Hero />
      </div>
      <BrandStrip />
      <div className="page-frame page-frame--content">
        <ServiceFeature />
        <Calculator />
        <WhyProcare />
        <ProboxBanner />
        <Team />
        <AppDownload />
        <Faq />
      </div>
      <Footer />
    </main>
  );
}
