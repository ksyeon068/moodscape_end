import { useState, useEffect  } from 'react'
import Header from './components/Header'
import Bg from './components/Bg.jsx'
import Section1 from './components/Section1.jsx'
import Section2 from './components/Section2.jsx'
import Section3 from './components/Section3.jsx'
import Section4 from './components/Section4.jsx'
import Footer from './components/Footer.jsx'
import Loader from './components/loader/Loader.jsx'

import { ApiProvider, useApi } from './context/ApiContext'
import './App.css'

function AppContent() {

  const { loading } = useApi();
  const [minLoading, setMinLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading || minLoading) return <Loader />;

  return (
    <div className="App">
      <Header />
      <Bg />

      <section id="home">
        <Section1 />
      </section>

      <section id="today">
        <Section2 />
      </section>

      <section id="weather">
        <Section3 />
      </section>

      <section id="about">
        <Section4 />
      </section>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <ApiProvider>
      <AppContent />
    </ApiProvider>
  );
}

export default App
