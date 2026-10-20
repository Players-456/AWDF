import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
const NavBar = lazy(() => import("./components/NavBar"));
const Home = lazy(() => import("./components/Home"));
const Skills = lazy(() => import("./components/Skills"));
const Projects = lazy(() => import("./components/Projects"));
const TaskManager = lazy(() => import("./components/TaskManager"));
const Contact = lazy(() => import("./components/Contact"));
const NotFound = lazy(() => import("./components/NotFound"));
const Footer = lazy(() => import("./components/Footer"));
import Cursor from "./components/Cursor";
import Background from "./components/Background";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Cursor />
      <Background />
      <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px' }}>Loading page...</div>}>
        <NavBar />
        <main className="main-content">
          <Routes>
            <Route path="/"        element={<Home />}        />
            <Route path="/skills"  element={<Skills />}      />
            <Route path="/projects" element={<Projects />}    />
            <Route path="/tasks"   element={<TaskManager />} />
            <Route path="/contact" element={<Contact />}     />
            <Route path="*"        element={<NotFound />}    />
          </Routes>
        </main>
        <Footer email="dharmit9626@gmail.com" />
      </Suspense>
    </div>
  );
}

export default App;