import { useEffect, useState } from "react";
import QuestionAnswersCSVUpload from "./components/QuestionAnswersCSVUpload";
import TalentProfileUpload from "./components/TalentProfileUpload";
import EmployerProfileUpload from "./components/EmployerProfileUpload";
import Navigation from "./components/Navigation";
import UserRegistration from "./components/UserRegistration";
import AdminUserRegistration from "./components/AdminUserRegistration";
import UsersManagement from "./components/UsersManagement";
import Login from "./components/Login";
import axios from "axios";
import "./App.css";
import { Routes, Route, Link } from "react-router-dom";
// import "bootstrap/dist/js/bootstrap.bundle";
// import "bootstrap/dist/css/bootstrap.css";
console.log("REACT_APP_SERVER_URL", process.env.REACT_APP_SERVER_URL);
function App() {
  const [isValid, setIsValid] = useState(false);
  let userName = "";
  const userStr = localStorage.getItem("user");
  if (userStr) {
    userName = `${JSON.parse(userStr).firstName} ${
      JSON.parse(userStr).lastName
    }`;
  }
  const checkLogin = async () => {
    const promise = new Promise(async (resolve, reject) => {
      const token = JSON.parse(localStorage.getItem("token"));

      debugger;
      if (!token) {
        reject({ message: "token not found" });
        return;
      }
      let header2 = {
        headers: {
          Authorization: "Bearer " + token,
        },
      };
      try {
        const resp = await axios.post(
          `${process.env.REACT_APP_SERVER_URL}/api/users/checkToken`,
          {},
          header2
        );
        resolve({ message: "token valid" });
        //   setStateObj(initialState);
      } catch (e) {
        alert(e.response.data.message);
        reject({ message: "token validation failes" });
        return;
      }
    });
    return promise;
  };
  useEffect(() => {
    const checkValidity = async () => {
      try {
        await checkLogin();
        setIsValid(true);
      } catch {
        setIsValid(false);
      }
    };
    checkValidity();
  }, []);
  if (!isValid) {
    return (
      <>
        {/* <Navigation /> */}
        <Login />
      </>
    );
  }
  return (
    <div className="App">
      <Navigation userName={userName} />
      <Routes>
        <Route path="/" element={<div></div>} />
        <Route path="/login" el ement={<Login />} />
        <Route path="/createUser" element={<UserRegistration />} />
        <Route path="/createAdmin" element={<AdminUserRegistration />} />
        <Route path="/manageUser" element={<UsersManagement />} />
        <Route path="/employer" element={<EmployerProfileUpload />} />
        <Route path="/talent" element={<TalentProfileUpload />} />
        <Route path="/question" element={<QuestionAnswersCSVUpload />} />
      </Routes>
    </div>
  );
}

export default App;
