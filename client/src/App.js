import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import TutorialsList from "./components/tutorials-list.component";
class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Switch>
            <Route exact path={["/"]} component={TutorialsList} />
            {/* <Route exact path="/add" component={AddTutorial} />
            <Route path="/ekart/:id" component={Tutorial} /> */}
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
