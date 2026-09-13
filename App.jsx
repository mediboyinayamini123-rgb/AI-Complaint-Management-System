import "./App.css";

import ComplaintForm from "./components/ComplaintForm";
import AIAssistant from "./components/AIAssistant";

function App() {
  return (
    <div className="app">

      <header className="app-header">
        <h1>AI Complaint Management System</h1>
        <p>Pharmaceutical Customer Complaint Management</p>
      </header>

      <main className="main-container">

        {/* Left side - Complaint Form */}
        <section className="complaint-panel">
          <h2>Complaint Details</h2>

          <p className="section-description">
            Enter or review customer complaint information.
          </p>

          <ComplaintForm />
        </section>

        {/* Right side - AI Copilot */}
        <section className="copilot-panel">
          <AIAssistant />
        </section>

      </main>

    </div>
  );
}

export default App;