import * as React from 'react';
import Task from "./Task.js";
import Schedule from "./pages/Schedule";

class App extends React.Component {
  render() {
    return (
      <div className="container">
        <Schedule/>
      </div>
    );
  }
}

export default App;
