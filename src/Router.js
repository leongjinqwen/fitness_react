import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import AccountPage from './pages/AccountPage';
import MyPage from './pages/MyPage';
import FoodPage from './pages/FoodPage';
import BodyfatPage from './pages/BodyfatPage';
import HomePage from './pages/HomePage';
import MainPage from './pages/MainPage';
import ChatPage from './pages/ChatPage';
import MapContainer from './containers/MapContainer';

export default class Router extends React.Component {
    render(){
        const {users}=this.props;
        return(
            <div>
                <Switch>
                    <Route exact path="/" component={props=><HomePage {...props}/>} />
                    <Route path="/home" component={props=><MainPage {...props}/>} />
                    <Route path="/login" component={props=><LoginPage {...props}/>} />
                    <Route path="/signup" component={props=><SignUpPage {...props}/>} />
                    <Route path="/map" component={props=><MapContainer {...props} />} />
                    <Route path="/users/:username" component={props=><ProfilePage users={users} {...props} />} />
                    <Route path="/messages/:userid" component={props=><ChatPage users={users} {...props} />} />
                    <Route path="/account" component={props=><AccountPage {...props} />} />
                    <Route path="/record" component={props=><MyPage {...props} />} />
                    <Route path="/food" component={props=><FoodPage {...props} />} />
                    <Route path="/fitness" component={props=><BodyfatPage {...props} />} />
                </Switch>
            </div>
        )
    }
}