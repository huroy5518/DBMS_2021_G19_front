import axios from "axios"
import { locationsAreEqual } from "history"

export const getSearch = async (inputFruitName, selectMonth, lowest, highest, season, locations) => {
    const searchURL = 'http://140.113.138.236:8000/fruit/search'
    try{
        let res = await axios.post(
            searchURL,
            {
                id:"",
                name: inputFruitName,
                months:(selectMonth.length >= 0)? selectMonth:null,
                location: locations,
                lowest: lowest,
                highest: highest,
            }
        )
        if(res.status === 200) {
            return res
        }else {
            return {status: 404}
        }

    }catch(e) {
        console.log(e)
        return {status:404}
    }
}
export async function getFavorite(dispatch, token) {
    dispatch({type:"LOADING"})
    let favorite = await axios.get('http://140.113.138.236:8000/follow',
        {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
    )
    if(favorite.data){
        const tmp_set = new Set()
        for(let i in favorite.data) {
            tmp_set.add(favorite.data[i].id)
        }
        dispatch({type:"SET_FAVORITE", payload: favorite.data, favorite_id: tmp_set})
        dispatch({type:"NOT_LOADING"})
    }
    return

}

export async function loginUser(dispatch, username, password) {
    try{
        const loginURL = 'http://140.113.138.236:8000/auth/login'
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
            dispatch({type: 'LOGIN_SUCCESS', payload: res.data})
            localStorage.setItem('token', res.data.access_token)
            return res
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
const signURL = 'http://140.113.138.236:8000/auth/register'
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
