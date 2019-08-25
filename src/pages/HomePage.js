import React from 'react';
import { Table } from 'reactstrap';
import axios from 'axios';
import { LineChart } from 'react-chartkick';
import 'chart.js';

export default class HomePage extends React.Component {
    state = {
        records:[],
        chart:[],
        chartBmi:[],
        user:""
    }

    componentDidMount() {
        const user = JSON.parse(localStorage.me)
        axios({
            method: 'get',
            url: 'http://localhost:5000/api/v1/records/',
            headers: { 
                Authorization: `Bearer ${user.auth_token}`
            },
        })
        .then(result => {
            this.setState({
                records: result.data.records,
                chart: result.data.chart,
                chartBmi: result.data.chartBmi,
                user:user
            })
        })
        .catch(error => {
            console.log('ERROR: ', error)
        })
    }

    render() {
        const {user} = this.state
        return (
        <>
            <div className="container mt-5">
                { user ? <h3>{user.user.username}'s Profile</h3> : null }
                <div className="card mx-0 px-2 pt-4 pb-4 border rounded shadow mb-4 ">
                    <h5 className="pl-2">Records</h5>
                    <Table className="border">
                        <thead>
                            <tr className="">
                                <th className="py-0 px-auto" scope="col"><strong>Date</strong></th>
                                <th className="py-0 px-auto" scope="col"><strong>Height</strong></th>
                                <th className="py-0 px-auto" scope="col"><strong>Weight</strong></th>
                                <th className="py-0 px-auto" scope="col"><strong>BMI</strong></th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                        this.state.records.map((record,index)=>(
                            <tr style={{fontFamily:"Roboto",fontSize:'14px'}} key={index}>
                                <td className="py-1">{record.date}</td>
                                <td className="py-1">{record.height}m</td>
                                <td className="py-1">{record.weight}kg</td>
                                <td className="py-1">{record.bmi}</td>
                            </tr>
                        ))
                        }
                        </tbody>
                    </Table>
                </div>
                <div className="card mx-0 px-2 py-2 border rounded shadow mb-4 ">
                    <LineChart download="chart-weight" discrete={true} xtitle="Date" ytitle="Weight(kg)" data={this.state.chart} />
                </div>
                <div className="card mx-0 px-2 py-2 border rounded shadow mb-4 ">
                    <LineChart download="chart-bmi" discrete={true} xtitle="Date" ytitle="BMI" data={this.state.chartBmi} />                        
                </div>
            </div>
        </>
        );
    }
}