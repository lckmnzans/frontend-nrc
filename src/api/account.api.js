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
    register: (userdata) => {
        return {
            method: 'POST',
            url: 'http://localhost:8000/api/v1/account/register',
            data: userdata,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
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
            method: 'GET',
            url: 'http://localhost:8000/api/v1/account',
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    approveRequest: (id, user, isApproved) => {
        let url = `http://localhost:8000/api/v1/account/approve-reset/${id}`;
        if (isApproved) {
           url = url + '?approved=true';
        }
        return {
            method: 'POST',
            url: url,
            data: user,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    changePassword: (username, oldPassword, newPassword) => {
        return {
            method: 'PATCH',
            url: 'http://localhost:8000/api/v1/account',
            data: {
                "username": username,
                "oldPassword": oldPassword,
                "newPassword": newPassword
            },
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }
}