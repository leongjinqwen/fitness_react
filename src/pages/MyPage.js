import React from 'react';
import { Button, UncontrolledAlert, FormGroup, Input, Table, Label,Form } from 'reactstrap';
import axios from 'axios';

export default class MyPage extends React.Component {
    state = {
        weight: '',
        height: '',
        errors: [],
        success: [],
        hasErrors: false,
        isRecord:false,
        bmi:0,
        bmr:0,
        idealWeightMin:0,
        idealWeightMax:0,
        calories:0,
        level: 1.2,
    }

    handleForm=(event)=> {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({ [name]: value },()=>{
            const user = JSON.parse(localStorage.me)
            let finalBmr;
            let finalBmi = this.state.weight/(this.state.height*this.state.height)
            if (user.user.sex==='Male'){
                finalBmr = (13.397*this.state.weight)+(4.799*this.state.height*100)-(5.677*user.user.age)+88.362
            }
            else {
                finalBmr = (9.247*this.state.weight)+(3.098*this.state.height*100)-(4.330*user.user.age)+447.593
            }
            this.setState({
                bmi : finalBmi.toFixed(2),
                bmr : finalBmr.toFixed(0),
                idealWeightMin : (18.6*this.state.height*this.state.height).toFixed(2),
                idealWeightMax: (25*this.state.height*this.state.height).toFixed(2),
                calories : (finalBmr*this.state.level).toFixed(0)
            })
        });
    }

    handleEdit=(event)=>{
        event.preventDefault();
        const user = JSON.parse(localStorage.me)
        axios({
            method: 'post',
            url: `http://localhost:5000/api/v1/records/${user.user.id}`,
            data: { 
                weight : this.state.weight,
                height : this.state.height,
                bmi : this.state.bmi
            }, 
            headers: { 
                Authorization: `Bearer ${user.auth_token}`
            },
        })
        .then(response => {
            this.setState({
                isRecord : true,
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
    activityChange = (e)=> {
        e.preventDefault();
        this.setState({
            level : e.target.value,
            calories : (this.state.bmr*e.target.value).toFixed(0)
        })
    }
    render() {
        return (
        <>
            <div className="container mt-5">
                <div className="card mx-0 px-4 pt-4 pb-2 border rounded shadow mb-4 ">
                    <h2>Add</h2>
                    { this.state.isRecord ? <UncontrolledAlert color="info">{this.state.success}</UncontrolledAlert> : null }                
                    <Form className="">
                        { this.state.hasErrors ? <UncontrolledAlert color="danger">{this.state.errors}</UncontrolledAlert> : null }
                        <div className="d-flex">
                            <FormGroup className="mx-auto">
                                <Label for="weight">Weight(kg) :</Label>
                                <Input className="" type="weight" name="weight" onChange={this.handleForm} placeholder="Weight" />
                            </FormGroup>
                            <FormGroup className="mx-auto">
                                <Label for="height">Height(m) :</Label>
                                <Input className="" type="height" name="height" onChange={this.handleForm} placeholder="Height" />
                            </FormGroup>
                        </div>
                        <Button style={{display:'block',width:'100%',margin:'5px 0'}} color="primary" onClick={this.handleEdit} >Record</Button>                  
                    </Form>
                </div>
                <div className="card mx-0 px-4 pt-4 pb-2 border rounded shadow mb-4 ">
                    <Table className="border">
                        <thead>
                            <tr>
                                <th className="py-1 px-auto" scope="col"><strong>BMI Categories</strong></th>
                                <th className="py-1 px-auto" scope="col"><strong>BMI Range</strong></th>
                            </tr>
                        </thead>
                        <tbody style={{fontFamily:"Roboto"}}>
                            <tr>
                                <td className="py-1">Underweight</td>
                                <td className="py-1">Less than 18.5</td>
                            </tr>
                            <tr>
                                <td className="py-1">Normal weight</td>
                                <td className="py-1">18.6 – 25.0 </td>
                            </tr>
                            <tr>
                                <td className="py-1">Overweight</td>
                                <td className="py-1">25.1 – 30.0</td>
                            </tr>
                            <tr>
                                <td className="py-1">Obese</td>
                                <td className="py-1">More than 30.0</td>
                            </tr>
                        </tbody>
                    </Table>
                    <h5>Body Mass Index(BMI) : <span style={{fontFamily:"Times"}}>{this.state.bmi}</span> </h5>
                    <p>Healthy weight for the height : <span style={{fontFamily:"Times"}}>{this.state.idealWeightMin} kg - {this.state.idealWeightMax} kg </span></p>
                </div>
                <div className="card mx-0 px-4 pt-4 pb-2 border rounded shadow mb-4 ">
                    <p className="">Basal Metabolic Rate(BMR) : <span style={{fontFamily:"Times",display:'block'}}>{this.state.bmr} Calories/day</span> </p> 
                    <p className="">Daily Calorie Needs : <span style={{fontFamily:"Times"}}>{this.state.calories} Calories</span> </p>                         
                    <Label className="mb-1" for="level">Physical activity level :</Label>
                    <Input className="mb-2" type="select" name="level" id="select" onChange={this.activityChange}>                        
                        <option value="1.2">Little or no exercise</option>
                        <option value="1.4">Light:exercise 1-3 times/week</option>
                        <option value="1.6">Moderate:exercise 4-5 times/week</option>
                        <option value="1.8">Active:daily exercise or intense exercise 3-4 times/week</option>
                        <option value="2.0">Extra Active:very intense exercise daily</option>
                    </Input>
                    <small className="text-muted pb-2">*BMR is the number of calories required to keep your body functioning at rest. Calculation based on the revised Harris-Benedict equation.</small>              
                </div>
            </div>
        </>
        );
    }
}