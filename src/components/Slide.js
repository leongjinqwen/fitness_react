import { Link,Redirect } from 'react-router-dom';
import React from 'react';
import { slide as Menu } from 'react-burger-menu'
import AccountIcon from '@material-ui/icons/AccountCircle'
import AssignmentIcon from '@material-ui/icons/Assignment';
import ExitIcon from '@material-ui/icons/ExitToApp';
import LocationOnIcon from '@material-ui/icons/LocationOn';

export default class NavBar extends React.Component {
  state= {
    isOpen: false,
    redirectHome:false
  }
  showSettings=(event)=> {
    this.setState({
      isOpen: !this.state.isOpen
    }, () => {
      this.setState({
        isOpen: !this.state.isOpen
      })
    })
  }
    
  handleLogout = () => {
    localStorage.removeItem('me')
    this.showSettings()
    this.setState({
      redirectHome:true
    },()=>window.location.reload())
  }
  render () {
    return (
      <>
      { this.state.redirectHome ? <Redirect to='/login' /> : null }
      <Menu right width={ 280 } isOpen={this.state.isOpen}  >
        { localStorage.getItem('me') ? 
          <>
            <Link to="/account" onClick={ this.showSettings } className="nav-link menu-item" ><AccountIcon className="mr-2"/>Profile</Link>
            <Link to="/record" onClick={ this.showSettings } className="nav-link menu-item" ><AssignmentIcon className="mr-2"/>Record</Link>
            <Link to="/map" onClick={ this.showSettings } className="nav-link menu-item" ><LocationOnIcon className="mr-2"/>Map</Link>
            <Link to="/login" onClick={ this.handleLogout } className="nav-link menu-item" ><ExitIcon className="mr-2"/>Logout</Link>
          </>
          :
          <>
            <Link to="/login" onClick={this.showSettings} className="nav-link menu-item" >Login</Link>
          </> }
      </Menu>
      </>
    );
  }
}