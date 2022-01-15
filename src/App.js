import Layout from "./components/Layout";
import { Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import PageThree from "./pages/PageThree";
import PageCTA from "./pages/PageCTA";
import Converter from "./Converter";
import ColoringPicture from "./components/ColoringPicture";


function App() {
  return (
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
        <Route path="/page-cta">
          <PageCTA />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
