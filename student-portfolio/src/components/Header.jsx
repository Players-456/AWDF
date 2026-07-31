function Header({ name }) {
  return (
    <header className="header animate-fade-in">
      <div className="header-inner">
        <h1 className="header-title">
          <span className="text-gradient">{name}</span>
          <span className="header-dot">.</span>
        </h1>
        <p className="header-subtitle delay-1 animate-fade-in">
          Computer Engineering Student & Full-Stack Developer crafting digital experiences that just look like a wow.
        </p>
      </div>
    </header>
  );
}

export default Header;