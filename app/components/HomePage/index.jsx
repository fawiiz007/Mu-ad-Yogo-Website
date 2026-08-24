import Image from "next/image";
import logo from "../../logo copy.png";
import background_image from "../../background.jpg";
import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="homepage">
      <section className="hero">
        <Image
          src={background_image}
          alt=""
          fill
          priority
          style={{ objectFit: "cover" }}
        />

        {/* Dark overlay */}
        <div className="hero-overlay" />

        {/* ── NAV ─────────────────────────────────────────────────────── */}
        <nav className="hero-nav">
          <a href="#" className="nav-link">
            Home
          </a>
          <a href="#" className="nav-link">
            Menu
          </a>

          <div className="nav-logo">
            <Image src={logo} alt="Mu'ad Yogo" />
          </div>

          <a href="#" className="nav-link">
            About
          </a>
          <a href="#" className="nav-link">
            Contact
          </a>
        </nav>

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
            <a href="#" className="hero-btn hero-btn-filled">
              Explore Menu
            </a>
            <a href="#" className="hero-btn hero-btn-outline">
              Order on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
