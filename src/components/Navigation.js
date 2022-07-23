import React from "react";
import { NavLink, Link } from "react-router-dom";
const Navigation = (props) => {
  let activeStyle = {
    textDecoration: "none",
    color: "rgba(0,0,0,1)",
    fontWeight: "bold",
  };
  let inactiveStyle = {
    textDecoration: "none",
    color: "rgba(0,0,0,.5)",
  };
  let activeClassName = "underline";
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        {/* <a className="navbar-brand" href="#"> */}
        <Link className="nav-link navbar-brand" to="/">
          EAS Admin
        </Link>
        {/* </a> */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav w-100">
            <li className="nav-item">
              {/* <a className="nav-link" href="#"> */}
              <NavLink
                to="/question"
                className="nav-link"
                style={({ isActive }) => {
                  console.log("active", isActive);
                  return isActive ? activeStyle : inactiveStyle;
                }}
              >
                Questions
              </NavLink>
              {/* <Link className="nav-link" to="/question">
                Questions
              </Link> */}
              {/* </a> */}
            </li>
            <li className="nav-item">
              {/* <a className="nav-link" href="#"> */}
              <NavLink
                to="/createUser"
                className="nav-link"
                style={({ isActive }) => {
                  console.log("active", isActive);
                  return isActive ? activeStyle : inactiveStyle;
                }}
              >
                Create user
              </NavLink>
              {/* <Link className="nav-link" to="/question">
                Questions
              </Link> */}
              {/* </a> */}
            </li>

            <li className="nav-item">
              {/* <a className="nav-link" href="#"> */}
              <NavLink
                to="/createAdmin"
                className="nav-link"
                style={({ isActive }) => {
                  console.log("active", isActive);
                  return isActive ? activeStyle : inactiveStyle;
                }}
              >
                Create Administrator
              </NavLink>
              {/* <Link className="nav-link" to="/question">
                Questions
              </Link> */}
              {/* </a> */}
            </li>
            <li className="nav-item">
              {/* <a className="nav-link" href="#"> */}
              <NavLink
                to="/manageUser"
                className="nav-link"
                style={({ isActive }) => {
                  console.log("active", isActive);
                  return isActive ? activeStyle : inactiveStyle;
                }}
              >
                User management
              </NavLink>
              {/* <Link className="nav-link" to="/question">
                Questions
              </Link> */}
              {/* </a> */}
            </li>
            <li className="nav-item">
              {/* <a className="nav-link" href="#"> */}
              <NavLink
                to="/talent"
                className="nav-link"
                style={({ isActive }) => {
                  console.log("active", isActive);
                  return isActive ? activeStyle : inactiveStyle;
                }}
              >
                Talent
              </NavLink>
              {/* <Link className="nav-link" to="/talent">
                Talent
              </Link> */}
              {/* </a> */}
            </li>
            <li className="nav-item">
              {/* <a className="nav-link" href="#"> */}
              <NavLink
                to="/employer"
                className="nav-link"
                style={({ isActive }) => {
                  console.log("active", isActive);
                  return isActive ? activeStyle : inactiveStyle;
                }}
              >
                Employer
              </NavLink>
              {/* <Link className="nav-link" to="/employer">
                Employer
              </Link> */}
              {/* </a> */}
            </li>
            <li className="nav-item flex-grow-1 d-flex justify-content-end">
              {/* <a className="nav-link" href="#"> */}
              <p className="mx-3 text-dark" style={{ margin: "auto 0" }}>
                {`Welcome  ${props.userName}`}
              </p>
              <button
                type="button"
                className="btn btn-light btn-sm ml-auto"
                style={{ minWidth: "100px" }}
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  window.location.href = "/";
                }}
              >
                Log off
              </button>
              {/* <Link className="nav-link" to="/question">
                Questions
              </Link> */}
              {/* </a> */}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
