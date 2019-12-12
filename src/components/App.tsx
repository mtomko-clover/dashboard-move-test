import React from 'react';
import { Link} from 'react-router-dom';
import './App.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <div className="header">
                <Link className="header_title" to="/">DevRel Dashboard</Link>
                <Link className="time_tracking" to="/TimeTracker">Time Tracking</Link>
            </div>
        </div>
    );
};

export default App;
