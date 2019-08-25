import React from 'react';
import {  Button,Input,Label } from 'reactstrap';
import Dropzone from '../components/Dropzone';
import Clarifai from 'clarifai'
import axios from 'axios';

export default class FoodPage extends React.Component {
    state = {
        previewImage: '',
        imageFile: null,
        base64:'',
        concepts:[],
        selected:[],
        nutritions:[],
        isSuccess:false,
        isPredict:false
    }
    handleFile = e => {
        this.getBase64(e[0], (result) => {
            this.setState({
                previewImage: URL.createObjectURL(e[0]),
                imageFile: e[0],
                base64: result
            });
        });
    };
    handlePredict = e =>{
        let app = new Clarifai.App({apiKey: 'd480f07d46624b4da292b4174340d543'});
        app.models.predict(Clarifai.FOOD_MODEL, { base64: this.state.base64.split("base64,")[1] })
        .then(response => {
            this.setState({
                concepts : response['outputs'][0]['data']['concepts'],
                isPredict : true
            })
        })
    }
    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }
    handleCheckbox=e=>{
        const {selected} = this.state
        if (e.target.checked===true){
            selected.push(e.target.value)
        } else {
            selected.splice(selected.indexOf(e.target.value), 1 )
        }
    }
    getNutrition = e =>{
        const {selected} = this.state
        axios({
            method: 'post',
            url: 'http://localhost:5000/api/v1/records/nutrition',
            data: {
                concepts : selected
            }
        })
        .then(result => {
            this.setState({
                nutritions : result.data.data,
                isSuccess:true
            })
        })
        .catch(error => {
            console.log('ERROR: ', error)
        })
    } 
    render() {
        const {concepts,previewImage,nutritions,isSuccess,isPredict} = this.state
        return (
            <>
                <div className="mt-5 container">
                    <p>Check your food nutrition now!</p>
                    { previewImage ? 
                        <img className="px-2" src={previewImage} width="100%" alt="upload_image"/> 
                        : 
                        <div className="Card">
                            <Dropzone onFilesAdded={this.handleFile} />
                        </div>
                    }
                    { isPredict ? null :
                    <Button style={{display:'block',width:'100%',margin:'5px 0'}} color="primary" onClick={this.handlePredict} >Predict Food</Button>                                      
                    }    
                </div>
                <div className="container">
                    { isSuccess ? 
                        <>
                        { nutritions.map((result,index)=>(
                            <div className="card mx-2 shadow-sm" key={index}>
                                <div className="card-body">
                                    <p><strong>{result.concept}</strong></p>
                                    <img src={result.image} alt={result.concept} />
                                </div>
                            </div>
                            ))
                        }
                        </>
                        :
                        <>
                        { isPredict ? 
                            <>
                            { concepts.map((concept,index)=>(
                                <div className="card mx-2 shadow-sm" key={index}>
                                    <div className="form-check">
                                        <Input type="checkbox" className="form-check-input d-block mx-2 my-3" name="concept" value={concept.name} onChange={this.handleCheckbox} />
                                        <Label for="concept" className="form-check-label d-block ml-5 py-2">{concept.name}</Label>
                                    </div>
                                </div>
                                ))
                            }
                            <Button style={{display:'block',width:'100%',margin:'5px 0'}} color="primary" onClick={this.getNutrition} >Nutrition</Button>                                      
                            </>
                            :
                            null
                        }
                        </>
                    }
                </div>
            </>
        );
    }
}

