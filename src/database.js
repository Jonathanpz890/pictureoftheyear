import axios from 'axios';

const baseURL = 'https://idf-api.azurewebsites.net';
// const baseURL = 'http://localhost:5000';

const submitData = (object) => {
    return new Promise(resolve => {
        axios.post(`${baseURL}/database/add`, {
            database: 'miniprojects',
            collection: 'photoOfTheYear',
            object,
        }).then(res => {
            resolve(res)
        }).catch(error => {
            console.log(error);
        }); 
    })
    
}
const getData = (photoNumber) => {
    return new Promise(resolve => {
        axios.post(`${baseURL}/database/get`, {
            database: 'miniprojects',
            collection: 'photoOfTheYear',
            query: {photoNumber}
          })
          .then(function (response) {
            resolve(response.data);
            
          })
          .catch(function (error) {
            resolve(error);
        });
    })
}
const updateData = (photoNumber, object) => {
    return new Promise(resolve => {
        axios.post(`${baseURL}/database/update`, {
            database: 'miniprojects',
            collection: 'photoOfTheYear',
            query: {photoNumber},
            object
        }).then(res => {
            resolve(res);
        }).catch(error => {
            resolve(error);
        })
    })
}
const getUserList = () => {
    return new Promise(resolve => {
        axios.post(`${baseURL}/database/get`, {
            database: 'miniprojects',
            collection: 'photoOfTheYear',
            query: {item: 'user-list'}
        }).then(res => {
            resolve(res.data);
        }).catch(error => {
            resolve(error);
        })
    })
}
const updateUserList = (object) => {
    return new Promise(resolve => {
        axios.post(`${baseURL}/database/update`, {
            database: 'miniprojects',
            collection: 'photoOfTheYear',
            query: {item: 'user-list'},
            object
        }).then(res => {
            resolve(res)
        }).catch(error => {
            console.log(error);
        })
    })
}
export default {submitData, getData, updateData, getUserList,  updateUserList};