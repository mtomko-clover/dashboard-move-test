import React from 'react';
import { Link} from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
        <Link className="time_tracking" to="/TimeTracker">TIME TRACKAAAA</Link>
    </div>
  );
}

export default App;
