import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { InvoiceStepOne } from "./pages/InvoiceStepOne";
import { InvoiceStepTwo } from "./pages/InvoiceStepTwo";
import { InvoiceStepThree } from "./pages/InvoiceStepThree.js";
import { InvoiceStepFour } from "./pages/InvoiceStepFour.js";
import { InvoiceStepFive } from "./pages/InvoiceStepFive.js";



function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/invoice-step-one" element={<InvoiceStepOne />} />
          <Route path="/invoice-step-two" element={<InvoiceStepTwo />} />
          <Route path="/invoice-step-three" element={<InvoiceStepThree />} />
          <Route path="/invoice-step-four" element={<InvoiceStepFour />} />
          <Route path="/invoice-step-five" element={<InvoiceStepFive />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<h1>PAGE NOT FOUND</h1>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
