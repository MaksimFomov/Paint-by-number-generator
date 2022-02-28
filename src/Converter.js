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
    if (currentUser == null) {
      history.push("/authorization");
    } else {
      try {
        const pictureName = prompt("Введите название картинки");

        if(pictureName){
          const db = getDatabase();
          const pictureListRef = ref(db, 'pictures');
          const newPictureRef = push(pictureListRef);
    
          set(newPictureRef, {
            userUID: currentUser.uid,
            pictureName: pictureName,
            pallete: JSON.parse(localStorage.getItem("lastPictureColors")),
            pictureImage: localStorage.getItem("lastPictureImgFirebase"),
          });
  
          alert("Картинка сохранена в профиль");
        }
        else {
          alert("Вы не ввели имя");
        }
      }
      catch {
        alert("Ошибка при сохранении картинки в профиль");
      }
    }
  }

  return (
    <div className="Converter">
      <div class="container">
        <div class="row">
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
        <div class="row">
          <div class="col s12">
            <ul class="tabs">
              <li class="tab col s2">
                <a href="#input-pane">{translate("input")}</a>
              </li>
              <li class="tab col s2">
                <a href="#options-pane">{translate("options")}</a>
              </li>
            </ul>
          </div>
          <div id="input-pane" class="col s12">
            <canvas id="canvas"></canvas>
            <img
              id="imgTrivial"
              alt="Trivial"
              crossorigin="anonymous"
              src="https://i.imgur.com/o5CqO57.png"
              style={{ display: "none" }}
            />
            <img
              id="imgSmall"
              alt="Small"
              crossorigin="anonymous"
              src="https://i.imgur.com/YgYLDGP.png"
              style={{ display: "none" }}
            />

            <img
              id="imgMedium"
              alt="Medium"
              crossorigin="anonymous"
              src="https://i.imgur.com/nLeNgYbr.jpg"
              style={{ display: "none" }}
            />
          </div>

          <div id="options-pane" class="col s12">
            <ul class="collection">
              <li class="collection-item">
                <div class="row">
                  <div class="col s3" style={{ marginTop: "34px" }}>
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
                  <div class="col s2">
                    <label for="txtResizeWidth">{translate("width")}</label>
                    <input
                      id="txtResizeWidth"
                      type="number"
                      defaultValue="1024"
                      min="1"
                      class="validate"
                    />
                  </div>
                  <div class="col s2">
                    <label for="txtResizeHeight">{translate("height")}</label>
                    <input
                      id="txtResizeHeight"
                      type="number"
                      defaultValue="1024"
                      min="1"
                      class="validate"
                    />
                  </div>
                </div>
              </li>
              <li class="collection-item">
                <div class="row">
                  <div class="input-field col s2">
                    <input
                      id="txtNrOfClusters"
                      type="number"
                      defaultValue="16"
                      min="1"
                      class="validate"
                    />
                    <label
                      for="txtClusterPrecision"
                      data-tip
                      data-for="numberOfColors"
                    >
                      {translate("numberOfColors")}
                      {tooltip("numberOfColors")}
                    </label>
                  </div>

                  <div class="input-field col s2">
                    <input
                      id="txtClusterPrecision"
                      type="number"
                      defaultValue="1"
                      min="1"
                      step="0.05"
                      class="validate"
                    />
                    <label
                      for="txtClusterPrecision"
                      data-tip
                      data-for="clusterPrecision"
                    >
                      {translate("clusterPrecision")}
                      {tooltip("clusterPrecision")}
                    </label>
                  </div>

                  <div class="input-field col s2">
                    <input
                      id="txtRandomSeed"
                      type="number"
                      defaultValue="0"
                      min="0"
                      step="1"
                      class="validate"
                    />
                    <label for="txtRandomSeed" data-tip data-for="randomSeed">
                      {translate("randomSeed")}
                      {tooltip("randomSeed")}
                    </label>
                  </div>
                </div>
              </li>
              <li class="collection-item">
                <div class="row">
                  <div class="col s3">
                    <label data-tip data-for="clusteringColorSpace">
                      {translate("clusteringColorSpace")}
                      {tooltip("clusteringColorSpace")}
                    </label>
                  </div>
                  <div class="col s2">
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
                  <div class="col s2">
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
                  <div class="col s2">
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

                  <div class="col s12">
                    <label
                      for="txtKMeansColorRestrictions"
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
                      class="materialize-textarea validate"
                    >
                      /0,0,0 /255,255,255
                    </textarea>
                  </div>
                </div>
              </li>
              <li class="collection-item">
                <div class="row">
                  <div class="input-field col s4">
                    <input
                      id="txtNarrowPixelStripCleanupRuns"
                      type="number"
                      defaultValue="3"
                      min="0"
                      class="validate"
                    />
                    <label
                      for="txtNarrowPixelStripCleanupRuns"
                      data-tip
                      data-for="numberOfRuns"
                    >
                      {translate("numberOfRuns")}
                      {tooltip("numberOfRuns")}
                    </label>
                  </div>
                  <div class="input-field col s4">
                    <input
                      id="txtRemoveFacetsSmallerThan"
                      type="number"
                      defaultValue="20"
                      min="1"
                      class="validate"
                    />
                    <label
                      for="txtRemoveFacetsSmallerThan"
                      data-tip
                      data-for="removeSmallFacets"
                    >
                      {translate("removeSmallFacets")}
                      {tooltip("removeSmallFacets")}
                    </label>
                  </div>
                  <div class="input-field col s4">
                    <input
                      id="txtMaximumNumberOfFacets"
                      type="number"
                      defaultValue="100000"
                      min="1"
                      class="validate"
                    />
                    <label
                      for="txtMaximumNumberOfFacets"
                      data-tip
                      data-for="maximumNumberOfFacets"
                    >
                      {translate("maximumNumberOfFacets")}
                      {tooltip("maximumNumberOfFacets")}
                    </label>
                  </div>
                </div>
                <div class="row">
                  <div class="input-field col s6">
                    <div class="row">
                      <div class="col s4">
                        <label data-tip data-for="smallFacetRemovalOrder">
                          {translate("smallFacetRemovalOrder")}
                          {tooltip("smallFacetRemovalOrder")}
                        </label>
                      </div>
                      <div class="col s4">
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
                      <div class="col s4">
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
              <li class="collection-item">
                <div class="row">
                  <div class="input-field col s5">
                    <input
                      id="txtNrOfTimesToHalveBorderSegments"
                      type="number"
                      defaultValue="2"
                      min="0"
                      class="validate"
                    />
                    <label
                      for="txtNrOfTimesToHalveBorderSegments"
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

          <div class="col s12">
            <a1 class="waves-effect waves-light btn" id="btnProcess">
              {translate("processImage")}
            </a1>
          </div>
        </div>

        <div class="row">
          <div class="col s2">
            <div class="status kMeans">
              {translate("kMeansClustering")}
              <div class="progress">
                <div
                  id="statusKMeans"
                  class="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div class="col s2">
            <div class="status facetBuilding">
              {translate("facetBuilding")}
              <div class="progress">
                <div
                  id="statusFacetBuilding"
                  class="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div class="col s2">
            <div class="status facetReduction">
              {translate("smallFacetPruning")}
              <div class="progress">
                <div
                  id="statusFacetReduction"
                  class="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div class="col s2">
            <div class="status facetBorderPath">
              {translate("borderDetection")}
              <div class="progress">
                <div
                  id="statusFacetBorderPath"
                  class="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div class="col s2">
            <div class="status facetBorderSegmentation">
              {translate("borderSegmentation")}
              <div class="progress">
                <div
                  id="statusFacetBorderSegmentation"
                  class="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
          <div class="col s2">
            <div class="status facetLabelPlacement">
              {translate("labelPlacement")}
              <div class="progress">
                <div
                  id="statusFacetLabelPlacement"
                  class="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col s2">
            <div class="status SVGGenerate">
              {translate("SVGGeneration")}
              <div class="progress">
                <div
                  id="statusSVGGenerate"
                  class="determinate"
                  style={{ width: "0%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col s12">
            <ul id="tabsOutput" class="tabs">
              <li class="tab col s2">
                <a href="#kmeans-pane">{translate("quantizedImage")}e</a>
              </li>
              <li class="tab col s2">
                <a href="#reduction-pane">{translate("facetReduction")}</a>
              </li>
              <li class="tab col s2">
                <a href="#borderpath-pane">{translate("borderTracing")}</a>
              </li>
              <li class="tab col s2">
                <a href="#bordersegmentation-pane">
                  {translate("borderSegmentation")}
                </a>
              </li>
              <li class="tab col s2">
                <a href="#labelplacement-pane">{translate("labelPlacement")}</a>
              </li>
              <li class="tab col s2">
                <a href="#output-pane">{translate("output")}</a>
              </li>
              <li class="tab col s2">
                <a href="#log-pane">{translate("log")}</a>
              </li>
            </ul>
          </div>
          <div id="kmeans-pane" class="col s12">
            <canvas id="cKMeans"></canvas>
          </div>
          <div id="reduction-pane" class="col s12">
            <canvas id="cReduction"></canvas>
          </div>
          <div id="borderpath-pane" class="col s12">
            <canvas id="cBorderPath"></canvas>
          </div>
          <div id="bordersegmentation-pane" class="col s12">
            <canvas id="cBorderSegmentation"></canvas>
          </div>
          <div id="labelplacement-pane" class="col s12">
            <canvas id="cLabelPlacement"></canvas>
          </div>

          <div id="output-pane" class="col s12">
            <div class="row">
              <div class="col s2">
                <label>{translate("SVGRenderOptions")}</label>
              </div>
              <div class="col s2">
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
              <div class="col s2">
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
              <div class="col s2">
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
            <div class="row">
              <div class="col s3">
                <div class="input-field">
                  <input
                    placeholder="SVG Size multiplier"
                    id="txtSizeMultiplier"
                    type="number"
                    defaultValue="1"
                    min="1"
                    class="validate"
                  />
                  <label
                    for="txtSizeMultiplier"
                    data-tip
                    data-for="SVGSizeMultiplier"
                  >
                    {translate("SVGSizeMultiplier")}
                    {tooltip("SVGSizeMultiplier")}
                  </label>
                </div>
              </div>
              <div class="col s3">
                <div class="input-field">
                  <input
                    placeholder="Label font size"
                    id="txtLabelFontSize"
                    type="number"
                    defaultValue="50"
                    min="1"
                    max="100"
                  />
                  <label
                    for="txtLabelFontSize"
                    data-tip
                    data-for="labelFontSize"
                  >
                    {translate("labelFontSize")}
                    {tooltip("labelFontSize")}
                  </label>
                </div>
              </div>
              <div class="col s3">
                <div class="input-field">
                  <input
                    placeholder="Label font size"
                    id="txtLabelFontColor"
                    type="text"
                    defaultValue="#000"
                  />
                  <label
                    for="txtLabelFontColor"
                    data-tip
                    data-for="labelFontColor"
                  >
                    {translate("labelFontColor")}
                    {tooltip("labelFontColor")}
                  </label>
                </div>
              </div>
            </div>
            <div class="row">
              <div id="palette" class="palette"></div>
            </div>
            <div class="row">
              <div class="col s12">
                <div id="svgContainer"></div>
              </div>
            </div>

            <div class="row">
              <div class="col s3">
                <a1 class="waves-effect waves-light btn" id="btnDownloadSVG">
                  {translate("downloadSVG")}
                </a1>
              </div>
              <div class="col s3">
                <a1 class="waves-effect waves-light btn" id="btnDownloadPNG">
                  {translate("downloadPNG")}
                </a1>
              </div>
              <div class="col s3">
                <a1
                  class="waves-effect waves-light btn"
                  id="btnDownloadPalettePNG"
                >
                  {translate("downloadPalette")}
                </a1>
              </div>
            </div>
            <div class="row"></div>
            <div class="row">
            <div class="col s3"></div>
              <div class="col s3">
                <Button onClick={savePicture}>
                  Сохранить в профиль
                </Button>
              </div>
            </div>
          </div>

          <div id="log-pane" class="col s12">
            <div class="row">
              <div class="col s12">
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
