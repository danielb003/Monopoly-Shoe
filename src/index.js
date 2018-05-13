import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Home from './Home';
import Auth from './authentication/Auth';
import Dashboard from './dashboard/Dashboard';
import Leaderboard from './leaderboard/Leaderboard';
import Logout from './authentication/Logout';
import Admin from './dashboard/Admin';
import Switchboard from './dashboard/Switchboard';
import { BrowserRouter, Route } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';

const Root = () => (
   <BrowserRouter>
      <div>
         <Route exact path="/" component={Home} />
         <Route path="/auth" component={Auth} />
         <Route path="/dashboard" component={Dashboard} />
         <Route path="/leaderboard" component={Leaderboard} />
         <Route path="/logout" component={Logout} />
         <Route path="/admin" component={Admin} />
         <Route path="/loading" component={Switchboard} />
      </div>
   </BrowserRouter>
);

ReactDOM.render(<Root />, document.getElementById('root'));

registerServiceWorker();