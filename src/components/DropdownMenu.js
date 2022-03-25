/* eslint-disable jsx-a11y/anchor-is-valid */
import "../styles/dropdownMenu.css";

import React, { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { Link } from "react-router-dom";

import { useAuth, logout } from "../firebase";
import translate from "../i18n/translate";

function DropdownMenu() {
  const currentUser = useAuth();

  const [activeMenu, setActiveMenu] = useState("main");
  const dropdownRef = useRef(null);

  function DropdownItem(props) {
    return (
      <a
        className="menu-item"
        onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}
      >
        <span className="icon-button">{props.leftIcon}</span>
        {props.children}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  // eslint-disable-next-line no-unused-vars
  const [menuOpen, setMenuOpen] = useState(false);

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };

  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    try {
      await logout();
    } catch {
      alert(localStorage.getItem("language") === "ru-ru" ? "Ошибка" : "Error");
    }
    setLoading(false);
  }

  return (
    <div className="dropdown" ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === "main"}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
      >
        <div className="menu">
          {currentUser != null ? (
            <DropdownItem>
              <Link to="/profile" onClick={menuToggleHandler}>
                {currentUser.email}
              </Link>
            </DropdownItem>
          ) : null}
          {currentUser != null ? (
            <DropdownItem>
              <Link to="/my-image" onClick={menuToggleHandler}>
                {translate("myPictures")}
              </Link>
            </DropdownItem>
          ) : null}
          {currentUser != null ? (
            <DropdownItem>
              <Link to="/my-orders" onClick={menuToggleHandler}>
                {translate("myOrders")}
              </Link>
            </DropdownItem>
          ) : null}
          {currentUser == null ? (
            <DropdownItem>
              <Link to="/authorization" onClick={menuToggleHandler}>
                {translate("authorization")}
              </Link>
            </DropdownItem>
          ) : null}
          {currentUser == null ? (
            <DropdownItem>
              <Link to="/registration" onClick={menuToggleHandler}>
                {translate("registration")}
              </Link>
            </DropdownItem>
          ) : null}
          <DropdownItem>
            <Link to="/info" onClick={menuToggleHandler}>
              {translate("helpAboutTheProgram")}
            </Link>
          </DropdownItem>
          {currentUser != null ? (
            <DropdownItem>
              <Link onClick={handleLogout}>{translate("exit")}</Link>
            </DropdownItem>
          ) : null}
        </div>
      </CSSTransition>
    </div>
  );
}

export default DropdownMenu;
