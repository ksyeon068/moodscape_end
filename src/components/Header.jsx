import { useEffect, useState } from 'react';
import { useApi } from "../context/ApiContext";
import '../style/header.scss';

function Header() {

  const { weather } = useApi(); // ⭐ 여기만 바뀜
  /* const [weather, setWeather] =useState("sunny") */
  const [isFixed, setIsFixed] = useState(false);

  // 스크롤 감지
  useEffect(() => {

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsFixed(true);
      } 
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

  }, []);

  // 메뉴 클릭시 스크롤 이동
  const scrollToSection = (id) => {

    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth"
    });

  };

  return (
    <header className={`header ${isFixed ? "fixed" : ""} ${weather || ""}`}>
      <div className="header-inner">

        <div onClick={() => scrollToSection("home")} className="logo">
          <img src="/img/Logo_D.png" alt="logo" />
        </div>

        <nav className="menu">
          <button onClick={() => scrollToSection("home")} className='mohide'>HOME</button>
          <button onClick={() => scrollToSection("today")}>TODAYPLI</button>
          <button onClick={() => scrollToSection("weather")}>WEATHERPLI</button>
          <button onClick={() => scrollToSection("about")}>ABOUT</button>
        </nav>

      </div>
    </header>
  );
}

export default Header;