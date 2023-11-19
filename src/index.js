// import React from 'react';
import ReactDOM from 'react-dom/client';
import React from "react";
import "./index.css";
import TaskList from "./App";
import { TASKS } from "./json";

function App() {
  return (
    <div className="App" style={{margin:"0px"}}>
      <TaskList tasks={TASKS} />
    </div>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

