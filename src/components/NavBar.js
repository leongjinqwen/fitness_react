import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FoodIcon from '@material-ui/icons/Fastfood';
// import AssignmentIcon from '@material-ui/icons/Assignment';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import FitnessIcon from '@material-ui/icons/FitnessCenter';
import HomeIcon from '@material-ui/icons/Home';
import { Link } from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles(theme =>({
  root: {
    overflow: 'hidden',
    position: 'fixed',
    width:'100%',
    bottom: '0'
  },
  link: {
    textDecoration:'none',
  },
  fab: {
    margin: theme.spacing(1),
  },
}));

export default function NavBar() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event, newValue) {
    setValue(newValue);
  }
  return (
    <>
      { localStorage.getItem('me') ? 
      <>
        <BottomNavigation
          value={value} onChange={handleChange}
          showLabels
          className={classes.root}
        >
          <BottomNavigationAction component={Link} to="/" style={{textDecoration:'none'}} label="Home" value="home" icon={<HomeIcon />} />
          <BottomNavigationAction component={Link} to="/food" style={{textDecoration:'none'}} label="Nutrition" value="nutrition" icon={<FoodIcon />}>
          </BottomNavigationAction>
          <BottomNavigationAction component={Link} to="/fitness" style={{textDecoration:'none'}} label="Fitness" value="fitness" icon={<FitnessIcon/>} />
          <BottomNavigationAction component={Link} to="/map" style={{textDecoration:'none'}} label="Nearby" value="nearby" icon={<LocationOnIcon />} />
        </BottomNavigation>
      </> : null}
    </>
  );
}