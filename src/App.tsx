import React from "react";
import Snow from "./components/snow";

interface Size {
  width: number;
  height: number;
}

function App() {
  const [size, setSize] = React.useState<Size>({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  React.useEffect(() => {
    function clientResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", clientResize);

    return function () {
      window.removeEventListener("resize", clientResize);
    };
  }, []);

  return (
    <div className="container">
      <Snow {...size} />
      <section className="section">
        <div className="text">
          <p>Make it Snow.</p>
        </div>
      </section>
    </div>
  );
}

export default App;
