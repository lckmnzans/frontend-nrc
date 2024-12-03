export default {
    login: (userdata) => {
        return {
            method: 'POST',
            url: 'http://localhost:8000/api/v1/account/login',
            data: {
                username: userdata.username,
                password: userdata.password
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded'
            }
        }
    },
    forgot: (userdata) => {
        return {
            method: 'POST',
            url: 'http://localhost:8000/api/v1/account/request-reset',
            data: {
                username: userdata.username,
                email: userdata.email
            },
            headers: {
                'content-type': 'application/json'
            }
        }
    },
    getAllAccounts: () => {
        return {
            methos: 'GET',
            url: 'http://localhost:8000/api/v1/account',
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }
}