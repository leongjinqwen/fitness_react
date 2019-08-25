import React from 'react';
import { UncontrolledAlert, FormGroup, Input, Label,Form,Col } from 'reactstrap';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';

const useStyles = makeStyles(theme => ({
    fab: {
        margin: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}))

export default class AccountPage extends React.Component {
    state = {
        username: '',
        password: '',
        age: '',
        sex: '',
        description: '',
        errors: [],
        success: [],
        hasErrors: false,
        isEdit:false,
        user:''
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.me)
        axios({
            method: 'get',
            url: `http://localhost:5000/api/v1/users/me`,
            headers: { 
                Authorization: `Bearer ${user.auth_token}`
            },
        })
        .then(response => {
            console.log(response.data);
            this.setState({
                user: response.data.user,
                password : '',
                username : response.data.username,
                age : response.data.age,
                sex : response.data.sex,
                description : response.data.description,
            })
        })
        .catch(error => {
            this.setState({
                hasErrors : true,
                errors : error.response.data.message,
            })
        })
    }

    handleForm=(event)=> {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value });
    }

    handleEdit=(event)=>{
        event.preventDefault();
        const user = JSON.parse(localStorage.me)
        axios({
            method: 'post',
            url: `http://localhost:5000/api/v1/users/edit/${user.user.id}`,
            data: { 
                password : this.state.password,
                username : this.state.username,
                age : this.state.age,
                sex : this.state.sex,
                description : this.state.description
            }, 
            headers: { 
                Authorization: `Bearer ${user.auth_token}`
            },
        })
        .then(response => {
            // console.log(response);
            this.setState({
                isEdit : true,
                success : response.data.message,
            })
            this.componentDidMount()
        })
        .catch(error => {
            this.setState({
                hasErrors : true,
                errors : error.response.data.message,
            })
        })
    }
    render() {
        // const {user} = this.state
        // console.log(this.state)
        return (
        <>
            <div className="mx-2 mt-5 px-5 py-4"> 
                <h2>Profile</h2>
                { this.state.isEdit ? <UncontrolledAlert color="info">{this.state.success}</UncontrolledAlert> : null }                
                <Form className="">
                    { this.state.hasErrors ? <UncontrolledAlert color="danger">{this.state.errors}</UncontrolledAlert> : null }
                    <FormGroup>
                        <Label for="username">Username :</Label>
                        <input style={{width:'100%',background:'rgba(0,0,0,0)',border:'none',borderBottom:'1px solid black',display:'block'}} type="username" name="username" onChange={this.handleForm} defaultValue={this.state.username} placeholder="Username" />
                    </FormGroup>
                    <div className="row">
                        <Col className="w-50">
                            <Label for="age" className="">Age :</Label>
                            <input style={{width:'100%',marginTop:'5px',background:'rgba(0,0,0,0)',border:'none',borderBottom:'1px solid black',display:'block'}} type="age" name="age" onChange={this.handleForm} defaultValue={this.state.age} placeholder="Age" />
                        </Col>
                        <Col className="w-50"> 
                            <Label for="sex" className="">Sex :</Label>
                            <Input className="" type="select" name="sex" id="select" onChange={this.handleForm}>
                                { this.state.sex === "Male" ? 
                                <>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option> 
                                </>
                                : 
                                <>
                                    <option value="Female">Female</option>
                                    <option value="Male">Male</option>
                                </>
                                }
                            </Input>
                        </Col>
                    </div>
                    <FormGroup>
                        <Label for="description" className="">Description :</Label>
                        <input style={{width:'100%',background:'rgba(0,0,0,0)',border:'none',borderBottom:'1px solid black',display:'block'}} type="description" name="description" onChange={this.handleForm} defaultValue={this.state.description} placeholder="Description" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password :</Label>
                        <input style={{width:'100%',background:'rgba(0,0,0,0)',border:'none',borderBottom:'1px solid black',display:'block'}} type="password" name="password" required onChange={this.handleForm} value={this.state.password} placeholder="Password" />
                    </FormGroup>
                    <Fab variant="extended" className={useStyles.fab} onClick={this.handleEdit} style={{marginLeft:'0',background:"linear-gradient(140deg,rgba(185, 231, 199, 0.849),rgba(14, 207, 30, 0.856))"}} >Save Profile</Fab>
                </Form>
            </div>
        </>
        );
    }
}