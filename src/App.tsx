import "./App.css";
import NavBar from "./components/Header/NavBar";
import Tracker from "./pages/Tracker";

function App() {
  return (
    <div className="dark:bg-[var(--second-primary-color)] min-h-screen bg-[#F7F9FB]">
      <NavBar />
      <Tracker />
    </div>
  );
}

export default App;
