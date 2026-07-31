function Footer({ email }) {
  const year = new Date().getFullYear();

  return (
    <footer className="footer animate-fade-in delay-3">
      <p className="footer-text">
        © {year} Dharmit Monani. Built with React, Vite & ✨ Magic.
      </p>
      {email && <p className="footer-contact">Contact: {email}</p>}
    </footer>
  );
}

export default Footer;