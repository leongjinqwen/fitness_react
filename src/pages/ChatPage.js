import React from "react"
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import { Input,Form } from 'reactstrap';
import ChatIcon from '@material-ui/icons/ChatBubbleOutline';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}))
class ChatPage extends React.Component {
    state = {
        message:'',
        conversation:[],
    }
    handleChange=(event)=> {
        this.setState({ 
            message: event.target.value,
        });
    }
    handleSubmit=(event)=>{
        event.preventDefault();
        const user = JSON.parse(localStorage.me)
        axios({
            method: 'post',
            url: `http://localhost:5000/api/v1/messages/${this.props.match.params.userid}`,
            data: { 
                message : this.state.message,
            }, 
            headers: { 
                Authorization: `Bearer ${user.auth_token}`
            },
        })
        .then(response => {
            console.log(response);
            this.setState({
                message : ""
            })
            this.componentDidMount()
        })
        .catch(error => {
            console.log(error)
        })
    }
    componentDidMount() {
        const user = JSON.parse(localStorage.me)
        axios({
            method: 'get',
            url: `http://localhost:5000/api/v1/messages/show/${this.props.match.params.userid}`,
            headers: { 
                Authorization: `Bearer ${user.auth_token}`
            },
        })
        .then(result => {
            console.log(result)
            this.setState({
                conversation: result.data.conversation,
            })
        })
        .catch(error => {
            console.log('ERROR: ', error)
        })
    }
    render() {
        return (
            <>  
            <Form className="d-flex mt-5 mx-2" style={{position:'fixed',bottom:'60px',width:'95%'}}>
                <Input type='textarea' rows="1" maxLength="500" className='' placeholder="Type a message..." onChange={this.handleChange} value={this.state.message} />
                <Fab color="primary" aria-label="chat" style={{width:'40px',height:'40px',marginLeft:'3px'}} className={useStyles.fab} onClick={this.handleSubmit}><ChatIcon /></Fab>
            </Form>
            </>
        )
    }
}

export default ChatPage