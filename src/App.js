import React from "react";
import Layout from "./components/Layout";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageThree from "./pages/PageThree";
import Converter from "./Converter";
import ColoringPicture from "./components/ColoringPicture";
import { I18nProvider } from "./i18n";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setLanguage } from "./reducers/languageReducer";
import { LOCALES } from "./i18n";
import Authorization from "./pages/Authentication/Authorization";
import Registration from "./pages/Authentication/Registration";

function App() {
  const dispatch = useDispatch();

  if (localStorage.getItem('language') === null) {
    dispatch(setLanguage(LOCALES.RUSSIAN));
    localStorage.setItem("language", LOCALES.RUSSIAN);
  }

  dispatch(setLanguage(localStorage.getItem('language')));
  const language = useSelector(state => state.repos.language);

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
          <Route path="/page-three">
            <PageThree />
          </Route>
          <Route path="/authorization">
            <Authorization />
          </Route>
          <Route path="/registration">
            <Registration />
          </Route>
        </Switch>
      </Layout>
    </I18nProvider>
  );
}

export default App;
