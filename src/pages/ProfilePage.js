import React from "react"
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}))
class ProfilePage extends React.Component {
    
    render() {
        const {users} = this.props
        let userUsername = this.props.match.params.username
        const user = users.find((user)=>(user.username == userUsername ))
        return (
            <>
                <div className="mt-5 px-4">
                    { user ? 
                    <>
                        <div className="text-center mb-2">
                            <img style={{width:"60vw"}} className="bg-light rounded-circle" src={user.profile_pic} alt="profile" />
                        </div> 
                        <p className="ml-4">Username : {user.username}</p>
                        <p className="ml-4">Age : {user.age} years old</p>
                        <p className="ml-4">Sex : {user.sex}</p>
                        <p className="ml-4">Description : {user.description}</p>
                        <div style={{textAlign:'center',margin:'20px'}}>
                            <Link to={`/messages/${user.id}`}>
                                <Fab variant="extended" className={useStyles.fab} style={{marginLeft:'0',background:"linear-gradient(140deg,rgba(228, 205, 2, 0.63),rgba(226, 57, 136)"}} >Chat with {user.username}</Fab>
                            </Link>
                        </div>
                    </>
                    : null}
                </div>
            </>
        )
    }
}

export default ProfilePage