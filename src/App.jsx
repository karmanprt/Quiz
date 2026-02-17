import { useState } from "react";
import "./App.css";

function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState("");
  const [mes, setMes] = useState(null);

  function calculateBmi(e) {
    e.preventDefault();

    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (!h || !w || h <= 0 || w <= 0) {
      alert("Enter Valid Value");
      return;
    }
    let bmi = w / (h * h);
    setBmi(bmi.toFixed(1));

    if (bmi < 18.5) {
      setMes("Underweight");
    } else if (bmi < 25) {
      setMes("Good");
    } else if (bmi < 30) {
      setMes("Overweight");
    } else {
      setMes("Obese");
    }
  }

  function reload() {
    setHeight("");
    setWeight("");
    setBmi("");
    setMes("");
  }

  return (
    <>
      <h2>BMI Calculater</h2>
      <form onSubmit={calculateBmi}>
        <div className="input_div">
          <label className="input_label">Enter your Height</label>
          <input
            type="number"
            placeholder="Enter height in meter"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
            }}
          ></input>
        </div>

        <div className="input_div">
          <label className="input_label">Enter your Weight</label>
          <input
            type="number"
            placeholder="Enter weight in kg"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
            }}
          ></input>
        </div>

        <button id="submit" className="form_button" type="submit">
          Submit{" "}
        </button>
        <button
          id="reset"
          className="form_button"
          onClick={reload}
          type="button"
        >
          Reload{" "}
        </button>
        <div className="result">
          <p>{mes}</p>
        </div>
      </form>
    </>
  );
}

export default App;
