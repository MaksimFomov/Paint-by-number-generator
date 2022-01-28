import React, { useEffect, useState } from "react";

import { BiMenuAltRight } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";

import classes from "./Header.module.scss";
import { Link, useHistory } from "react-router-dom";

import translate from "../i18n/translate";

import ToggleSwitch from "../components/ToggleSwitch/ToggleSwitch";

const Header = () => {
  const history = useHistory();
  const [menuOpen, setMenuOpen] = useState(false);
  const [size, setSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (size.width > 768 && menuOpen) {
      setMenuOpen(false);
    }
  }, [size.width, menuOpen]);

  const menuToggleHandler = () => {
    setMenuOpen((p) => !p);
  };

  const ctaClickHandler = () => {
    menuToggleHandler();
    history.push("/page-cta");
  };

  return (
    <header className={classes.header}>
      <div className={classes.header__content}>
        <Link to="/" className={classes.header__content__logo}>
        {translate("projectName")}
        </Link>
        <nav
          className={`${classes.header__content__nav} ${
            menuOpen && size.width < 768 ? classes.isMenu : ""
          }`}
        >
          <ul>
            <li>
              <a href="/converter" onClick={menuToggleHandler}>
              {translate("generator")}
              </a>
            </li>
            <li>
              <Link to="/сoloring-a-picture" onClick={menuToggleHandler}>
              {translate("coloringPicture")}
              </Link>
            </li>
            <li>
              <Link to="/page-three" onClick={menuToggleHandler}>
              {translate("shoppingCart")}
              </Link>
            </li>
          </ul>
          <button onClick={ctaClickHandler}>{translate("authorization")}</button>
          <ToggleSwitch label=" "/>
        </nav>
        <div className={classes.header__content__toggle}>
          {!menuOpen ? (
            <BiMenuAltRight onClick={menuToggleHandler} />
          ) : (
            <AiOutlineClose onClick={menuToggleHandler} />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
