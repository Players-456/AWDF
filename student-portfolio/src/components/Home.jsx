import Header from './Header';
import About from './About';

function Home() {
  return (
    <div className="home-page animate-fade-in">
      <Header name="Dharmit Monani" />
      <About />
    </div>
  );
}

export default Home;
