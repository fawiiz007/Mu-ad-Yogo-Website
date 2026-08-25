import Image from "next/image";
import logo from "../../logo copy.png";
import { business } from "@/data/business";
import "./Footer.css";

export default function Footer() {
  const instagramUrl = `https://instagram.com/${business.instagramHandle.replace(/^@/, "")}`;
  const tiktokUrl = `https://www.tiktok.com/@${business.tiktokHandle.replace(/^@/, "")}`;
  const whatsappUrl = `https://wa.me/${business.whatsappNumber.replace(/\D/g, "")}`;

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <a href="#home" className="footer-logo" aria-label="Mu'ad Yogo Home">
          <Image
            src={logo}
            alt="Mu'ad Yogo"
            width={120}
            height={120}
            className="footer-logo-img"
          />
        </a>

        <nav className="footer-links" aria-label="Footer Navigation">
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Instagram
          </a>
          <a
            href={tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            TikTok
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            WhatsApp
          </a>
        </nav>

        <div className="footer-divider" />

        <p className="footer-bottom">© 2026 Muad Yogo. Curated Indulgence.</p>
      </div>
    </footer>
  );
}
