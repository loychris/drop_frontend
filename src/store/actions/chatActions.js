import axios from 'axios';

import * as actionTypes from '../actions/actionTypes';

export const setChatStateOnLogin = (userdata) => {
    return {
        type: actionTypes.SET_CHAT_STATE_ON_LOGIN,
        userdata
    }
}

//--------- FETCH CHAT -----------------------------------------

export const fetchChat = (chatId, token) => {
    return dispatch => {
        dispatch(fetchChatStart())
        const headers = { headers: { authorization : `Bearer ${token}` } }
        axios.get(`/api/chat/${chatId}`, headers)
        .then(response => {
            console.log(response);
            dispatch(fetchChatSuccess(response.data.chat))
        }).catch(err => {
            console.log(err)
            dispatch(fetchChatFailed())
        })
    }
}

export const fetchChatStart = () => {
    return {
        type: actionTypes.FETCH_CHAT_START,
    }
}

export const fetchChatSuccess = () => {
    return {
        type: actionTypes.FETCH_CHAT_SUCCESS,
    }
}

export const fetchChatFailed = () => {
    return {
        type: actionTypes.FETCH_CHAT_FAILED,
    }
}

//--------- FETCH CHATS -----------------------------------------

export const fetchChats = (token, userId) => {
    return dispatch => {
        dispatch(fetchChatsStart())
        const headers = { headers: { authorization : `Bearer ${token}` } }
        axios.get(`/api/chat/chats`, headers)
        .then(response => {
            dispatch(fetchChatsSuccess(response.data, userId))
        }).catch(err => {
            console.log(err)
            dispatch(fetchChatsFailed())
        })
    }
}

export const fetchChatsStart = () => {
    return {
        type: actionTypes.FETCH_CHATS_START,
    }
}

export const fetchChatsSuccess = (chats, userId) => {
    return {
        type: actionTypes.FETCH_CHATS_SUCCESS,
        chats, 
        userId
    }
}

export const fetchChatsFailed = () => {
    return {
        type: actionTypes.FETCH_CHATS_FAILED,
    }
}

//--------- FETCH FRIENDS ----------------------------------------------------------

export const fetchFriends = (ids, token) => {
    return dispatch => {
        dispatch(fetchFriendsStart());
        const body = { userIds: ids }
        const headers = { headers: { authorization : `Bearer ${token}` } }
        axios.post('/api/users/userdata', body, headers)
        .then(response => {
            dispatch(addNewUsers(response.data));
            dispatch(fetchFriendsSuccess(response.data));
        }).catch(err => {
            dispatch(fetchFriendsFailed())
        })
    }
}

export const fetchFriendsStart = () => {
    return {
        type: actionTypes.FETCH_FRIENDS_START,
    }
}

export const fetchFriendsSuccess = (friends) => {
    return {
        type: actionTypes.FETCH_FRIENDS_SUCCESS,
        friends
    }
}

export const fetchFriendsFailed = () => {
    return {
        type: actionTypes.FETCH_IDS_FAILED
    }
}

//--------- FETCH FRIEND REQUESTS -----------------------------------------------

export const fetchFriendRequests = (token) => {
    return dispatch => {
        dispatch(fetchFriendRequestsStart());
        const headers = { headers: { authorization: `Bearer ${token}` } }  
        axios.get(
            '/api/users/friendRequests',
            headers
        )
        .then(response => {
            dispatch(addNewUsers(response.data));
            dispatch(fetchFriendRequestsSuccess(response.data));
        }).catch(err => {
            dispatch(fetchFriendRequestsFailed())
        })
    }
}

export const fetchFriendRequestsStart = () => {
    return {
        type: actionTypes.FETCH_FIREND_REQUESTS_START,
    }
}

export const fetchFriendRequestsSuccess = (users) => {
    return {
        type: actionTypes.FETCH_FIREND_REQUESTS_SUCCESS,
        users
    }
}

export const fetchFriendRequestsFailed = () => {
    return {
        type: actionTypes.FETCH_FIREND_REQUESTS_FAILED
    }
}

//--------- FETCH ALL USERS ---------------------------------------------------

export const fetchAllUsers = () => {
    return dispatch => {
        dispatch(fetchAllUsersStart());
        axios.get('/api/users')
        .then(response => {
            dispatch(addNewUsers(response.data));
            dispatch(fetchAllUsersSuccess(response.data))
        }).catch(err => {
            dispatch(fetchAllUsersFailed())
        })
    }
}

export const fetchAllUsersStart = () => {
    return {
        type: actionTypes.FETCH_ALL_USERS_START,
    }
}

export const fetchAllUsersSuccess = (users) => {
    return {
        type: actionTypes.FETCH_ALL_USERS_SUCCESS,
        users, 
    }
}

export const fetchAllUsersFailed = () => {
    return {
        type: actionTypes.FETCH_ALL_USERS_FAILED
    }
}



//--------- SEND MESSAGE -------------------------------------------------------

