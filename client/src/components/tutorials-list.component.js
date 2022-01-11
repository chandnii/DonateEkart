import React, { Component } from "react";
import TutorialDataService from "../services/tutorial.service";
import "../App.css";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
export default class TutorialsList extends Component {
  constructor(props) {
    super(props);
    this.retrieveTutorials = this.retrieveTutorials.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {
      tutorials: [],
      dropdownOpen: false,
      currencyValue: { symbol: "INR", rate: 1 },
      currencies: [],
    };
  }

  componentDidMount() {
    this.retrieveTutorials();

    axios
      .get(
        "https://v6.exchangerate-api.com/v6/eee282495c81c8f72f5dd34b/latest/INR"
      )
      .then((response) => {
        const ratesTemp = [];
        for (const [symbol, rate] of Object.entries(
          response.data.conversion_rates
        )) {
          ratesTemp.push({ symbol, rate });
        }
        this.setState({ currencies: ratesTemp }, () => {});
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  retrieveTutorials() {
    TutorialDataService.getAll()
      .then((response) => {
        this.setState({
          tutorials: response.data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  toggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  changeValue = (event, item) => {
    this.setState({ currencyValue: item });
  };

  render() {
    const { tutorials } = this.state;
    return (
      <div className="container-fluid d-flex justify-content-center">
        <div className="dropdown">
          Currency
          <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
            <DropdownToggle caret>
              {this.state.currencyValue.symbol}
            </DropdownToggle>
            <DropdownMenu>
              {this.state.currencies.map((item, index) => (
                <DropdownItem
                  key={index}
                  onClick={(e) => this.changeValue(e, item)}
                >
                  {item.symbol}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <ul className="cards">
          {tutorials &&
            tutorials.map(
              (tutorial, index) =>
                tutorial.imageSrc && (
                  <li key={tutorial.id}>
                    <div className="card">
                      <img
                        src={tutorial.imageSrc}
                        className="card__image"
                        alt=""
                      />
                      <div className="card__overlay">
                        <div className="card__header">
                          <div className="card__header-text">
                            <h3 className="card__title">{tutorial.ngoName}</h3>
                            <span className="card__status">
                              {tutorial.totalAmount *
                                this.state.currencyValue.rate}
                            </span>
                          </div>
                        </div>
                        <p className="card__description">{tutorial.title}</p>
                      </div>
                    </div>
                  </li>
                )
            )}
        </ul>
      </div>
    );
  }
}
