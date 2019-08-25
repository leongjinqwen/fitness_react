import React from 'react';
import { UncontrolledAlert, Form,Label } from 'reactstrap';
import axios from 'axios';
import { Link,Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    }
}))


export default class LoginPage extends React.Component {
    state = {
        email: '',
        password: '',
        emailValid: false,
        passwordValid: false,
        formValid: false,
        hasErrors: false,
        errors: [],
        isLogin: false,
        success: [],
        redirectHome:false
      }
    
    handleChange=(event)=> {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value },
            () => {this.validateField(name,value)});
    }
    
    handleSubmit=(event)=> {
        event.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost:5000/api/v1/login',
            data: { 
                email : this.state.email,
                password: this.state.password
            }, 
        })
        .then(response => {
            // console.log(response);
            localStorage.setItem('me', JSON.stringify(response.data));
            this.setState({
                isLogin : true,
                success : response.data.message,
                redirectHome:true
            })
            window.location.reload()
        })
        .catch(error => {
            console.log(error)
            this.setState({
                hasErrors : true,
                errors : error.response.data.message,
            })
        })
    }

    validateField(fieldName,value) {
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            break;
            case 'password':
            passwordValid = value.length >= 8;
            break;
            default:
            break;
        }
        this.setState({ emailValid: emailValid,
                        passwordValid: passwordValid
                        }, this.validateForm);
    }

    validateForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid});
    }
      
  render() {
    const {formValid,isLogin,success,hasErrors,errors} = this.state
    return (
        <>
            { this.state.redirectHome ? <Redirect to='/account' /> : null }
            <div className="mt-5 px-3">
                { isLogin && <UncontrolledAlert color="info">{success}</UncontrolledAlert> }                
                <Form className="px-4" >
                    <h3>Login for Fitness App</h3>
                    { hasErrors && <UncontrolledAlert color="danger">{errors}</UncontrolledAlert>}
                    <TextField type="email" label="Email" name="email" placeholder="Email" 
                        onChange={this.handleChange} fullWidth className={useStyles.textField} style={{display:'block'}} margin="normal" />
                    <TextField label="Password" type="password" name="password" placeholder="Password"
                        onChange={this.handleChange} fullWidth className={useStyles.textField} style={{display:'block'}} margin="normal" />
                    {/* <FormText color="muted">Forget your password?</FormText> */}
                    <Fab variant="extended" style={{marginTop:'15px',background:"rgba(21, 47, 190,0.5)"}} className={useStyles.fab} disabled={!formValid} onClick={this.handleSubmit} >Login</Fab>
                    <div className="mx-auto" style={{margin:'20px'}}>
                        <Label for="account">New user? Sign up now!</Label>
                        <Link to="/signup" >
                            <Fab variant="extended" className={useStyles.fab} style={{marginLeft:'10px',background:"linear-gradient(140deg,rgba(228, 205, 2, 0.63),rgba(226, 57, 136)"}} >Sign up</Fab>
                        </Link>
                    </div>
                </Form>
            </div>
           
        </>
    );
  }
}

 