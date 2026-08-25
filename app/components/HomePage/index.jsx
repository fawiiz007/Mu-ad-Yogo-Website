import Image from "next/image";
import logo from "../../logo copy.png";
import background_image from "../../background.jpg";
import { business } from "@/data/business";
import "./HomePage.css";

// Generic greeting for the hero's WhatsApp button — this isn't tied to a
// cart order (that flow lives in the cart modal), it's just a fast way to
// start a conversation before someone has picked anything from the menu.
const WHATSAPP_GREETING = "Hello Mu'ad Yogo! I'd like to place an order.";

function buildWhatsAppHref() {
  const digitsOnly = business.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(WHATSAPP_GREETING)}`;
}

export default function HomePage() {
  return (
    <div className="homepage">
      <section className="hero" id="home">
        <Image
          src={background_image}
          alt=""
          fill
          priority
          style={{ objectFit: "cover" }}
        />

        {/* Dark overlay */}
        <div className="hero-overlay" />

        {/* ── HERO LOGO ────────────────────────────────────────────────── */}
        <header className="hero-header">
          <div className="hero-logo">
            <Image src={logo} alt="Mu'ad Yogo" priority />
          </div>
        </header>

        {/* ── CONTENT ─────────────────────────────────────────────────── */}
        <div className="hero-content">
          <h1 className="hero-headline">
            Fresh, Creamy, <em className="hero-headline-pink">Delicious.</em>
          </h1>

          <p className="hero-sub">
            Discover delicious yogurt, indulgent parfaits, creamy ice cream and
            irresistible chocolate pops made for every craving.
          </p>

          <div className="hero-actions">
            <a href="#menu" className="hero-btn hero-btn-filled">
              Explore Menu
            </a>
            <a
              href={buildWhatsAppHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-btn hero-btn-outline"
            >
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
