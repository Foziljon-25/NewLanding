"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from "react";
import { isRequestApiConfigured, submitProcareRequest } from "../lib/request-api";
import type { LanguageCode, ThemeMode } from "./use-procare-preferences";

export const asset = (name: string) => `/assets/procare/${name}`;

type FaqItem = {
  question: string;
  subtext?: string;
  answer: string;
};

type HeaderContent = {
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
};

type AppContent = {
  app: {
    appleTitle: string;
    playTitle: string;
    qrText: string;
    note: string;
  };
};

type FaqContent = {
  faq: {
    title: string;
    accent: string;
    items: FaqItem[];
  };
};

type FooterContent = {
  footer: {
    offer: string;
    privacy: string;
    address: string;
    socialsAria: string;
  };
};

export type RequestDialogContent = {
  title: string;
  namePlaceholder: string;
  phonePlaceholder: string;
  deviceTypePlaceholder: string;
  messagePlaceholder: string;
  deviceTypes: string[];
  cancel: string;
  submit: string;
  submitting: string;
  successTitle: string;
  successMessage: string;
  successMessageMobile: string;
  success: string;
  error: string;
  requiredError: string;
  apiNotConfigured: string;
  closeAria: string;
};

const footerSocialLinks = [
  { label: "Telegram", icon: asset("footer-telegram.svg"), width: 18, height: 18, defaultColor: "#ffffff" },
  { label: "Instagram", icon: asset("footer-instagram.svg"), width: 20, height: 20, defaultColor: "#ffffff" },
  { label: "YouTube", icon: asset("footer-youtube.svg"), width: 20, height: 15, defaultColor: "#ffffff" },
  { label: "Facebook", icon: asset("footer-facebook.svg"), width: 11, height: 20, defaultColor: "#ffffff" }
] as const;

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

