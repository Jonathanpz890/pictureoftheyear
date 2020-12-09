import React, {Component} from 'react';
import './App.scss';
import {Button, IconButton} from '@material-ui/core';
import Database from './database.js'
import ImageBox from './ImageBox.js'

class Main extends Component {
    state = {
        currentImage: '',
        chosenImages: [],
        selectButton: 'בחירת תמונה',
        userIPAddress: '',
        downloadLink: [],
        descriptions: [
            'לוחם בתרי"ח אגוז',
            'צוות רפואי על גג ביה״ח בזמן מטס יום העצמאות',
            'אח״י מגן מהישט הכניסה למדינת ישראל',
            'לוחמי יחידת 669 באימון',
            'טקס סיום קק"ץ אחוד בבה"ד 1',
            'לוחם דובדבן',
            'תרי"ח אגוז',
            'אימון שייטת ספינות הטילים',
            'הרמטכ"ל ב"זירת האימונים"',
            'לוחמת חטיבת החילוץ וההדרכה בתרגיל מוסק',
            'גדס"ר צנחנים מחלקים מארזי מזון בזמן הגל הראשון',
            'לוחם יהל"ם בזירת המטענים שנמצאה בגבול סוריה',
            'תרגיל פלוגתי בחטיבת הצנחנים',
            'טקס מסירת אח״י מגן לידי זרוע הים',
            'השבעת לוחמי גולני שנפצעו בפיגוע בירושלים',
            'מפקד בסיס נבטים ורע"ן נפגעים עם משפחתו של רס"ן דניאל גורי ז"ל, אחרי החזרת קסדתו',
            'קהנ״ר בטקס סיום מסלול הנדסה',
            'חלוקת מארזי מזון בזמן הגל הראשון',
            'אימון של יחידת 669 בכנרת',
            'תרג״ד קדם פלח״ץ',
        ]
    }
    imgClickHandler = (e) => {
        if (this.state.chosenImages.length >= 5) {
            this.setState({selectButton: 'לא ניתן לבחור'})
        }
        const overlay = document.querySelector('.overlay');
        document.querySelector('.overlay-img').src = e.target.src;
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 150)
        this.setState({currentImage: e.target.classList[0]}, () => {
            this.state.chosenImages.forEach(pic => {
                if (pic == this.state.currentImage) {
                    this.setState({selectButton: 'הסרת בחירה'})
                }
            })
        });
        document.querySelector('.overlay-text').innerHTML = this.state.descriptions[e.target.classList[0] - 1];
        console.log(this.state.descriptions[e.target.classList[0] - 1])
    }
    closeOverlay = (no) => {
        const overlay = document.querySelector('.overlay');
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300)
        this.setState({
            currentImage: '',
            selectButton: 'בחירת תמונה',
        });
        document.querySelector('.overlay-text').innerHTML = '';
    }
    chooseImage = (value) => {
        let remove = false;
        this.state.chosenImages.forEach(image => {
            console.log(value, image);
            if (value == image) {
                this.removePicture(value);
                remove = true;
            }
        })
        if (!remove) {
            console.log(remove);
            let chosenImages = [...this.state.chosenImages];
            console.log(chosenImages, value);
            chosenImages.push(parseInt(value));
            this.setState({chosenImages}, () => {
                this.closeOverlay();
                console.log(this.state.chosenImages)
            })
        }
    }
    removePicture = (value) => {
        let chosenImages = [...this.state.chosenImages];
        const index = chosenImages.indexOf(value);
        console.log('final: ', chosenImages);
        chosenImages.splice(index, 1);
        console.log(chosenImages);
        this.setState({chosenImages}, () => {
            console.log(this.state.chosenImages);
            this.closeOverlay();
        })
    }
    clearSelection = () => {
        this.setState({chosenImages: []})
    }
    updatePhoto = () => {
        const photoNumberArray = [...this.state.chosenImages];
        
        let object = {
            chooserCount: '',
            choosers: [],
        };
        this.thanks();
        photoNumberArray.forEach(photoNumber => {
            Database.getData(parseInt(photoNumber)).then(res => {
                console.log(res);
                object.chooserCount = res[0].chooserCount + 1;
                object.choosers = res[0].choosers
                object.choosers.push(this.state.userIPAddress);

                Database.updateData(parseInt(photoNumber), object).then(res => {
                    this.thanks('done');
                }).catch(error => {
                    console.log('error');
                    setTimeout(() => {
                        this.error();
                    }, 2500)
                })
            }).catch(error => {
                setTimeout(() => {
                    this.error();
                }, 2500)
            })
        })
        Database.getUserList().then(res => {
            console.log(res);
            let users = res[0].users;
            users.push(this.state.userIPAddress);
            const object = {
                users: users
            }
            Database.updateUserList(object).then(res => {
                console.log(res);
            }).catch(error => {
                console.log(error);
            })
        }).catch(error => {
            console.log(error);
        })
    }
    thanks = (done) => {
        document.querySelector('.image-grid').style.display = 'none';
        document.querySelector('.loading').style.display = 'block';
        if (done === 'done') {
            document.querySelector('.thanks').style.display = 'block';
            document.querySelector('.loading').style.display = 'none';
        }
    }
    error = () => {
        document.querySelector('.image-grid').style.display = 'none';
        document.querySelector('.loading').style.display = 'none';
        document.querySelector('.error').style.display = 'block';
    }
    reset = () => {
        this.clearSelection();
        document.querySelector('.image-grid').style.display = 'block';
        document.querySelector('.loading').style.display = 'none';
        document.querySelector('.thanks').style.display = 'none';
    }
    cantVote = () => {
        document.querySelector('.cant-vote').style.display = 'block';
        document.querySelector('.image-grid').style.display = 'none';
    }
    componentDidMount = () => {
        if (this.state.chosenImages.length >= 5) {
            this.setState({selectButton: 'לא ניתן לבחור'})
        }
        fetch('https://api.ipify.org/?format=json').then(result => result.json()).then(data => {
             this.setState({userIPAddress: data.ip})
        })
        Database.getData().then(res => {
            let urls = [];
            res.forEach(item => {
                if (!item.item) {
                    urls.push(item.url);
                }
            })
            this.setState({downloadLink: urls});
        })
        // this.setState({chosenImages: [1, 2, 3, 4, 5]})
    }
    render() {
        Database.getData().then(async (res) => {
            const users = [...res[res.length -  1].users];
            let count = 0;
            let userIPAddress = '';
            await fetch('https://api.ipify.org/?format=json').then(result => result.json()).then(data => {
                userIPAddress = data.ip;
                console.log(data.ip)
            })
            users.forEach(user => {
                console.log(user)
                console.log(userIPAddress)
                if (user == userIPAddress) {
                    count++;
                }
            })
            if (count >= 5) {
                this.cantVote();
            }
        })
        document.querySelectorAll('.img-container img').forEach(pic => {
            pic.classList.remove('chosen');
        })
        this.state.chosenImages.forEach((pic, index) => {
            document.querySelectorAll('.image-box img')[parseInt(pic) - 1].classList.add('chosen');
        })
        return(
            <div className='App'>
                <div className='image-grid'>
                    <div className='overlay'>
                        <IconButton classes={{root: 'close-button'}} onClick={this.closeOverlay}>&#10005;</IconButton>
                        <img alt='' className='overlay-img'></img>
                        <h3 className='overlay-text'>
                            
                        </h3>
                        <div className='overlay-buttons'>
                            <Button variant='contained' classes={{root: (this.state.selectButton === 'לא ניתן לבחור' ? 'disabled' : '')}} color={this.state.selectButton === 'בחירת תמונה' ? 'primary' : 'secondary'} onClick={() => this.chooseImage(this.state.currentImage)}>{this.state.selectButton}</Button>
                        </div>
                        <div className='close-div' onClick={this.closeOverlay}></div>
                    </div>
                    <div className='img-container'>
                        <ImageBox imgClass='1' src='1.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='2' src='2.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='3' src='3.jpg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='4' src='4.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='5' src='5.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='6' src='6.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='7' src='7.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='8' src='8.jpg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='9' src='9.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='10' src='10.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='11' src='11.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='12' src='12.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='13' src='13.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='14' src='14.jpg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='15' src='15.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='16' src='16.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='17' src='17.jpg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='18' src='18.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='19' src='19.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                        <ImageBox imgClass='20' src='20.jpeg' onClickImg={(e) => this.imgClickHandler(e)} onClickButton={this.chooseImage} chosenImages={this.state.chosenImages}/>
                    </div>
                    <h3 className='selected-images'>
                        תמונות שנבחרו:<br />
                        {this.state.chosenImages.length} מתוך 5
                    </h3>
                    <div className='after-buttons'>
                    <Button variant='contained' onClick={this.updatePhoto}className={this.state.chosenImages.length < 1 ? 'disabled' : ''}>שליחה</Button>
                    <Button variant='contained' color='secondary' className={this.state.chosenImages.length === 0 ? 'disabled' : ''} onClick={this.clearSelection}>איפוס בחירה</Button>
                </div>
                </div>
                <div className='loading'>
                    <h1>טוען...</h1>
                </div>
                <div className='thanks'>
                    <h1>תודה על ההשתתפות!</h1>
                    <Button variant='contained' color='primary' onClick={this.reset}>להצבעה חוזרת</Button>
                </div>
                <div className='error'>
                    <h2>אירעה תקלה בחיבור לשרת</h2>
                    <h3>אנא נסו שנית מאוחר יותר</h3>
                </div>
                <div className='cant-vote'>
                    <h1>
                        אין אפשרות להצביע<br />
                        מעל 5 פעמים.
                    </h1>
                    <h2>תודה על ההשתתפות!</h2>
                </div>
            </div>
        )
    }
}

export default Main;