export const sendMessage = (message, chatId, newChat) => {
    return dispatch => {
        dispatch(sendMessageStart());
        if(newChat){
            dispatch(sendNewChat())
        }else{
            axios.post('')
            .then(response => {
                dispatch(sendMessageSuccess());
            })
            .catch(err => {
                dispatch(sendMessageFailed())
            })
        }
    }
}

export const sendMessageStart = () => {
    return {
        type: actionTypes.SEND_MESSAGE_START
    }
}

export const sendMessageSuccess = () => {
    return {
        type: actionTypes.SEND_MESSAGE_SUCCESS
    }
}

export const sendMessageFailed = () => {
    return {
        type: actionTypes.SEND_MESSAGE_FAILED
    }
}

//--------- SEND FRIEND REQUEST -------------------------------------------

export const sendFriendRequest = (friendId, token) => {
    return dispatch => {
        dispatch(sendFriendRequestStart(friendId))
        const headers = { headers: { authorization : `Bearer ${token}` } }
        axios.post('/api/users/addFriend', { friendId }, headers)
        .then(response => {
            dispatch(sendFriendRequestSuccess(friendId))
        }).catch(err => {
            console.log(err)
            dispatch(sendFriendRequestFailed(friendId))
        })
    }
}

export const sendFriendRequestStart = (friendId) => {
    return {
        type: actionTypes.SEND_FRIEND_REQUEST_START,
        friendId
    }
}

export const sendFriendRequestSuccess = (friendId) => {
    return {
        type: actionTypes.SEND_FRIEND_REQUEST_SUCCESS,
        friendId
    }
}

export const sendFriendRequestFailed = (friendId) => {
    return {
        type: actionTypes.SEND_FRIEND_REQUEST_FAILED,
        friendId
    }
}

//--------- ACCEPT FIREND REQUEST -----------------------------------------

export const acceptFriendRequest = (friendId, token) => {
    return dispatch => {
        console.log('FRIEND ID', friendId)
        dispatch(acceptFriendRequestStart(friendId))
        const headers = { headers: { authorization : `Bearer ${token}` } }
        const body = { friendId: friendId };
        axios.post('/api/users/acceptFriendRequest', body, headers)
        .then(res => {
            dispatch(acceptFriendRequestSuccess(res.data.name, res.data.handle, res.data.userId))
        }).catch(err => {
            console.log(err)
            dispatch(acceptFriendRequestFailed(friendId))
        })
    }
}

export const acceptFriendRequestStart = (userId) => {
    return {
        type: actionTypes.ACCEPT_FRIEND_REQUEST_START,
        userId
    }
}

export const acceptFriendRequestSuccess = (name, handle, userId) => {
    return {
        type: actionTypes.ACCEPT_FRIEND_REQUEST_SUCCESS,
        name, 
        handle, 
        userId
    }
}

export const acceptFriendRequestFailed = (friendId) => {
    return {
        type: actionTypes.ACCEPT_FRIEND_REQUEST_FAILED,
        friendId
    }
}

//---- CHAT FORM INPUT ----------------------------------------------------

export const saveChatInput = (chatId, value) => {
    return {
        type: actionTypes.SAVE_CHAT_INPUT,
        chatId,
        value
    }
}

export const setChatFormHeight = (height) => {
    return {
        type: actionTypes.SET_CHAT_FORM_HEIGHT,
        height
    }
}

export const setChatInput = (value) => {
    return {
        type: actionTypes.SET_CHAT_INPUT,
        value
    }
}

export const changeFormHeight = (height) => {
    return {
        type: actionTypes.CHANGE_FORM_HEIGHT,
        height
    }
}

export const chatInputChangeHandler = (value) => {
    return {
        type: actionTypes.CHANGE_CHAT_INPUT,
        value
    }
}


//--------- NEW CHAT -----------------------------------------------------------

export const sendNewChat = (friendId, message) => {
    return dispatch => {
        dispatch(sendNewChatStart());
        const body = {
            group: false,
            members: [friendId],
            message: message
        };
        const token = localStorage.getItem('token');
        const headers = { headers: { authorization: `Bearer ${token}` } }  
        axios.post('api/chat', body, headers)
        .then(res => {
            dispatch(sendNewChatSuccess());
        }).catch(err => {
            dispatch(sendNewChatFailed());
            console.log(err)
        })
    }
}

export const sendNewChatStart = () => {
    return {
        type: actionTypes.SEND_NEW_CHAT_START,
    }
}

export const sendNewChatSuccess = () => {
    return {
        type: actionTypes.SEND_MESSAGE_SUCCESS,
    }
}

export const sendNewChatFailed = () => {
    return {
        type: actionTypes.SEND_NEW_CHAT_FAILED,
    }
}

//--------- ADD DUMMY CAHT -----------------------------------------------------

export const createDummyChat = (userId, name) => {
    return {
        type: actionTypes.CREATE_DUMMY_CHAT,
        userId, 
        name
    }
}

export const changeChat = (chatId) => {
    return {
        type: actionTypes.CHANGE_CHAT,
        chatId
    }
}

//--------- RESET CHAT -----------------------------------------------------


export const addNewUsers = (users) => {
    return {
        type: actionTypes.ADD_NEW_USERS,
        users
    }
}