export function MaskIcon({
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

function ButtonLink({
  children,
  href,
  variant = "primary"
}: {
  children: ReactNode;
  href: string;
  variant?: "primary" | "outline";
}) {
  return (
    <a className={`button button--${variant}`} href={href}>
      {children}
    </a>
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
  ariaLabel,
  onLanguageChange
}: {
  activeLanguage: LanguageCode;
  currentLanguage: LanguageCode;
  ariaLabel: string;
  onLanguageChange: (language: LanguageCode) => void;
}) {
  return (
    <div className="language-options" role="listbox" aria-label={ariaLabel}>
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

function splitTitle(title: string, accent: string) {
  const [before = "", after = ""] = title.split(accent);
  return { before, after };
}

function LanguageDialogPortal({
  title,
  titleId,
  activeLanguage,
  currentLanguage,
  ariaLabel,
  onClose,
  onLanguageChange
}: {
  title: string;
  titleId: string;
  activeLanguage: LanguageCode;
  currentLanguage: LanguageCode;
  ariaLabel: string;
  onClose: () => void;
  onLanguageChange: (language: LanguageCode) => void;
}) {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return createPortal(
    <div className="language-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        aria-modal="true"
        className="language-dialog"
        role="dialog"
        aria-labelledby={titleId}
        data-node-id="3127:33719"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        <button className="language-dialog-close" type="button" aria-label="Close" onClick={onClose} />
        <LanguageChoiceList
          activeLanguage={activeLanguage}
          currentLanguage={currentLanguage}
          ariaLabel={ariaLabel}
          onLanguageChange={onLanguageChange}
        />
      </div>
    </div>,
    document.body
  );
}

export function RequestDialogPortal({
  content,
  titleId,
  onClose
}: {
  content: RequestDialogContent;
  titleId: string;
  onClose: () => void;
}) {
  const [isMounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    if (status !== "success") {
      return;
    }

    const closeTimer = window.setTimeout(onClose, 3500);

    return () => window.clearTimeout(closeTimer);
  }, [onClose, status]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name.trim() || !phone.trim() || !deviceType.trim()) {
      setStatus("error");
      setStatusMessage(content.requiredError);
      return;
    }

    if (!isRequestApiConfigured) {
      setStatus("error");
      setStatusMessage(content.apiNotConfigured);
      return;
    }

    setStatus("submitting");
    setStatusMessage("");

    try {
      await submitProcareRequest({
        deviceType: deviceType.trim(),
        message: message.trim(),
        name: name.trim(),
        phone: phone.trim(),
        source: "procare_landing"
      });

      setName("");
      setPhone("");
      setDeviceType("");
      setMessage("");
      setStatus("success");
      setStatusMessage(content.success);
    } catch {
      setStatus("error");
      setStatusMessage(content.error);
    }
  };

  if (!isMounted) {
    return null;
  }

  if (status === "success") {
    return createPortal(
      <div className="request-modal-backdrop request-modal-backdrop--success" role="presentation" onClick={onClose}>
        <div
          aria-modal="true"
          className="request-success-dialog"
          role="dialog"
          aria-labelledby={`${titleId}-success`}
          data-node-id="3151:44214"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="request-success-illustration" data-node-id="3151:44215">
            <Image
              className="request-success-illustration-image"
              src={asset("request-success-confetti.png")}
              alt=""
              width={1834}
              height={952}
              priority
            />
          </div>
          <div className="request-success-copy" aria-live="polite">
            <h2 id={`${titleId}-success`}>{content.successTitle}</h2>
            <p>
              <span className="request-success-message request-success-message--desktop">{content.successMessage}</span>
              <span className="request-success-message request-success-message--mobile">{content.successMessageMobile}</span>
            </p>
          </div>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div className="request-modal-backdrop" role="presentation" onClick={onClose}>
      <form
        aria-modal="true"
        className="request-dialog"
        role="dialog"
        aria-labelledby={titleId}
        data-node-id="3149:43819"
        onClick={(event) => event.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="request-dialog-heading">
          <h2 id={titleId}>{content.title}</h2>
        </div>
        <button className="request-dialog-close" type="button" aria-label={content.closeAria} onClick={onClose} />

        <div className="request-fields">
          <label className="request-field">
            <span className="sr-only">{content.namePlaceholder}</span>
            <input
              autoComplete="name"
              name="name"
              placeholder={content.namePlaceholder}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="request-field request-field--phone">
            <span className="sr-only">{content.phonePlaceholder}</span>
            <span className="request-phone-icon" aria-hidden="true" />
            <input
              autoComplete="tel"
              inputMode="tel"
              name="phone"
              placeholder={content.phonePlaceholder}
              type="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>

          <label className={`request-field request-field--select ${deviceType ? "has-value" : ""}`}>
            <span className="sr-only">{content.deviceTypePlaceholder}</span>
            <select
              name="deviceType"
              value={deviceType}
              onChange={(event) => setDeviceType(event.target.value)}
            >
              <option value="">{content.deviceTypePlaceholder}</option>
              {content.deviceTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>

          <label className="request-field request-field--message">
            <span className="sr-only">{content.messagePlaceholder}</span>
            <textarea
              name="message"
              placeholder={content.messagePlaceholder}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
        </div>

        <div className="request-dialog-actions">
          <button className="button button--request-outline" type="button" onClick={onClose}>
            {content.cancel}
          </button>
          <button className="button" type="submit" disabled={status === "submitting"}>
            {status === "submitting" ? content.submitting : content.submit}
          </button>
        </div>

        <p className={`request-status request-status--${status}`} role="status" aria-live="polite">
          {statusMessage}
        </p>
      </form>
    </div>,
    document.body
  );
}

export function Header({
  theme,
  language,
  content,
  onThemeToggle,
  onLanguageChange,
  onRequestOpen
}: {
  theme: ThemeMode;
  language: LanguageCode;
  content: HeaderContent;
  onThemeToggle: () => void;
  onLanguageChange: (language: LanguageCode) => void;
  onRequestOpen?: () => void;
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

      <a className="logo-link" href="/" aria-label={content.header.logoAria}>
        <Image src={asset("procare-logo-header.svg")} alt="Procare" width={136} height={45} priority />
      </a>

      <nav className="main-nav" aria-label={content.header.navAria}>
        <a href="/calculator">{content.header.calculator}</a>
        <a href="/#why-procare">{content.header.about}</a>
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
                ariaLabel={content.header.languageAria}
                onLanguageChange={handleLanguageChange}
              />
            </div>
          ) : null}
        </div>
        <button className="button button--outline" type="button" onClick={onRequestOpen}>
          {content.header.request}
        </button>
        <button className="mobile-chat-button" type="button" aria-label={content.header.contactAria} onClick={onRequestOpen}>
          <Image className="header-action-icon" src={asset("header-chat.svg")} alt="" width={20} height={20} />
        </button>
      </div>

      {isLanguagePickerOpen ? (
        <LanguageDialogPortal
          title={content.languageDialogTitle}
          titleId="language-dialog-title"
          activeLanguage={language}
          currentLanguage={language}
          ariaLabel={content.header.languageAria}
          onClose={() => setLanguagePickerOpen(false)}
          onLanguageChange={handleLanguageChange}
        />
      ) : null}
    </header>
  );
}

export function AppDownload({ content }: { content: AppContent }) {
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
        <Image className="app-phone-image app-phone-image--left" src={asset("app-phone-left.png")} alt="" width={402} height={789} loading="eager" />
      </div>
      <div className="app-phone-crop app-phone-crop--top" aria-hidden="true">
        <Image className="app-phone-image app-phone-image--top" src={asset("app-phone-top.png")} alt="" width={408} height={801} loading="eager" />
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

export function Faq({ content }: { content: FaqContent }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const { before, after } = splitTitle(content.faq.title, content.faq.accent);

  return (
    <section className="faq-section" data-node-id="3059:36579">
      <div className="section-title">
        <h2>
          {before}
          <span>{content.faq.accent}</span>
          {after}
        </h2>
      </div>
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

export function Footer({ content }: { content: FooterContent }) {
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
              <MaskIcon className="social-icon" src={link.icon} width={link.width} height={link.height} color={link.defaultColor} />
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
