const ApiHost = process.env.VUE_APP_BACKEND_URL;
export default {
    login: (userdata) => {
        return {
            method: 'POST',
            url: `${ApiHost}/account/login`,
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
            url: `${ApiHost}/account/register`,
            data: {
                username: userdata.username,
                email: userdata.email,
                role: userdata.role,
                password: userdata.password,
                password2: userdata.password2
            },
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    forgot: (userdata) => {
        return {
            method: 'POST',
            url: `${ApiHost}/account/request-reset`,
            data: {
                username: userdata.username,
                email: userdata.email
            }
        }
    },
    getAccount: (id) => {
        return {
            method: 'GET',
            url: `${ApiHost}/account/${id}`,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    getAllAccounts: () => {
        return {
            method: 'GET',
            url: `${ApiHost}/account`,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    approveRequest: (userdata, isApproved) => {
        let url = `${ApiHost}/account/approve-reset/${userdata._id}`;
        if (isApproved) {
           url = url + '?approved=true';
        }
        return {
            method: 'POST',
            url: url,
            data: {
                username: userdata.username,
                email: userdata.email
            },
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    resetPassword: (userdata, token) => {
        const url = `${ApiHost}/account/reset-pass?token=${token}`;
        return {
            method: 'POST',
            url: url,
            data: {
                otp: userdata.otp,
                newPassword: userdata.newPassword
            }
        }
    },
    changePassword: (userdata) => {
        return {
            method: 'PATCH',
            url: `${ApiHost}/account`,
            data: {
                'username': userdata.username,
                'oldPassword': userdata.oldPassword,
                'newPassword': userdata.newPassword
            },
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }
}