import React, {Component} from 'react';
import './App.scss';
import {Button} from '@material-ui/core';
import Database from './database.js'

class Backpanel extends Component {
    state = {
        images: [],
        imageGrid: [],
    }
    getAllData = () => {
        let images = [];
        Database.getData().then(res => {
            res.forEach(item => {
                if (item.item === undefined) {
                    images.push(item);
                }
            })
            this.setState({images}, () => {
                this.generateImages();
            })
        }).catch(error => {
            console.log(error);
        })
    }
    generateImages = () => {
        let imageGrid = [];
        this.state.images.forEach(image => {
            imageGrid.push(
                <div className='image-box'>
                    <img src={image.url}></img>
                    <h3>{image.chooserCount}</h3>
                </div>
            )
        })
        this.setState({imageGrid});
    }
    componentDidMount = () => {
        this.getAllData();
    }
    render() {
        return(
            <div>
                <div className='backpanel'>
                    <h1>תוצאות - תמונת השנה</h1>
                    <div className='image-grid'>
                        {this.state.imageGrid}
                    </div>
                </div>
            </div>
        )
    }
}

export default Backpanel;