import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Autoplay } from "swiper/modules";
import { useRef, useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "../style/section3.scss";
import { FiChevronDown } from "react-icons/fi";



function Section3() {

  const swiperRef = useRef(null);
  const sectionRef = useRef(null);
  const [show, setShow] = useState(false);
  useEffect(() => {

  const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
        }
      },
      { threshold: 0.3 }
    );

    if(sectionRef.current){
      observer.observe(sectionRef.current);
    }

  }, []);


  const weatherSlides = [
  { name: "SUNNY", img: "/img/thumbnail/Sunny_Final cut.jpg", youtube: "https://youtu.be/HlBBH6dFrq8?si=2Cahj1pEKJNWTXNg", class: "sunny" },
  { name: "RAINY", img: "/img/thumbnail/Rainy_Final cut.jpg", youtube: "https://youtu.be/XYvAUh71bY4?si=HUAWi_q8o-hBKqkY", class: "rainy" },
  { name: "SNOWY", img: "/img/thumbnail/Snow_Final cut.jpg", youtube: "https://youtu.be/wOmDGZbKDro?si=5a3YGMs6dXrbi0GI", class: "snowy" },
  { name: "MISTY", img: "/img/thumbnail/Fog_Final cut.jpg", youtube: "https://youtu.be/TASdXqczMbQ?si=GlqzUOuGDQCQIXeE", class: "misty" },
  { name: "STORMY", img: "/img/thumbnail/Thunder_Final cut.jpg", youtube: "https://youtu.be/rsJn8iwHPwo?si=uYXPW5N51oknsKLO", class: "stormy" },
  { name: "CLOUDY", img: "/img/thumbnail/Cloud_Final cut.jpg", youtube: "https://youtu.be/VPOGct31Wkk?si=RzSS_PUhoV7elxtK", class: "cloudy" }
];

  const moveSlide = (index) => {
    swiperRef.current.swiper.slideToLoop(index);
  };

  return (
    <div
      ref={sectionRef}
      className={`weather-section ${show ? "show" : ""}`}
      id="weather"
    >

      <div className="section-head">

        <div className="left">
          <h2>날씨별 플레이리스트</h2>
          <p>Weather Playlist <br />
          Discover music that fits the mood of today's weather</p>
        </div>

        <div className="right">
          <a 
            href="https://www.youtube.com/@MoodScape_201"
            target="_blank"
            className="youtube-btn"
          >
            유튜브 채널 가기
          </a>
        </div>

      </div>

      <div className="pick-label">
        <span>pick your weather</span>
        <div className="scroll-indicator">
          <FiChevronDown size={40} className="arrow first" /><FiChevronDown size={40} className="arrow second" />
        </div>
      </div>
      
      <div className="weather-filter">

        {weatherSlides.map((item, index) => (
            <button
                key={index}
                className={item.class}
                onClick={() => moveSlide(index)}
            >
                {item.name}
            </button>
            ))}

      </div>

      <div className="swiper-area">
        <Swiper
          ref={swiperRef}
          modules={[EffectCoverflow, Autoplay]}
          autoplay={true}
          effect={"coverflow"}
          centeredSlides={true}
          loop={true}
          slidesPerView={1.8}
          breakpoints={{
            1920: {
              spaceBetween: 400,
            },
            1440: {
              spaceBetween: 300,
            },
            1280: {
              spaceBetween: 250,
            },
            1024: {
              spaceBetween: 180,
            },
            960: {
              spaceBetween: 180,
            },
            720: {
              spaceBetween: 120,
            },
            480: {
              spaceBetween: 50,
            }
          }}
          grabCursor={true}
          onClick={(swiper) => {
            const clickedIndex = swiper.clickedIndex;
            const activeIndex = swiper.activeIndex;

            // 가운데 슬라이드 클릭 → 유튜브 이동
            if (clickedIndex === activeIndex) {
              const slide = weatherSlides[swiper.realIndex];
              window.open(slide.youtube, "_blank");
            } 
            // 옆 슬라이드 클릭 → 가운데로 이동
            else {
              swiper.slideTo(clickedIndex);
            }
          }}
          coverflowEffect={{
            rotate: 40,      
            stretch: 0,    
            depth: 300,      
            modifier: 1,
            slideShadows: false,
          }}
          className="mySwiper"
        >
          {weatherSlides.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="slide-content">
                <img src={item.img} alt={item.name} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </div>
  );
}

export default Section3;


