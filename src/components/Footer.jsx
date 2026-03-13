import { useState } from "react";
import "../style/footer.scss";

function Footer() {

  const [modalOpen, setModalOpen] = useState(false);

  // 헤더랑 같은 스크롤 이동
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <>
      <footer className="footer">

        <div className="footer-inner">

          <div className="footer-left">
            <h2 className="logo"><img src="/img/Logo_D.png" alt="logo" /></h2>

            <p>사업자번호:1234-567890</p>
            <p>주소 : 서울특별시 관악구 신림동 무드 빌딩 201호</p>

            <p className="desc">
              MoodScape는 날씨와 감정을 기반으로 음악을 추천하는 감성 플랫폼입니다<br />
              날씨에 어울리는 음악을 통해 하루의 분위기를 더욱 특별하게 만들어보세요.
            </p>
          </div>

          <div className="footer-right">

            <div className="menu">
              <h3>MENU</h3>
              <ul>
                <li onClick={() => scrollToSection("home")}>HOME</li>
                <li onClick={() => scrollToSection("today")}>TODAYPLI</li>
                <li onClick={() => scrollToSection("weather")}>WEATHERPLI</li>
                <li onClick={() => scrollToSection("about")}>ABOUT</li>
              </ul>
            </div>

            <div className="social">
              <h3>SOCIAL</h3>
              <ul>

                <li>
                  <a 
                    href="https://www.youtube.com/@MoodScape_201" 
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    YOUTUBE
                  </a>
                </li>

                <li onClick={() => setModalOpen(true)}>INSTAGRAM</li>
                <li onClick={() => setModalOpen(true)}>FACEBOOK</li>
                <li onClick={() => setModalOpen(true)}>X(TWITTER)</li>

              </ul>
            </div>

          </div>

        </div>

        <div className="copyright">
          <div className="inner">©MoodScape 2026 all right reserved.</div>
        </div>

      </footer>

      {modalOpen && (
        <div className="modal" onClick={() => setModalOpen(false)}>
            
            <div 
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            >
            <p>아직 준비되지 않은 서비스입니다.</p>
            <button onClick={() => setModalOpen(false)}>닫기</button>
            </div>

        </div>
        )}
    </>
  );
}

export default Footer;