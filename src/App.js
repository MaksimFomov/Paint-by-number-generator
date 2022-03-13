import React from "react";
import Layout from "./components/Layout";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Converter from "./Converter";
import ColoringPicture from "./components/ColoringPicture";
import { I18nProvider } from "./i18n";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLanguage } from "./reducers/languageReducer";
import { LOCALES } from "./i18n";
import Authorization from "./pages/Authentication/Authorization";
import Registration from "./pages/Authentication/Registration";
import Myimage from "./components/MyImage";
import Cart from "./pages/Cart";
import MyProfile from "./components/MyProfile";
import ReestablishPassword from "./components/ReestablishPassword";

function App() {
  const dispatch = useDispatch();

  if (localStorage.getItem("language") === null) {
    dispatch(setLanguage(LOCALES.RUSSIAN));
    localStorage.setItem("language", LOCALES.RUSSIAN);
  }

  dispatch(setLanguage(localStorage.getItem("language")));
  const language = useSelector((state) => state.repos.language);

  return (
    <I18nProvider locale={language}>
      <Layout>
        <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/converter">
            <Converter />
          </Route>
          <Route path="/сoloring-a-picture">
            <ColoringPicture />
          </Route>
          <Route path="/shopping-cart">
            <Cart />
          </Route>
          <Route path="/authorization">
            <Authorization />
          </Route>
          <Route path="/registration">
            <Registration />
          </Route>
          <Route path="/profile">
            <MyProfile/>
          </Route>
          <Route path="/my-image">
            <Myimage />
          </Route>
          <Route path="/reset-password">
            <ReestablishPassword />
          </Route>
          <Route path="/info">
         
          </Route>
        </Switch>
      </Layout>
    </I18nProvider>
  );
}

export default App;
