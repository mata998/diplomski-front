// Css
import "./App.css";

import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory,
} from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Course from "./pages/Course.jsx";
import { GlobalProvider } from "./context/GlobalContext.js";

function App() {
  return (
    <GlobalProvider>
      <div className="App">
        <Router basename="">
          {/* ajmoo :( */}
          <Switch>
            <Route path="/login" render={(props) => <Landing {...props} />} />
            <Route
              path="/course"
              exact
              render={(props) => <Course {...props} />}
            />
          </Switch>
        </Router>
      </div>
    </GlobalProvider>
  );
}

export default App;
