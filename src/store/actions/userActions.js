import axios from 'axios';

import * as actionTypes from './actionTypes';
import { setDropsNotLoaded } from './streamActions';
import { closeMenu } from './UIActions';
import { fetchFriends, fetchFriendRequests, fetchChats, setChatStateOnLogin } from './chatActions';

export const openAuth = (authReason) => {
    return {
        type: actionTypes.OPEN_AUTH,
        authReason
    }
}

export const closeAuth = () => {
    return {
        type: actionTypes.CLOSE_AUTH
    }
}

export const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000)
    }
}

export const logout = () => {
    return {
        type: actionTypes.USER_LOGOUT
    }
}

export const loginStart = () => {
    return {
        type: actionTypes.LOGIN_START
    };
};


export const loginFail = (message) => {
    return {
        type: actionTypes.LOGIN_FAIL,
        error: message ? message : 'Something went wrong'
    }
}

export const login = (identifier, password) => {
    return dispatch => {
        dispatch(loginStart())
        axios.post(
            '/api/users/login', 
            JSON.stringify({
                identification: identifier,
                password: password
            }), 
            { headers: { 'Content-Type': 'application/json' } }
        ).then(res => {
            const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('user', JSON.stringify({
                userId: res.data.userId,
                friends: res.data.friends, 
                friendRequests: res.data.friendRequests,
                sentFriendRequests: res.data.sentFriendRequests,
                email: res.data.email
            }));
            dispatch(authSuccess(res.data));
            dispatch(checkAuthTimeout(res.data.expiresIn));
            dispatch(setDropsNotLoaded());
            dispatch(setChatStateOnLogin(res.data))
            dispatch(closeMenu());
            if(res.data.friends ?? res.data.friends.length > 0){
                dispatch(fetchFriends(res.data.friends));
            }
            if(res.data.friendRequests ?? res.data.friendRequests.length > 0){
                dispatch(fetchFriendRequests(res.data.token));
            }
            if(res.data.chats ?? res.data.chats.length > 0){
                dispatch(fetchChats(res.data.token, res.data.userId));
            }
        }).catch(err => {
            if(err.response && err.response.data && err.response.data.message){
                dispatch(loginFail(err.response.data.message));
            }else {
                dispatch(loginFail("Check your connection, bro"))
            }
        })
    }
}

export const signup = (name, email, handle, password, profilePic) => {
    return dispatch => {
        dispatch(signupStart())
        const url = '/api/users/signup';
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('handle', handle);
        formData.append('password', password);
        formData.append('profilePic', profilePic)
        axios({
            method: 'post',
            url: url, 
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then(res => {
            console.log(res.data);
            const expirationDate = new Date(new Date().getTime() + res.data.expiresIn * 1000);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('user', JSON.stringify({
                userId: res.data.userId,
                friends: res.data.friends, 
                friendRequests: res.data.friendRequests,
                email: res.data.email
            }));                
            dispatch(authSuccess(res.data));
            dispatch(setDropsNotLoaded());
            dispatch(setChatStateOnLogin(res.data))
            dispatch(closeMenu());
        }).catch(err => {
            console.log(err)
            dispatch(signupFail(err.response));
        })
    }
}

export const signupStart = () => {
    return {
        type: actionTypes.SIGNUP_START
    }
}

export const authSuccess = (responseData) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        ...responseData
    }
}

export const signupFail = (response) => {
    return {
        type: actionTypes.SIGNUP_FAIL,
        error: response && response.data && response.data.message ? response.data.message : 'Something went wrong'
    }
}

export const authCheckState = () => {
    return dispatch => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch(logout());
            dispatch(setDropsNotLoaded());
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if (expirationDate <= new Date()) {
                dispatch(logout());
            } else {
                const userId = localStorage.getItem('userId');
                dispatch(authSuccess(userId, token));
                dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
            }   
        }
    };
};