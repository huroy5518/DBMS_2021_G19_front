import axios from "axios"

const loginURL = 'http://192.168.88.248:8000/auth/login'

export async function loginUser(dispatch, username, password) {
    try{
        dispatch({type:'LOADING'})
        let res = await axios.post(
            loginURL,
            `username=${username}&password=${password}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    // 'Authorization': `Bearer ${token}`
                }
            }
        )
        if(res.status === 200) {
            let token = res.data.access_token
            let favorite = await axios.get('http://192.168.88.248:8000/follow',
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                }
            }
            )
            dispatch({type: 'LOGIN_SUCCESS', payload: res.data})
            if(favorite.data){
                const tmp_set = Set()
                for(let i in favorite.data) {
                    tmp_set.add(i.id)
                }
                dispatch({type:"SET_FAVORITE", payload: favorite.data, favorite_id: tmp_set})
                
            }
            localStorage.setItem('token', res.data.access_token)
        }
        dispatch({type: 'LOGIN_ERROR', error: res.data})
        return res
    }catch(e) {
        console.log(e)
        return Object({status: 401})
    }
}
export async function logout(dispatch) {
    dispatch({type: 'LOGOUT'});
    localStorage.removeItem('token');
}
const signURL = 'http://192.168.88.248:8000/auth/register'
export async function sign(dataSend) {
    try{
        let res = await axios.post(
            signURL,
                {
                username: dataSend.username,
                email: dataSend.email,
                password: dataSend.password
            }
            
        )
        return res
    }catch(e){
        return {status:405}
    }
}