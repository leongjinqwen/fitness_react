import React from 'react';
import { Button,Label } from 'reactstrap';
import Dropzone from '../components/Dropzone';
import Clarifai from 'clarifai'

export default class FoodPage extends React.Component {
    state = {
        previewImage: '',
        imageFile: null,
        base64:'',
        concepts:[],
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
        app.models.predict("bodyfat_estimate", { base64: this.state.base64.split("base64,")[1] })
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
   
    render() {
        const {concepts,previewImage,isPredict} = this.state
        return (
            <>
                <div className="mt-5 container">
                    <p>Check your body fat now!</p>
                    { previewImage ? 
                        <img className="px-2" src={previewImage} width="100%" alt="upload_image"/> 
                        : 
                        <div className="Card">
                            <Dropzone onFilesAdded={this.handleFile} />
                        </div>
                    }
                    { isPredict ? null :
                    <Button style={{display:'block',width:'100%',margin:'5px 0'}} color="primary" onClick={this.handlePredict} >Predict Body Fat Percentage</Button>                                      
                    }    
                </div>
                <div className="container">
                    { isPredict ? 
                        <>
                        { concepts.slice(0, 2).map((concept,index)=>(
                            <div className="card mx-2 shadow-sm" key={index}>
                                <div className="form-check">
                                    <Label for="concept" className="form-check-label d-block ml-5 py-2">{concept.name}</Label>
                                </div>
                            </div>
                            ))
                        }
                        </>
                        :
                        null
                    }
                </div>
            </>
        );
    }
}

