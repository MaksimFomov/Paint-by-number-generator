import React, { Component } from "react";
import undo from "../../images/undo.png";

import translate from "../../i18n/translate";

class Palette extends Component {
  constructor() {
    super();
    this.state = {
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
          {this.props.onPallete.map((colour, index) => {
            return (
              <li
                key={colour}
                style={{ backgroundColor: colour }}
                onClick={() => this.swatchClick(colour)}
              >{index}</li>
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
