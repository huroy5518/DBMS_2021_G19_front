
let token_text = localStorage.getItem("token")
? localStorage.getItem("token")
: ""


export const initialState = {
    userData: (token_text !== "")?JSON.parse(atob(token_text.split('.')[1])).username:"",
    token: ""||token_text,
    loading: false,
    errorMessage: null,
    isLogin: token_text !== "",
    favorite: [],
    favorite_id: new Set()
}

export const AuthReducer = (initialState, action) => {
    switch(action.type) {
        case "LOADING":
            return {
                ...initialState,
                loading: true
            }
        case "USER_LOGIN":
            return {
                ...initialState,
                loading: true
            }
        case "LOGIN_SUCCESS":
            return {
                ...initialState,
                userData: JSON.parse(atob(action.payload.access_token.split('.')[1])).username,
                token: action.payload.access_token,
                loading: false,
                isLogin:true
            }
        case "LOGOUT":
            return {
                ...initialState,
                userData: "",
                token: "",
                isLogin:false,
                favorite: [],
                favorite_id: new Set()
            }
        case "LOGIN_ERROR":
            return {
                ...initialState,
                loading: false,
                errorMessage: action.error
            }
        case "NOT_LOADING":
            return {
                ...initialState,
                loading: false,
            }
        case "SET_FAVORITE":
            return {
                ...initialState,
                favorite: action.payload.favorite,
                favorite_id: action.newSet
            }
        default:
            throw new Error("can't handle submit")
    }
}