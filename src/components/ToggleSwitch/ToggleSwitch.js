import React from "react";
import { useSelector } from "react-redux";
import { LOCALES } from "../../i18n";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../reducers/languageReducer";
import "./ToggleSwitch.css";

const ToggleSwitch = ({ label }) => {
  var language =
    useSelector((state) => state.repos.language) === LOCALES.ENGLISH
      ? false
      : true;
	  
  const [checked, setChecked] = React.useState(language);

  const dispatch = useDispatch();

  const setLanguages = () => {
    setChecked(!checked);

    if (checked) {
      dispatch(setLanguage(LOCALES.ENGLISH));
      localStorage.setItem("language", LOCALES.ENGLISH);
    } else {
      dispatch(setLanguage(LOCALES.RUSSIAN));
      localStorage.setItem("language", LOCALES.RUSSIAN);
    }
  };

  return (
    <div className="container1">
      {label}{" "}
      <div className="toggle-switch">
        <input
          type="checkbox"
          className="checkbox"
          name={label}
          id={label}
          checked={checked}
          onChange={setLanguages}
        />
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;
