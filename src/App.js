import React from 'react';
import './App.css';
import Router from './Router';
import NavBar from './components/NavBar';
import axios from 'axios';
import Slide from './components/Slide';

class App extends React.Component {
  state = {
    users:[]
  }

  componentDidMount(){
    axios({
      method: 'GET', 
      url: 'http://localhost:5000/api/v1/users/'
    })
    .then(result => {
      this.setState({
        users : result.data
      })
    })
    .catch(error => {
      console.log('ERROR: ', error)
    })
  }
  render() {
    const {users} = this.state
    return (
      <>
        <div id="App">
          <Slide pageWrapId={"page-wrap"} outerContainerId={"App"} /> 
          <div id="page-wrap">
            <Router users={users} /> 
          </div>
        </div>
        { localStorage.getItem('me')?
        <NavBar />
        :
        null
        }
      </>
    )
  }
}

export default App
