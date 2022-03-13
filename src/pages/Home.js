import React from "react";
import "../styles/homePage.css";
import translate from "../i18n/translate";

const Home = () => {
  return (
    <div className="container1">
      <br />
      <br />
      <div class="site-hero">
        <div class="big-title uppercase montserrat-text">
          {translate("projectName")}
        </div>
        <h5>{translate("desctiptionProject")}</h5>
        <br/>
        <img src="https://i.ibb.co/ZzHYGkd/image.png" alt=""></img>
      </div>
    </div>
  );
};

export default Home;
