import QuestionAnswersCSVUpload from "./components/QuestionAnswersCSVUpload";
import TalentProfileUpload from "./components/TalentProfileUpload";
import EmployerProfileUpload from "./components/EmployerProfileUpload";
import Navigation from "./components/Navigation";
import UserRegistration from "./components/UserRegistration";
import AdminUserRegistration from "./components/AdminUserRegistration";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
// import "bootstrap/dist/js/bootstrap.bundle";
// import "bootstrap/dist/css/bootstrap.css";
console.log("REACT_APP_SERVER_URL", process.env.REACT_APP_SERVER_URL);
function App() {
  return (
    <div className="App">
      <Navigation />
      <Routes>
        <Route path="/" element={<div></div>} />
        <Route path="/createUser" element={<UserRegistration />} />
        <Route path="/createAdmin" element={<AdminUserRegistration />} />
        <Route path="/employer" element={<EmployerProfileUpload />} />
        <Route path="/talent" element={<TalentProfileUpload />} />
        <Route path="/question" element={<QuestionAnswersCSVUpload />} />
      </Routes>
    </div>
  );
}

export default App;
