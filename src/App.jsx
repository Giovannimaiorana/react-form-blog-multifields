import { useState } from "react";
import TheHeader from "./components/TheHeader";
import TheForm from "./components/TheForm";

import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <TheHeader />
      <main>
        <TheForm />
      </main>
    </>
  );
}

export default App;
