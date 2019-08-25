import React from 'react';
import { UncontrolledAlert, FormGroup, FormText, Input, Label, Form } from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
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

export default class SignUpPage extends React.Component {
    state = {
        username: '',
        email: '',
        password: '',
        age: '',
        sex: 'Male',
        description: '',
        userValid: false,
        emailValid: false,
        passwordValid: false,
        formValid: false,
        hasErrors: false,
        errors: [],
        isLogin: false,
        success: []
    }
    
    handleInput=(event)=> {
        const name = event.target.name;
        const value = event.target.value;
        console.log(value)
        this.setState({ [name]: value },
            () => {this.validField(name,value)});
    }

    handleSignup=(event)=> {
        event.preventDefault();

        axios({
            method: 'post',
            url: 'http://localhost:5000/api/v1/users/new',
            data: { 
                username: this.state.username,
                email : this.state.email,
                password: this.state.password,
                age: this.state.age,
                sex: this.state.sex,
                description: this.state.description,
            }
        })
        .then(response => {
            console.log(response);
            localStorage.setItem('me', JSON.stringify(response.data));
            // setTimeout(this.props.toggle,1000);;
            this.setState({
                isLogin : true,
                success : response.data.message,
            })
        })
        .catch(error => {
            this.setState({
                hasErrors : true,
                errors : error.response.data.message,
            })
        })
    }

    validField(fieldName,value) {
        let userValid = this.state.userValid;
        let emailValid = this.state.emailValid;
        let passwordValid = this.state.passwordValid;

        switch(fieldName) {
            case 'username':
            userValid = value.length >= 3;
            break;
            case 'email':
            emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
            break;
            case 'password':
            passwordValid = value.length >= 8;
            break;
            default:
            break;
        }
        this.setState({ userValid: userValid,
                        emailValid: emailValid,
                        passwordValid: passwordValid
                        }, this.validForm);
    }

    validForm() {
        this.setState({formValid: this.state.emailValid && this.state.passwordValid && this.state.userValid});
    }
    
    render() {
        return (
        <>
            { this.state.isLogin ? <UncontrolledAlert color="info">{this.state.success}</UncontrolledAlert> : null }                
            <div className="mt-5 px-3">
                <Form className="px-4" onSubmit={this.handleSignup}>
                    <h3>Sign Up</h3>
                    { this.state.hasErrors ? <UncontrolledAlert color="danger">{this.state.errors}</UncontrolledAlert> : null }
                    <TextField type="name" label="Username" name="username" placeholder="Username" 
                        onChange={this.handleInput} fullWidth className={useStyles.textField} style={{display:'block'}} />
                    <TextField type="email" label="Email" name="email" placeholder="Email" 
                        onChange={this.handleInput} fullWidth className={useStyles.textField} style={{display:'block',marginTop: '6px'}} />
                    <TextField label="Password" type="password" name="password" placeholder="Password"
                        onChange={this.handleInput} fullWidth className={useStyles.textField} style={{display:'block',marginTop: '6px'}} />
                    <FormGroup className="d-flex mb-0">
                        <TextField label="Age" type="text" name="age" placeholder="Age" style={{marginTop:'3px'}}
                            onChange={this.handleInput} fullWidth className={useStyles.textField} />
                        <Input className="w-50 mt-2 mb-0" type="select" name="sex" id="select" onChange={this.handleInput}>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </Input>
                    </FormGroup>
                    <TextField label="Describe yourself" type="text" name="description" placeholder="Describe yourself"
                        onChange={this.handleInput} fullWidth className={useStyles.textField} style={{display:'block',marginTop: '6px'}} />
                    { !this.state.formValid ? <small className='text-muted'>* All fields are required</small> : null}
                    <div>
                        <Fab variant="extended" style={{marginTop:'10px',background:"rgba(21, 47, 190,0.5)"}} className={useStyles.fab} disabled={!this.state.formValid} onClick={this.handleSignup} >Sign Up</Fab>
                        <FormText className="mt-0" color="muted">By tapping Sign Up, you agree to our Terms of Service and Privacy Policy</FormText>
                    </div>
                    <div className="mx-auto" style={{margin:'10px'}}>
                        <Label for="exampleEmail">Already sign up? Sign in now!</Label>
                        <Link to="/login" >
                            <Fab variant="extended" className={useStyles.fab} style={{marginLeft:'0',background:"linear-gradient(140deg,rgba(228, 205, 2, 0.63),rgba(226, 57, 136)"}} >Login</Fab>
                        </Link>
                    </div>
                </Form>
            </div>
        </>
        );
    }
}