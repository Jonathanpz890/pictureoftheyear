import React, {Component} from 'react';
import {Button} from '@material-ui/core';

class ImageBox extends Component{
    state = {
        imageNumber: parseInt(this.props.imgClass),
    }
    imageClick = (e) => {
        this.props.onClickImg(e);
    }
    componentDidMount = () => {}
    
    render() {
        let chosen = false;
        let full = false;
        this.props.chosenImages.forEach(image => {
            if (parseInt(image) === this.state.imageNumber) {
                chosen = true;
            }  
        })
        if (this.props.chosenImages.length >= 5) {
            full = true;
        }

        return(
            <div className='image-box'>
                <img className={this.props.imgClass} alt='' src={`styles/images/${this.props.src}`} onClick={(e) => this.imageClick(e)}></img>
                <Button variant='contained' classes={{root: chosen ? '' : full ? 'disabled' : ''}} color={chosen ? 'secondary' : ''} onClick={() => this.props.onClickButton(this.state.imageNumber)}>{chosen ? 'הסרת בחירה' : full ? 'לא ניתן לבחור' : 'בחירה'}</Button>
            </div>
         )
    }
}

export default ImageBox;