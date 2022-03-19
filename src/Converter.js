import "./styles/lib/materialize.min.css";
import "./styles/main.css";
import { useHistory } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import React from "react";
import translate from "./i18n/translate";
import { useAuth } from "./firebase";
import { getDatabase, ref, push, set } from "firebase/database";
import { Button } from "react-bootstrap";

const tooltip = (idTooltip) => {
  return (
    <ReactTooltip id={idTooltip} place="bottom" type="info" effect="solid">
      <span>{translate(idTooltip + "Info")}</span>
    </ReactTooltip>
  );
};

const Converter = () => {
  const currentUser = useAuth();
  const history = useHistory();

  const [checked, setChecked] = React.useState(true);
  const [checked1, setChecked1] = React.useState(true);
  const [checked2, setChecked2] = React.useState(true);
  const [checked3, setChecked3] = React.useState(true);
  const [checked4, setChecked4] = React.useState(true);
  const [checked5, setChecked5] = React.useState(false);
  const [checked6, setChecked6] = React.useState(false);
  const [checked7, setChecked7] = React.useState(true);
  const [checked8, setChecked8] = React.useState(false);

  async function savePicture() {
    if (currentUser === null) {
      history.push("/authorization");
    } else {
      try {
        const pictureName = prompt("Введите название картинки");

        if (pictureName) {
          const db = getDatabase();
          const pictureListRef = ref(db, "pictures");
          const newPictureRef = push(pictureListRef);

          let blob = await fetch(localStorage.getItem("lastPictureImg")).then(r => r.blob());
          var reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            var base64data = reader.result;

            set(newPictureRef, {
              userUID: currentUser.uid,
              pictureName: pictureName,
              pallete: JSON.parse(localStorage.getItem("lastPictureColors")),
              pictureImage: base64data,
              cleanPicture: true,
              activeSize: 0,
            });
          };

          alert("Картинка сохранена в профиль");
        } else {
          alert("Вы не ввели имя");
        }
      } catch {
        alert("Ошибка при сохранении картинки в профиль");
      }
    }
  }

  return (
    <div className="Converter">
      <div className="container">
        <div className="row">
          <h2> </h2>
          <span>
            {translate("inputFile")}{" "}
            <input
              id="file"
              type="file"
              accept="image/x-png,image/gif,image/jpeg"
            ></input>
            ){translate("inputFile1")}
          </span>
          <br />
          <span>
            {translate("exampleImages")}
            <a id="lnkTrivial" href="/#">
              {translate("trivial")}
            </a>{" "}
            -
            <a id="lnkSmall" href="/#">
              {translate("small")}
            </a>{" "}
            -
            <a id="lnkMedium" href="/#">
              {translate("medium")}
            </a>
          </span>
        </div>
        <div className="row">
          <div className="col s12">
            <ul className="tabs">
              <li className="tab col s2">
                <a href="#input-pane">{translate("input")}</a>
              </li>
              <li className="tab col s2">
                <a href="#options-pane">{translate("options")}</a>
              </li>
            </ul>
          </div>
          <div id="input-pane" className="col s12">
            <canvas id="canvas"></canvas>
            <img
              id="imgTrivial"
              alt="Trivial"
              crossOrigin="anonymous"
              src="https://i.imgur.com/o5CqO57.png"
              style={{ display: "none" }}
            />
            <img
              id="imgSmall"
              alt="Small"
              crossOrigin="anonymous"
              src="https://i.imgur.com/YgYLDGP.png"
              style={{ display: "none" }}
            />

            <img
              id="imgMedium"
              alt="Medium"
              crossOrigin="anonymous"
              src="https://i.imgur.com/nLeNgYbr.jpg"
              style={{ display: "none" }}
            />
          </div>

          <div id="options-pane" className="col s12">
            <ul className="collection">
              <li className="collection-item">
                <div className="row">
                  <div className="col s3" style={{ marginTop: "34px" }}>
                    <label>
                      <input
                        id="chkResizeImage"
                        type="checkbox"
                        checked={checked3}
                        onChange={() => setChecked3(!checked3)}
                      />
                      <span data-tip data-for="resizeImage">
                        {translate("resizeImage")}
                        {tooltip("resizeImage")}
                      </span>
                    </label>
                  </div>
                  <div className="col s2">
                    <label htmlFor="txtResizeWidth">{translate("width")}</label>
                    <input
                      id="txtResizeWidth"
                      type="number"
                      defaultValue="1024"
                      min="1"
                      className="validate"
                    />
                  </div>
                  <div className="col s2">
                    <label htmlFor="txtResizeHeight">
                      {translate("height")}
                    </label>
                    <input
                      id="txtResizeHeight"
                      type="number"
                      defaultValue="1024"
                      min="1"
                      className="validate"
                    />
                  </div>
                </div>
              </li>
              <li className="collection-item">
                <div className="row">
                  <div className="input-field col s2">
                    <input
                      id="txtNrOfClusters"
                      type="number"
                      defaultValue="16"
                      min="1"
                      className="validate"
                    />
                    <label
                      htmlFor="txtClusterPrecision"
                      data-tip
                      data-for="numberOfColors"
                    >
                      {translate("numberOfColors")}
                      {tooltip("numberOfColors")}
                    </label>
                  </div>

                  <div className="input-field col s2">
                    <input
                      id="txtClusterPrecision"
                      type="number"
                      defaultValue="1"
                      min="1"
                      step="0.05"
                      className="validate"
                    />
                    <label
                      htmlFor="txtClusterPrecision"
                      data-tip
                      data-for="clusterPrecision"
                    >
                      {translate("clusterPrecision")}
                      {tooltip("clusterPrecision")}
                    </label>
                  </div>

                  <div className="input-field col s2">
                    <input
                      id="txtRandomSeed"
                      type="number"
                      defaultValue="0"
                      min="0"
                      step="1"
                      className="validate"
                    />
                    <label
                      htmlFor="txtRandomSeed"
                      data-tip
                      data-for="randomSeed"
                    >
                      {translate("randomSeed")}
                      {tooltip("randomSeed")}
                    </label>
                  </div>
                </div>
              </li>
              <li className="collection-item">
                <div className="row">
                  <div className="col s3">
                    <label data-tip data-for="clusteringColorSpace">
                      {translate("clusteringColorSpace")}
                      {tooltip("clusteringColorSpace")}
                    </label>
                  </div>
                  <div className="col s2">
                    <label>
                      <input
                        id="optColorSpaceRGB"
                        name="colorspace"
                        type="radio"
                        checked={checked4}
                        onChange={() => setChecked4(!checked4)}
                      />
                      <span>RGB</span>
                    </label>
                  </div>
                  <div className="col s2">
                    <label>
                      <input
                        id="optColorSpaceHSL"
                        name="colorspace"
                        type="radio"
                        checked={checked5}
                        onChange={() => setChecked5(!checked5)}
                      />
                      <span>HSL</span>
                    </label>
                  </div>
                  <div className="col s2">
                    <label>
                      <input
                        id="optColorSpaceLAB"
                        name="colorspace"
                        type="radio"
                        checked={checked6}
                        onChange={() => setChecked6(!checked6)}
                      />
                      <span>Lab</span>
                    </label>
                  </div>

                  <div className="col s12">
                    <label
                      htmlFor="txtKMeansColorRestrictions"
                      data-tip
                      data-for="restrictClusteringColors"
                    >
                      {translate("restrictClusteringColors")}
                      <ReactTooltip
                        id="restrictClusteringColors"
                        place="right"
                        type="info"
                        effect="solid"
                      >
                        <span>{translate("restrictClusteringColorsInfo")}</span>
                      </ReactTooltip>
                    </label>
                    <textarea
                      id="txtKMeansColorRestrictions"
                      className="materialize-textarea validate"
                      defaultValue="/0,0,0 /255,255,255"
                    ></textarea>
                  </div>
                </div>
              </li>
              <li className="collection-item">
                <div className="row">
                  <div className="input-field col s4">
                    <input
                      id="txtNarrowPixelStripCleanupRuns"
                      type="number"
                      defaultValue="3"
                      min="0"
                      className="validate"
                    />
                    <label
                      htmlFor="txtNarrowPixelStripCleanupRuns"
                      data-tip
                      data-for="numberOfRuns"
                    >
                      {translate("numberOfRuns")}
                      {tooltip("numberOfRuns")}
                    </label>
                  </div>
                  <div className="input-field col s4">
                    <input
                      id="txtRemoveFacetsSmallerThan"
                      type="number"
                      defaultValue="20"
                      min="1"
                      className="validate"
                    />
                    <label
                      htmlFor="txtRemoveFacetsSmallerThan"
                      data-tip
                      data-for="removeSmallFacets"
                    >
                      {translate("removeSmallFacets")}
                      {tooltip("removeSmallFacets")}
                    </label>
                  </div>
                  <div className="input-field col s4">
                    <input
                      id="txtMaximumNumberOfFacets"
                      type="number"
                      defaultValue="100000"
                      min="1"
                      className="validate"
                    />
                    <label
                      htmlFor="txtMaximumNumberOfFacets"
                      data-tip
                      data-for="maximumNumberOfFacets"
                    >
                      {translate("maximumNumberOfFacets")}
                      {tooltip("maximumNumberOfFacets")}
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s6">
                    <div className="row">
                      <div className="col s4">
                        <label data-tip data-for="smallFacetRemovalOrder">
                          {translate("smallFacetRemovalOrder")}
                          {tooltip("smallFacetRemovalOrder")}
                        </label>
                      </div>
                      <div className="col s4">
                        <label>
                          <input
                            id="optFacetRemovalLargestToSmallest"
                            name="smallfacetremovalorder"
                            type="radio"
                            checked={checked7}
                            onChange={() => setChecked7(!checked7)}
                          />
                          <span>{translate("largestToSmallest")}</span>
                        </label>
                      </div>
                      <div className="col s4">
                        <label>
                          <input
                            id="optFacetRemovalSmallestToLargest"
                            name="smallfacetremovalorder"
                            type="radio"
                            checked={checked8}
                            onChange={() => setChecked8(!checked8)}
                          />
                          <span>{translate("smallestToLargest")}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="collection-item">
                <div className="row">
                  <div className="input-field col s5">
                    <input
                      id="txtNrOfTimesToHalveBorderSegments"
                      type="number"
                      defaultValue="2"
                      min="0"
                      className="validate"
                    />
                    <label
                      htmlFor="txtNrOfTimesToHalveBorderSegments"
                      data-tip
                      data-for="amountOfTimes"
                    >
                      {translate("amountOfTimes")}
                      <ReactTooltip
                        id="amountOfTimes"
                        place="top"
                        type="info"
                        effect="solid"
                      >
                        <span>{translate("amountOfTimesInfo")}</span>
                      </ReactTooltip>
                    </label>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="col s12">
            <label className="waves-effect waves-light btn" id="btnProcess">
              {translate("processImage")}
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col s2">
            <div className="status kMeans">
              {translate("kMeansClustering")}
              <div className="progress">
                <div
                  id="statusKMeans"
                  className="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col s2">
            <div className="status facetBuilding">
              {translate("facetBuilding")}
              <div className="progress">
                <div
                  id="statusFacetBuilding"
                  className="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col s2">
            <div className="status facetReduction">
              {translate("smallFacetPruning")}
              <div className="progress">
                <div
                  id="statusFacetReduction"
                  className="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col s2">
            <div className="status facetBorderPath">
              {translate("borderDetection")}
              <div className="progress">
                <div
                  id="statusFacetBorderPath"
                  className="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col s2">
            <div className="status facetBorderSegmentation">
              {translate("borderSegmentation")}
              <div className="progress">
                <div
                  id="statusFacetBorderSegmentation"
                  className="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div className="col s2">
            <div className="status facetLabelPlacement">
              {translate("labelPlacement")}
              <div className="progress">
                <div
                  id="statusFacetLabelPlacement"
                  className="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col s2">
            <div className="status SVGGenerate">
              {translate("SVGGeneration")}
              <div className="progress">
                <div
                  id="statusSVGGenerate"
                  className="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col s12">
            <ul id="tabsOutput" className="tabs">
              <li className="tab col s2">
                <a href="#kmeans-pane">{translate("quantizedImage")}e</a>
              </li>
              <li className="tab col s2">
                <a href="#reduction-pane">{translate("facetReduction")}</a>
              </li>
              <li className="tab col s2">
                <a href="#borderpath-pane">{translate("borderTracing")}</a>
              </li>
              <li className="tab col s2">
                <a href="#bordersegmentation-pane">
                  {translate("borderSegmentation")}
                </a>
              </li>
              <li className="tab col s2">
                <a href="#labelplacement-pane">{translate("labelPlacement")}</a>
              </li>
              <li className="tab col s2">
                <a href="#output-pane">{translate("output")}</a>
              </li>
              <li className="tab col s2">
                <a href="#log-pane">{translate("log")}</a>
              </li>
            </ul>
          </div>
          <div id="kmeans-pane" className="col s12">
            <canvas id="cKMeans"></canvas>
          </div>
          <div id="reduction-pane" className="col s12">
            <canvas id="cReduction"></canvas>
          </div>
          <div id="borderpath-pane" className="col s12">
            <canvas id="cBorderPath"></canvas>
          </div>
          <div id="bordersegmentation-pane" className="col s12">
            <canvas id="cBorderSegmentation"></canvas>
          </div>
          <div id="labelplacement-pane" className="col s12">
            <canvas id="cLabelPlacement"></canvas>
          </div>

          <div id="output-pane" className="col s12">
            <div className="row">
              <div className="col s2">
                <label>{translate("SVGRenderOptions")}</label>
              </div>
              <div className="col s2">
                <label>
                  <input
                    id="chkShowLabels"
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                  />
                  <span>{translate("showLabels")}</span>
                </label>
              </div>
              <div className="col s2">
                <label>
                  <input
                    id="chkFillFacets"
                    type="checkbox"
                    checked={!checked1}
                    onChange={() => setChecked1(!checked1)}
                  />
                  <span>{translate("fillFacets")}</span>
                </label>
              </div>
              <div className="col s2">
                <label>
                  <input
                    id="chkShowBorders"
                    type="checkbox"
                    checked={checked2}
                    onChange={() => setChecked2(!checked2)}
                  />
                  <span>{translate("showBorders")}</span>
                </label>
              </div>
            </div>
            <div className="row">
              <div className="col s3">
                <div className="input-field">
                  <input
                    placeholder="SVG Size multiplier"
                    id="txtSizeMultiplier"
                    type="number"
                    defaultValue="1"
                    min="1"
                    className="validate"
                  />
                  <label
                    htmlFor="txtSizeMultiplier"
                    data-tip
                    data-for="SVGSizeMultiplier"
                  >
                    {translate("SVGSizeMultiplier")}
                    {tooltip("SVGSizeMultiplier")}
                  </label>
                </div>
              </div>
              <div className="col s3">
                <div className="input-field">
                  <input
                    placeholder="Label font size"
                    id="txtLabelFontSize"
                    type="number"
                    defaultValue="50"
                    min="1"
                    max="100"
                  />
                  <label
                    htmlFor="txtLabelFontSize"
                    data-tip
                    data-for="labelFontSize"
                  >
                    {translate("labelFontSize")}
                    {tooltip("labelFontSize")}
                  </label>
                </div>
              </div>
              <div className="col s3">
                <div className="input-field">
                  <input
                    placeholder="Label font size"
                    id="txtLabelFontColor"
                    type="text"
                    defaultValue="#000"
                  />
                  <label
                    htmlFor="txtLabelFontColor"
                    data-tip
                    data-for="labelFontColor"
                  >
                    {translate("labelFontColor")}
                    {tooltip("labelFontColor")}
                  </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div id="palette" className="palette"></div>
            </div>
            <div className="row">
              <div className="col s12">
                <div id="svgContainer"></div>
              </div>
            </div>

            <div className="row">
              <div className="col s3">
                <label
                  className="waves-effect waves-light btn"
                  id="btnDownloadSVG"
                >
                  {translate("downloadSVG")}
                </label>
              </div>
              <div className="col s3">
                <label
                  className="waves-effect waves-light btn"
                  id="btnDownloadPNG"
                >
                  {translate("downloadPNG")}
                </label>
              </div>
              <div className="col s3">
                <label
                  className="waves-effect waves-light btn"
                  id="btnDownloadPalettePNG"
                >
                  {translate("downloadPalette")}
                </label>
              </div>
            </div>
            <div className="row"></div>
            <div className="row">
              <div className="col s3"></div>
              <div className="col s3">
                <Button onClick={savePicture}>{translate("saveInProfile")}</Button>
              </div>
            </div>
          </div>

          <div id="log-pane" className="col s12">
            <div className="row">
              <div className="col s12">
                <div id="log"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Converter;
