import { useEffect,useRef, useState } from "react";
import { useApi } from "../context/ApiContext";

import "../style/section4.scss";

const images = [
    "../img/source/Cloud_Source file.png",
    "../img/source/Fog_Source file.png",
    "../img/source/Rainy_Source file.png",
    "../img/source/Snow_Source file.png",
    "../img/source/Sunny_Source file.png",
    "../img/source/Thunder_Source file.png"
];

const Section4 = () => {
	const { weather } = useApi();
    const sectionRef = useRef(null);
    const [currentImg, setCurrentImg] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            /* 1. 기존 fade animation */
            const elements = document.querySelectorAll(".text, .circle, .top_des");
            const trigger = window.innerHeight * 0.75;

            elements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < trigger && rect.bottom > 0) {
                    el.classList.add("fade-in");
                    el.classList.remove("fade-out");
                } else {
                    el.classList.remove("fade-in");
                    el.classList.add("fade-out");
                }
            });

            /* 2. 이미지 타이밍 수정 (핵심) */
            const section = sectionRef.current;
            if (!section) return;

            const sectionTop = section.offsetTop;
            const viewportHeight = window.innerHeight;
            
            // [수정] 약 250vh 지점(텍스트가 거의 끝나는 지점)까지만 스크롤 영역으로 잡음
            // 이렇게 하면 .aboutLast(하단 빨간 박스)가 나오기 훨씬 전에 6번의 변화가 끝납니다.
            const scrollStart = sectionTop; 
            const scrollEnd = sectionTop + (viewportHeight * 2.2); // 2.2배 지점에서 종료
            const currentScroll = window.scrollY;

            // 진행도 계산 (0 ~ 1)
            let progress = (currentScroll - scrollStart) / (scrollEnd - scrollStart);

            // 인덱스 계산
            let index = Math.floor(progress * images.length);

            if (index < 0) index = 0;
            if (index >= images.length) index = images.length - 1;

            // 값이 바뀔 때만 업데이트 (뚝뚝 끊김 방지)
            setCurrentImg((prev) => (prev !== index ? index : prev));
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

  	return (
		<section className={`about ${weather}`} ref={sectionRef}>

			<div className="top_des">
				<h2 className="left_des">An atmosphere shaped</h2>
				<h2 className="right_des">by mood or feeling.</h2>
			</div>

			<div className="inner">

				<div className="center-wrapper">
					<div className="sticky-circle">
						{/* 수정: 6개 이미지를 미리 다 렌더링해서 겹쳐둠 */}
						{images.map((src, idx) => (
							<img
								key={idx}
								src={src}
								alt={`weather-${idx}`}
								// 현재 인덱스인 이미지만 클래스 활성화
								className={currentImg === idx ? "active" : ""}
							/>
						))}
					</div>
				</div>

				<div className="scroll-content">

					{/* left text 1 */}
					<div className="left-content text1 text">
						<h3>변화하는 환경 속에서</h3>
						<p>날씨는 <br />우리 일상에 <br />꾸준히 영향을 미치는 요소입니다.</p>
					</div>

					{/* right text 1 */}
					<div className="right-content text2 text">
						<p>
							하루의 기분, 활동 방식, <br />집중과 휴식의 흐름까지 날씨는<br />
							자연스럽게 삶의 리듬을 만들어 냅니다.
						</p>
					</div>

					{/* left text 2 */}
					<div className="left-content text3 text">
						<p>
							이처럼 날씨는 자연 현상을 넘어 <br />
							우리의 감정과 분위기에 <span>깊게 연결되어 있습니다.</span>
						</p>
					</div>

					{/* left text 3 */}
					<div className="right-content text4 text">
						<p>
							<span>MoodScape</span>는 <br />
							날씨의 변화를 바탕으로<br />
							어울리는 음악을 추천합니다.
						</p>
					</div>

					{/* right text 2 */}
					<div className="right-content text5 text">
						<p>
							단순히 음악을 나열하는 것이 아닌, <br />
							하루의 분위기를 결정하는 공간입니다.
						</p>
					</div>

					{/* right text 2 */}
					<div className="left-content text6 text">
						<p>
							날씨가 만들어 내는 분위기와 음악이 만나<br />
							일상 속 작은 순간들을 <br />
							더욱 풍부하게 만들어 줍니다.
						</p>
					</div>

					<div className="bottom-text text7 text">
						<p>당신의 환경에 가장 어울리는 <br />음악을 발견하고, 경험해 보세요.</p>
					</div>

				</div>

			</div>

			{/* image circles */}
			<div className="decoCircles">
				<div className="circle circle1">
					<img src="../img/source/Weather_Pic 4.jpg" alt="subWeatherImg1" />
				</div>

				<div className="circle circle2">
					<img src="../img/source//Weather_Pic 3.jpg" alt="subWeatherImg2" />
				</div>

				<div className="circle circle3">
					<img src="../img/source/Weather_Pic 5.jpg" alt="subWeatherImg3" />
				</div>

				<div className="circle circle4">
					<img src="../img/source/Weather_Pic 7.jpg" alt="subWeatherImg4" />
				</div>

				<div className="circle circle5">
					<img src="../img/source/Weather_Pic 11.jpg" alt="subWeatherImg" />
				</div>
				<div className="circle circle6">
					<img src="../img/source/Weather_Pic 10.jpg" alt="subWeatherImg" />
				</div>
				<div className="circle circle7">
					<img src="../img/source/Weather_Pic 2.jpg" alt="subWeatherImg" />
				</div>
				<div className="circle circle8">
					<img src="../img/source/Weather_Pic 6.jpg" alt="subWeatherImg" />
				</div>
			</div>

			<div className="aboutLast">
				<div className="lastTextBox">
					<div className="texts">
						<h2>MOODSCAPE</h2>
						<p>	<span>날씨와 음악을 하나의 흐름으로 연결한 새로운 방식의 추천 서비스</span><br />
							실시간 기상 데이터를 분석하여 상황에 적합한 사운드를 연결하고<br />
							사용자가 별도의 탐색 없이도 자연스럽게 음악을 선택할 수 있도록 돕습니다.
						</p>
					</div>
				</div>
				<div className="aboutImgBox">
					<div className="aboutBg"></div>
					<img src="../img/source/about_b 2.jpg" alt="imgBox1" />
					<img src="../img/source/about_b 1.jpg" alt="imgBox2" />
					<img src="../img/source/about_b 3.jpg" alt="imgBox3" />
					<img src="../img/source/about_b 4.jpg" alt="imgBox4" />
				</div>
			</div>
		</section>
 	 );
};

export default Section4;
