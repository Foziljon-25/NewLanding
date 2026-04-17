import Image from "next/image";

const navItems = [
  { href: "#why-probox", label: "Nima uchun Probox?" },
  { href: "#bonus", label: "Maxsus sovg‘a" }
];

const benefits = [
  {
    title: "Boshlang‘ich to‘lovsiz",
    body: "Qulay variantlar orqali ortiqcha boshlang‘ich xarajatsiz xaridni boshlash imkoniyati mavjud.",
    image: "/assets/payment-card.png",
    imageAlt: "Terminal orqali to'lov qilinayotgan karta"
  },
  {
    title: "iCloud o‘rnatishlarsiz",
    body: "Qurilmalar iCloud holati tekshirilgan va foydalanishga tayyor ko‘rinishda topshiriladi.",
    image: "/assets/icloud-pattern.svg",
    imageAlt: "",
    dark: true
  },
  {
    title: "Hujjatlari bilan sotib oling",
    body: "Har bir xarid bo‘yicha hujjatlar, shartlar va topshirish jarayoni shaffof ko‘rsatiladi.",
    image: "/assets/iphone-box.png",
    imageAlt: "iPhone qutisi va hujjatlari"
  }
];

const addresses = [
  "Nurafshon aylanma ko‘chasi, 1",
  "Qoratosh ko‘chasi, 5B",
  "Turtariq ko‘chasi, 2"
];

const contactLinks = [
  { href: "tel:+998781134774", label: "+998 78 113 47 74", icon: "phone-call", ariaLabel: "Telefon raqam" },
  { href: "mailto:probox@gmail.com", label: "probox@gmail.com", icon: "mail", ariaLabel: "Email manzil" }
];

const socialLinks = [
  { href: "#", label: "Telegram", icon: "telegram" },
  { href: "#", label: "Instagram", icon: "instagram" },
  { href: "#", label: "YouTube", icon: "youtube" },
  { href: "#", label: "Facebook", icon: "facebook" }
];

function ApplyButton({ variant = "primary" }: { variant?: "primary" | "outline" }) {
  return (
    <a className={`apply-button apply-button--${variant}`} href="#application">
      Ariza qoldirish
    </a>
  );
}

function FigmaIcon({ name }: { name: string }) {
  return <span className={`figma-icon figma-icon--${name}`} aria-hidden="true" />;
}

function Header() {
  return (
    <header className="site-header">
      <a className="logo-link" href="#" aria-label="Probox bosh sahifasi">
        <Image className="logo-image" src="/assets/probox-logo-dark.svg" alt="Probox" width={132} height={48} priority />
      </a>

      <nav className="main-nav" aria-label="Asosiy navigatsiya">
        {navItems.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="header-actions">
        <button className="language-switch" type="button" aria-label="Tilni tanlash">
          <Image src="/assets/uz-flag.svg" alt="" width={24} height={24} />
          <span>O’zb</span>
        </button>
        <ApplyButton variant="outline" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero-section" id="application">
      <div className="hero-copy">
        <h1>
          Atiga <span>1 000 000 so‘m</span> boshlang‘ich to‘lov bilan Iphone 17 ga ega bo‘ling
        </h1>
        <ApplyButton />
      </div>

      <Image
        className="hero-device"
        src="/assets/hero-phone.png"
        alt="Probox logotipi aks etgan iPhone"
        width={1033}
        height={689}
        priority
      />

      <div className="hero-info hero-info--left">
        <strong>24 soat ichida</strong>
        <span>Ariza ko‘rib chiqiladi va operator bog‘lanadi</span>
      </div>
      <div className="hero-info hero-info--right">
        <strong>Rasmiy hujjatlar</strong>
        <span>Har bir qurilma tekshiruv va hujjatlar bilan topshiriladi</span>
      </div>
    </section>
  );
}

function Benefits() {
  return (
    <section className="benefits-section" id="why-probox">
      <h2>
        Nima uchun <span>Probox</span> do‘konidan <em>Iphone</em> xarid qilishingiz kerak?
      </h2>

      <div className="benefit-grid">
        {benefits.map((benefit) => (
          <article className={`benefit-card ${benefit.dark ? "benefit-card--dark" : ""}`} key={benefit.title}>
            {!benefit.dark && (
              <div className="benefit-text">
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </div>
            )}

            {benefit.dark ? (
              <div className="icloud-panel">
                <Image src={benefit.image} alt={benefit.imageAlt} width={327} height={327} />
                <div className="benefit-text">
                  <h3>{benefit.title}</h3>
                  <p>{benefit.body}</p>
                </div>
              </div>
            ) : (
              <Image className="benefit-image" src={benefit.image} alt={benefit.imageAlt} width={371} height={332} />
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function Bonus() {
  return (
    <section className="bonus-section" id="bonus">
      <div className="bonus-copy">
        <h2>🔥 Maxsus bonus</h2>
        <p>Undan tashqari oylik to‘lovlarini vaqtida to‘lasangiz maxsus sovg‘alarga ham ega bo‘lishingiz mumkin!</p>
        <ApplyButton />
      </div>

      <Image className="gift-image" src="/assets/gifts.png" alt="Maxsus bonus sovg'a qutilari" width={586} height={391} />
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-card">
        <Image className="footer-logo" src="/assets/probox-logo-light.svg" alt="Probox" width={132} height={48} />

        <div className="contact-row">
          {contactLinks.map((link) => (
            <a href={link.href} aria-label={link.ariaLabel} key={link.href}>
              <FigmaIcon name={link.icon} />
              <span>{link.label}</span>
            </a>
          ))}
        </div>

        <div className="address-row">
          {addresses.map((address) => (
            <span className="address-item" key={address}>
              <FigmaIcon name="map-pin" />
              <span>{address}</span>
            </span>
          ))}
        </div>

        <div className="social-row" aria-label="Ijtimoiy tarmoqlar">
          {socialLinks.map((link) => (
            <a href={link.href} key={link.label} aria-label={link.label}>
              <FigmaIcon name={link.icon} />
            </a>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p>©Probox, 2026</p>
        <div>
          <a href="#">Ommaviy offerta</a>
          <a href="#">Maxfiylik siyosati</a>
        </div>
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <main>
      <div className="page-shell">
        <Header />
        <Hero />
        <Benefits />
        <Bonus />
      </div>
      <Footer />
    </main>
  );
}
