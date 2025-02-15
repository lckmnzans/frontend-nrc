const ApiHost = process.env.VUE_APP_BACKEND_URL || '';
export default {
    ApiHost,
    login: (userdata) => {
        return {
            method: 'POST',
            url: `/api/v1/account/login`,
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
            url: `/api/v1/account/register`,
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
    getAccount: (id) => {
        return {
            method: 'GET',
            url: `/api/v1/account/${id}`,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    getAllAccounts: () => {
        return {
            method: 'GET',
            url: `/api/v1/account`,
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    },
    forgotRequest: (userdata) => {
        return {
            method: 'POST',
            url: `/api/v1/account/request-reset`,
            data: {
                username: userdata.username,
                email: userdata.email
            }
        }
    },
    approveRequest: (userdata, isApproved) => {
        let url = `/api/v1/account/approve-reset/${userdata._id}`;
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
        const url = `/api/v1/account/reset-pass?token=${token}`;
        return {
            method: 'POST',
            url: url,
            data: {
                otp: userdata.otp,
                newPassword: userdata.newPassword
            }
        }
    },
    updateAccount: (userid, userdata, requestChange) => {
        const url = `/api/v1/account/${userid}`;
        if (requestChange == 'pass') {
            return {
                method: 'PATCH',
                url: url + '?requestChange=pass',
                data: {
                    'username': userdata.username,
                    'oldPassword': userdata.oldPassword,
                    'newPassword': userdata.newPassword
                },
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        } else if (requestChange == 'role') {
            return {
                method: 'PATCH',
                url: url + '?requestChange=role',
                data: {
                    'username': userdata.username,
                    'email': userdata.email,
                    'role' : userdata.role
                },
                headers: {
                    'authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
        }
    },
    deleteAcc: (userdata) => {
        return {
            method: 'DELETE',
            url: `/api/v1/account`,
            data: {
                'username': userdata.username,
                'email': userdata.email
            },
            headers: {
                'authorization': 'Bearer ' + localStorage.getItem('token')
            }
        }
    }
}