import Axios from './axios';

const axios = Axios;
const resource = '/account';

export default {
    async login(userdata) {
        axios.post('http://localhost:8000/api/v1/account/login', userdata, {
            params: {
                username: userdata.username,
                password: userdata.password
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        })
        .then(response => {
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        })
    }
}