import React from "react";
import "../styles/homePage.css";
import translate from "../i18n/translate";

const Info = () => {
  return (
    <div className="container1" style={{ marginLeft: "50px", marginTop: "170px" }}>
      <h5>{translate("info1")}</h5>
      <h5>{translate("info2")}</h5>
      <h5>{translate("info3")}</h5>
      <p>.</p>
      <h5>{translate("info4")}</h5>
      <h5>1) {translate("info5")}</h5>
      <h5>2) {translate("info6")}</h5>
      <h5>3) {translate("info7")}</h5>
      <h5>4) {translate("info8")}</h5>
    </div>
  );
};

export default Info;
