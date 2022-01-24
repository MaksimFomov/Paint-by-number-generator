import React, { Component } from "react";
import undo from "../../images/undo.png";

import translate from "../../i18n/translate";

class Palette extends Component {
  constructor() {
    super();
    this.state = {
      colors: [
        "#000000",
        "#343433",
        "#4E4E4D",
        "#676868",
        "#979797",
        "#CECCCC",
        "#FFFFFF",
        "#F7DAAF",
        "#F7ED45",
        "#FBEE34",
        "#FCD55A",
        "#FDD209",
        "#FFCD37",
        "#FDBE16",
        "#F99B29",
        "#F16A2D",
        "#F37122",
        "#EF463C",
        "#F26F68",
        "#EC2724",
        "#931D1A",
        "#A6322E",
        "#B44426",
        "#7D4829",
        "#AD7229",
        "#DB8D77",
        "#E79D5D",
        "#EC9342",
        "#E4B07C",
        "#E08C39",
        "#DDA463",
        "#BA9F53",
        "#9D8223",
        "#BACD3F",
        "#68AF46",
        "#69BD45",
        "#53B948",
        "#169E49",
        "#05753C",
        "#71CCDC",
        "#188FCA",
        "#3CBEB7",
        "#3C75BA",
        "#014159",
        "#4454A4",
        "#5A499E",
        "#583E98",
        "#6A449B",
        "#905FA7",
        "#8D52A1",
        "#C196C5",
        "#DD64A5",
        "#E0398C",
        "#DB778D",
      ],
      chosenColor: "#FFFFFF",
    };
    this.swatchClick = this.swatchClick.bind(this);
    this.undoMove = this.undoMove.bind(this);
  }

  //on click in a colour, changes bg color of colorHolder
  swatchClick(colour) {
    this.setState({ chosenColor: colour });
    this.props.onSelectColor(colour);
  }

  undoMove() {
    this.props.onUndoMove();
  }

  render() {
    return (
      <div className="swatchHolder">
        <ul>
          {this.state.colors.map((colour) => {
            return (
              <li
                key={colour}
                style={{ backgroundColor: colour }}
                onClick={() => this.swatchClick(colour)}
              ></li>
            );
          })}
        </ul>
        <div>
          <img
            className="undo-icon"
            src={undo}
            onClick={this.undoMove}
            alt="Click here to undo the last move"
          />
          <div
            className="colorHolder"
            style={{ backgroundColor: this.state.chosenColor }}
          >
            {translate("currentColor")}
          </div>
        </div>
      </div>
    );
  }
}

export default Palette;
