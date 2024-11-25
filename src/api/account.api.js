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
    register: (userdata) => {},
}