import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

var possibleCombinationSum = function(arr, n) {
  if (arr.indexOf(n) >= 0) {
    return true;
  }
  if (arr[0] > n) {
    return false;
  }
  if (arr[arr.length - 1] > n) {
    arr.pop();
    return possibleCombinationSum(arr, n);
  }
  var listSize = arr.length,
    combinationsCount = 1 << listSize;
  for (var i = 1; i < combinationsCount; i++) {
    var combinationSum = 0;
    for (var j = 0; j < listSize; j++) {
      if (i & (1 << j)) {
        combinationSum += arr[j];
      }
    }
    if (n === combinationSum) {
      return true;
    }
  }
  return false;
};

const Stars = props => {
  let stars = [];
  for (let i = 0; i < props.randomNumberOfStars; i++) {
    stars.push(<i key={i} className="fa fa-star" />);
  }

  return <div className="col-5">{stars}</div>;
};

const Button = props => {
  let button;

  if (props.answerIsCorrect === true) {
    button = (
      <button className="btn btn-success" onClick={props.acceptAnswer}>
        <i className="fa fa-check" />
      </button>
    );
  } else if (props.answerIsCorrect === false) {
    button = (
      <button className="btn btn-danger">
        <i className="fa fa-times" />
      </button>
    );
  } else {
    button = (
      <button
        className="btn btn-info"
        onClick={props.checkAnswer}
        disabled={props.selectedNumbers.length === 0}
      >
        =
      </button>
    );
  }
  return (
    <div className="col-2 text-center">
      {button}
      <br />
      <br />
      <button
        className="btn btn-warning btn-sm"
        onClick={props.redraw}
        disabled={props.redraws === 0}
      >
        <i className="fa fa-sync" /> {props.redraws}
      </button>
    </div>
  );
};

const Answer = props => {
  return (
    <div className="col-5">
      {props.selectedNumbers.map((n, i) => (
        <span key={i} onClick={() => props.unselectNumber(n)}>
          {n}
        </span>
      ))}
    </div>
  );
};
const Done = props => {
  return (
    <div className="text-center">
      <h2>{props.doneStatus}</h2>
      <button className="btn btn-secondary" onClick={props.resetGame}>
        Play Again!
      </button>
    </div>
  );
};

const Numbers = props => {
  const numberClassName = number => {
    if (props.usedNumbers.indexOf(number) >= 0) {
      return "used";
    }
    if (props.selectedNumbers.indexOf(number) >= 0) {
      return "selected";
    }
  };
  return (
    <div className=" text-center">
      <div>
        {Numbers.list.map((number, i) => (
          <span
            key={i}
            className={numberClassName(number)}
            onClick={() => props.selectNumber(number)}
          >
            {number}
          </span>
        ))}
      </div>
    </div>
  );
};

Numbers.list = [1, 2, 3, 4, 5, 6, 7, 8, 9]; //to make it accessible to other components too

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedNumbers: [],
      randomNumberOfStars: 1 + Math.floor(Math.random() * 9),
      answerIsCorrect: null,
      usedNumbers: [],
      redraws: 5,
      doneStatus: null
    };
  }

  selectNumber = clickedNumber => {
    if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {
      return;
    }
    if (this.state.usedNumbers.indexOf(clickedNumber) >= 0) {
      return;
    }
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.concat(clickedNumber),
      answerIsCorrect: null
    }));
  };
  unselectNumber = clickedNumber => {
    this.setState(prevState => ({
      selectedNumbers: prevState.selectedNumbers.filter(
        number => number !== clickedNumber
      ),
      answerIsCorrect: null
    }));
  };
  checkAnswer = () => {
    this.setState(prevState => ({
      answerIsCorrect:
        prevState.randomNumberOfStars ===
        prevState.selectedNumbers.reduce((acc, n) => acc + n, 0)
    }));
  };
  acceptAnswer = () => {
    this.setState(
      prevState => ({
        usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
        selectedNumbers: [],
        answerIsCorrect: null,
        randomNumberOfStars: 1 + Math.floor(Math.random() * 9)
      }),
      this.updateDoneStatus
    );
  };
  redraw = () => {
    if (this.state.redraws === 0) {
      return;
    }
    this.setState(
      prevState => ({
        selectedNumbers: [],
        answerIsCorrect: null,
        randomNumberOfStars: 1 + Math.floor(Math.random() * 9),
        redraws: prevState.redraws - 1
      }),
      this.updateDoneStatus
    );
  };

  possibleSolutions = ({ randomNumberOfStars, usedNumbers }) => {
    const possibleNumbers = Numbers.list.filter(
      number => usedNumbers.indexOf(number) === -1
    );

    return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
  };

  updateDoneStatus = () => {
    this.setState(prevState => {
      if (prevState.usedNumbers.length === 9) {
        return { doneStatus: "Well Played! You win!" };
      }
      if (prevState.redraws === 0 && !this.possibleSolutions(prevState)) {
        return { doneStatus: "Game Over! You lose!" };
      }
    });
  };

  resetGame = () => {
    this.setState({
      selectedNumbers: [],
      randomNumberOfStars: 1 + Math.floor(Math.random() * 9),
      answerIsCorrect: null,
      usedNumbers: [],
      redraws: 5,
      doneStatus: null
    });
  };

  render() {
    const {
      selectedNumbers,
      randomNumberOfStars,
      answerIsCorrect,
      usedNumbers,
      redraws,
      doneStatus
    } = this.state;
    return (
      <div className="container center-block text-center">
        <h3>Game of Nines </h3>
        <hr />
        <div className="row">
          <Stars randomNumberOfStars={randomNumberOfStars} />
          <Button
            selectedNumbers={selectedNumbers}
            answerIsCorrect={answerIsCorrect}
            redraws={redraws}
            checkAnswer={this.checkAnswer}
            acceptAnswer={this.acceptAnswer}
            redraw={this.redraw}
          />
          <Answer
            selectedNumbers={selectedNumbers}
            unselectNumber={this.unselectNumber}
          />
        </div>
        <hr />
        {doneStatus ? (
          <Done doneStatus={doneStatus} resetGame={this.resetGame} />
        ) : (
          <Numbers
            selectedNumbers={selectedNumbers}
            selectNumber={this.selectNumber}
            usedNumbers={usedNumbers}
          />
        )}
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
