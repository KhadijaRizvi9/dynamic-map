import React from "react";
import LeafletMap from "./component/LeafletMap";
import "./App.css"
function App() {
  return (
    <div >
     <h1 className="text">
  🌍 Interactive Map
    </h1>
      <LeafletMap />
    </div>
  );
}

export default App;
