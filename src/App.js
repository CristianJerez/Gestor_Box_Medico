// 
import "./App.css";
import { AppProvider } from "./context/UserContext";
import { MyApp } from "./componentes/MyApp";

function App() {
  return (
    <AppProvider>
      <MyApp />
    </AppProvider>
  );
}

export default App;
