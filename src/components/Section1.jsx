import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import '../style/section1.scss';
import { musicLibrary } from './musicData'; 
import { useApi } from '../context/ApiContext'; 


import { BiShuffle, BiSkipPrevious, BiPlay, BiPause, BiSkipNext, BiRepeat, BiListUl, BiX } from "react-icons/bi";
import { FiMapPin, FiImage, FiChevronDown, FiWind, FiDroplet, FiEye } from "react-icons/fi";
import { MdOutlineEqualizer, MdWaves } from "react-icons/md";
// WeatherIcons
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiFog, WiDayCloudy } from "react-icons/wi";

const Section1 = () => {
  const { WEATHER_API_KEY } = useApi();

  const [isMusicList, setIsMusicList] = useState(false);
  const [isWeatherDetail, setIsWeatherDetail] = useState(false);
  
  const [weather, setWeather] = useState(null); 
  const [forecast, setForecast] = useState(null); 
  const [airQuality, setAirQuality] = useState(null); 
  const [weatherClass, setWeatherClass] = useState('theme-clouds'); 

  const [activePlaylistKey, setActivePlaylistKey] = useState('sunny'); 
  const [playlist, setPlaylist] = useState([]); 
  
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  const currentSong = playlist[currentSongIndex];

  const playlistTitleMap = {
    'sunny': 'SUNSHINE SCENE', 
    'cloudy': 'CLOUDY MOOD',
    'rainy': 'RAIN SCENE',
    'stormy': 'THUNDER NIGHT',
    'snowy': 'SNOW SCENE',
    'misty': 'FOGGY DAWN'
  };

  useEffect(() => {
    const fetchDurations = async () => {
      const currentArray = musicLibrary[activePlaylistKey] || musicLibrary['sunny'];

      const updatedPlaylist = await Promise.all(
        currentArray.map((song) => {
          return new Promise((resolve) => {
            const audio = new Audio(song.audioSrc);
            audio.addEventListener('loadedmetadata', () => {
              const totalSeconds = audio.duration;
              const minutes = Math.floor(totalSeconds / 60);
              const seconds = Math.floor(totalSeconds % 60);
              resolve({ ...song, duration: `${minutes}:${seconds.toString().padStart(2, '0')}` });
            });
            audio.addEventListener('error', () => resolve({ ...song, duration: "--:--" }));
          });
        })
      );
      
      setPlaylist(updatedPlaylist);
      setCurrentSongIndex(0); 
      setIsPlaying(false);
      setCurrentTime(0);
    };

    fetchDurations();
  }, [activePlaylistKey]);

  useEffect(() => {
    if (!WEATHER_API_KEY) {
      console.warn("API 키가 없습니다. .env 파일을 확인해주세요.");
      return;
    }

    const fetchAllWeather = async (lat, lon) => {
      try {
        const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
        setWeather(weatherRes.data);

        const forecastRes = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
        setForecast(forecastRes.data);

        const airRes = await axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}`);
        setAirQuality(airRes.data);

        const weatherMain = weatherRes.data.weather[0].main;
        
        const themeMap = {
          'Clear': 'theme-sunny', 'Clouds': 'theme-clouds', 'Rain': 'theme-rain',
          'Drizzle': 'theme-rain', 'Thunderstorm': 'theme-thunder', 'Snow': 'theme-snow',
          'Mist': 'theme-mist', 'Fog': 'theme-mist', 'Haze': 'theme-mist'
        };
        setWeatherClass(themeMap[weatherMain] || 'theme-clouds');

        const playlistMap = {
          'Clear': 'sunny', 'Clouds': 'cloudy', 'Rain': 'rainy',
          'Drizzle': 'rainy', 'Thunderstorm': 'stormy', 'Snow': 'snowy',
          'Mist': 'misty', 'Fog': 'misty', 'Haze': 'misty' 
        };
        setActivePlaylistKey(playlistMap[weatherMain] || 'sunny');

      } catch (error) {
        console.error("Weather API Error:", error);
        }
      };
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          fetchAllWeather(lat, lon);
        },
        (error) => {
          console.warn("위치 정보를 가져올 수 없어 기본값(서울)을 사용합니다.", error);
          fetchAllWeather(37.5665, 126.9780);
        }
      );
    }, [WEATHER_API_KEY]); 

  const today = new Date();
  const dateString = `${today.getFullYear()} ${(today.getMonth() + 1).toString().padStart(2, '0')} ${today.getDate().toString().padStart(2, '0')}`;

  const getWeatherIcon = (main, size = 24) => {
    switch (main) {
      case 'Clear': return <WiDaySunny size={size} />;
      case 'Clouds': return <WiCloudy size={size} />;
      case 'Rain': case 'Drizzle': return <WiRain size={size} />;
      case 'Snow': return <WiSnow size={size} />;
      case 'Thunderstorm': return <WiThunderstorm size={size} />;
      case 'Mist': case 'Fog': case 'Haze': return <WiFog size={size} />;
      default: return <WiDayCloudy size={size} />;
    }
  };

  const hourlyData = forecast ? forecast.list.slice(0, 7).map((item) => {
    const time = new Date(item.dt * 1000).getHours();
    return {
      time: `${time > 12 ? time - 12 : time} ${time >= 12 ? 'P.M.' : 'A.M.'}`,
      icon: getWeatherIcon(item.weather[0].main, 32), 
      temp: `${Math.round(item.main.temp)}°`
    };
  }) : Array(7).fill({ time: '-', icon: <WiDaySunny size={32}/>, temp: '-' });

  if (weather && hourlyData[0]) {
    hourlyData.unshift({ time: '현재', icon: getWeatherIcon(weather.weather[0].main, 32), temp: `${Math.round(weather.main.temp)}°` });
    hourlyData.pop(); 
  }

  const dailyMap = {};
  if (forecast) {
    forecast.list.forEach(item => {
      const date = new Date(item.dt * 1000);
      const dayStr = date.toLocaleDateString('ko-KR', { weekday: 'short' }); 
      if (!dailyMap[dayStr]) {
        dailyMap[dayStr] = { min: item.main.temp_min, max: item.main.temp_max, icon: item.weather[0].main };
      } else {
        dailyMap[dayStr].min = Math.min(dailyMap[dayStr].min, item.main.temp_min);
        dailyMap[dayStr].max = Math.max(dailyMap[dayStr].max, item.main.temp_max);
      }
    });
  }
  const dailyData = Object.keys(dailyMap).slice(0, 6).map((day, idx) => ({
    day: idx === 0 ? '오늘' : day, icon: getWeatherIcon(dailyMap[day].icon, 20),
    min: `${Math.round(dailyMap[day].min)}°`, max: `${Math.round(dailyMap[day].max)}°`
  }));

  const aqiValue = airQuality?.list[0]?.main?.aqi || 0;
  const getAqiText = (aqi) => {
    switch(aqi) { case 1: return '좋음'; case 2: return '보통'; case 3: return '민감군 나쁨'; case 4: return '나쁨'; case 5: return '매우 나쁨'; default: return '-'; }
  };
  const detailData = weather ? [
    { label: '미세먼지', value: `${getAqiText(aqiValue)}(${airQuality?.list[0]?.components?.pm10 || 0}µg/m³)`, icon: null },
    { label: '초미세먼지', value: `${getAqiText(aqiValue)}(${airQuality?.list[0]?.components?.pm2_5 || 0}µg/m³)`, icon: null },
    { label: '습도', value: `${weather.main.humidity}%`, icon: <FiDroplet /> },
    { label: '바람', value: `${weather.wind.speed}m/s`, icon: <FiWind /> },
    { label: '기압', value: `${weather.main.pressure}hPa`, icon: <MdWaves /> },
    { label: '가시거리', value: `${(weather.visibility / 1000).toFixed(1)}km`, icon: <FiEye /> },
  ] : [];

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("재생 오류:", e));
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    if (isPlaying) { audioRef.current.pause(); } else { audioRef.current.play(); }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (isShuffle) {
      let randomIndex = currentSongIndex;
      while (randomIndex === currentSongIndex && playlist.length > 1) { randomIndex = Math.floor(Math.random() * playlist.length); }
      setCurrentSongIndex(randomIndex);
    } else {
      setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  const playPrev = () => { setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length); };
  const handleLoadedMetadata = () => { setDuration(audioRef.current.duration); };
  const handleTimeUpdate = () => { setCurrentTime(audioRef.current.currentTime); };
  const handleScrub = (e) => {
    if (!progressBarRef.current) return;
    const clickPercentage = (e.clientX - progressBarRef.current.getBoundingClientRect().left) / progressBarRef.current.offsetWidth;
    const newTime = clickPercentage * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  const handleEnded = () => { if (isRepeat) { audioRef.current.play(); } else { playNext(); } };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "0:00";
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const selectSongFromList = (index) => { setCurrentSongIndex(index); setIsPlaying(true); setIsMusicList(false);};
  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  return (
    <section className={`hero-container ${weatherClass}`}>
      <div className="inner" onClick={() => { setIsMusicList(false); setIsWeatherDetail(false); }}>

        <audio 
          ref={audioRef} src={currentSong?.audioSrc}
          onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} onEnded={handleEnded}
        />

        {/* --- [1] 기본 플레이어 위젯 --- */}
        <div className={`music-widget ${isMusicList ? 'hidden' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="player-view">
            <div className="progress-area">
              <span className="time">{formatTime(currentTime)}</span>
              <div className="progress-bar" ref={progressBarRef} onClick={handleScrub}>
                <div className="fill" style={{ width: `${progressPercentage}%` }}></div>
                <div className="knob" style={{ left: `${progressPercentage}%` }}></div>
              </div>
              <span className="time">{formatTime(duration)}</span>
            </div>
            <div className="controls">
              <button className={`icon-btn ${isShuffle ? 'active' : ''}`} onClick={() => setIsShuffle(!isShuffle)}><BiShuffle size={20} /></button>
              <button className="icon-btn" onClick={playPrev}><BiSkipPrevious size={28} /></button>
              <button className="play-btn" onClick={togglePlay}>
                {isPlaying ? <BiPause size={36} color="white" /> : <BiPlay size={36} color="white" style={{ marginLeft: '4px' }} />}
              </button>
              <button className="icon-btn" onClick={playNext}><BiSkipNext size={28} /></button>
              <button className={`icon-btn ${isRepeat ? 'active' : ''}`} onClick={() => setIsRepeat(!isRepeat)}><BiRepeat size={20} /></button>
            </div>
            <div className="footer-info">
              <div className="album-mini">
                {currentSong?.cover ? <img src={currentSong.cover} alt="album cover" /> : <FiImage size={20} color="white" />}
              </div>
              <div className="track-info">
                <div className={`animated-eq ${isPlaying ? 'playing' : ''}`}>
                  <span className="bar bar1"></span>
                  <span className="bar bar2"></span>
                  <span className="bar bar3"></span>
                </div>
                
                <span className="title">{currentSong?.title || "Loading..."}</span>
              </div>
              <button className="list-btn" onClick={(e) => { e.stopPropagation(); setIsMusicList(true); }}><BiListUl size={26} /></button>
            </div>
          </div>
        </div>

        {/* --- [2] 플레이리스트 오버레이 --- */}
        <div className={`playlist-overlay ${isMusicList ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="playlist-view">
            <div className="list-header">
              <div className="text-group">
                <h3>PLAYLIST: {playlistTitleMap[activePlaylistKey]}</h3>
                <span>현재 {playlist.length}곡이 있습니다.</span>
              </div>
              <button className="close-btn" onClick={() => setIsMusicList(false)}><BiX size={28} /></button>
            </div>
            <div className="list-content">
               <span className="label">TRACKLIST</span>
               <div className="scroll-area">
                  {playlist.map((song, index) => (
                    <div 
                      key={song.id} 
                      className={`song-item ${index === currentSongIndex ? 'playing' : ''}`}
                      onClick={() => selectSongFromList(index)}
                    >
                      <div className="left">
                        <div className="mini-art">
                          {song.cover ? <img src={song.cover} alt="cover" /> : <FiImage size={16} color="#999"/>}
                        </div>
                        <div className="info">
                          <p className="song-title">{song.title}</p>
                          <span className="artist">{song.artist}</span>
                        </div>
                      </div>
                      <span className="duration">
                        {index === currentSongIndex && isPlaying ? (
                          <MdOutlineEqualizer size={16} />
                        ) : (song.duration || "로딩중...")}
                      </span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* --- [날씨 영역] --- */}
        <div 
          className={`weather-widget ${isWeatherDetail ? 'hidden' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsWeatherDetail(true);
          }}
        >
          <div className="weather-summary-view">
            <div className="top-row">
              <div className="temp-wrap"><span className="temp">{weather ? Math.round(weather.main.temp) : '0'}°</span>{weather ? getWeatherIcon(weather.weather[0].main, 36) : <WiDaySunny size={36}/>}</div>
              <FiMapPin size={20} className="loc-icon" />
            </div>
            <div className="bottom-row">
              <div className="date-info"><p className="city">{weather ? weather.name.toUpperCase() : 'SEOUL'}</p><span className="date">{dateString}</span></div>
              <button className="menu-btn"><BiListUl size={24} /></button>
            </div>
          </div>
        </div>

        <div className={`weather-overlay ${isWeatherDetail ? 'active' : ''}`} onClick={(e) => e.stopPropagation()}>
          <div className="weather-detail-view">
             <div className="detail-header">
                <div className="header-left"><span className="big-temp">{weather ? Math.round(weather.main.temp) : '0'}°</span>{weather ? getWeatherIcon(weather.weather[0].main, 40) : <WiDaySunny size={40}/>}</div>
                <div className="header-right"><div className="loc-row"><FiMapPin size={16}/> {weather ? weather.name.toUpperCase() : 'SEOUL'}</div><span className="date-text">{dateString}</span></div>
             </div>
             <div className="detail-content">
                <div className="glass-card hourly-card">
                  <p className="summary-text">{weather?.weather[0].description || '날씨 정보를 불러오는 중입니다.'}</p>
                  <div className="divider"></div>
                  <div className="hourly-list">
                    {hourlyData.map((item, idx) => (<div key={idx} className="hour-item"><span className="h-time">{item.time}</span><div className="h-icon">{item.icon}</div><span className="h-temp">{item.temp}</span></div>))}
                  </div>
                </div>
                <div className="bottom-cards">
                   <div className="glass-card daily-card">
                      <div className="card-title">일기예보</div>
                      <div className="divider"></div>
                      <div className="daily-list">
                        {dailyData.length > 0 ? dailyData.map((day, idx) => (<div key={idx} className="day-row"><span className="d-day">{day.day}</span><div className="d-icons">{day.icon}</div><div className="d-temp"><span className="max">{day.max}</span><span className="min">{day.min}</span></div></div>)) : <p style={{fontSize:'12px', opacity:0.7}}>데이터 로딩 중...</p>}
                      </div>
                   </div>
                   <div className="glass-card detail-info-card">
                      <div className="card-title">상세 날씨</div>
                      <div className="divider"></div>
                      <div className="info-list">
                        {detailData.length > 0 ? detailData.map((info, idx) => (<div key={idx} className="info-row"><div className="info-label">{info.icon && <span className="i-icon">{info.icon}</span>}<span>{info.label}</span></div><span className="info-value">{info.value}</span></div>)) : <p style={{fontSize:'12px', opacity:0.7}}>데이터 로딩 중...</p>}
                      </div>
                   </div>
                </div>
             </div>
             <button className="close-btn" onClick={() => setIsWeatherDetail(false)}><BiX size={28} /></button>
          </div>
        </div>

        <div className={`scroll-indicator ${(isMusicList || isWeatherDetail) ? 'hidden' : ''}`}>
          <FiChevronDown size={40} className="arrow first" />
          <FiChevronDown size={40} className="arrow second" />
        </div>
        
      </div>
    </section>
  );
};

export default Section1;