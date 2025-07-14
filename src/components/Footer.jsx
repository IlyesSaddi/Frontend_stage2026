import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h3>Device Speak</h3>
        <p>© 2025 All rights reserved.</p>
      </div>
      <div className="footer-center">
        <p>Email: <a href="mailto:support@devicespeak.com">support@devicespeak.com</a></p>
        <p>Phone: <a href="tel:+21655555555">+216 55 555 555</a></p>
      </div>
      <div className="footer-right">
        <p>Follow us on social media:</p>
        <ul className="social-links" aria-label="Social media links">
          <li><a href="https://facebook.com/devicespeak" target="_blank" rel="noopener noreferrer" aria-label="Facebook">Facebook</a></li>
          <li><a href="https://twitter.com/devicespeak" target="_blank" rel="noopener noreferrer" aria-label="Twitter">Twitter</a></li>
          <li><a href="https://instagram.com/devicespeak" target="_blank" rel="noopener noreferrer" aria-label="Instagram">Instagram</a></li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer;
