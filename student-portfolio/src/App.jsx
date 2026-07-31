import { Routes, Route } from 'react-router-dom';
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import NotFound from "./components/NotFound";
import Footer from "./components/Footer";
import Cursor from "./components/Cursor";
import Background from "./components/Background";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Cursor />
      <Background />
      <NavBar />
      <main className="main-content">
        <Routes>
          <Route path="/"        element={<Home />}     />
          <Route path="/skills"  element={<Skills />}   />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />}  />
          <Route path="*"        element={<NotFound />} />
        </Routes>
      </main>
      <Footer email="dharmit9626@gmail.com" />
    </div>
  );
}

export default App;