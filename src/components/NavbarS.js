import { Navbar } from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import {useHistory} from 'react-router-dom'
import {useAuthState} from './context/context'
import {useAuthDispatch} from './context/context'
import {logout} from './context/action'

function NavbarS(props) {
    const history = useHistory()
    const dispatch = useAuthDispatch()
    const {isLogin, userData} = useAuthState()
    const nextPath = (path) => {
        history.push(path)
    }


    const handleLogout = () => {
        logout(dispatch)
    }
    
    return(
        <Navbar bg='warning' expend = 'lg'>
            <Navbar.Brand href="/">
                <h3 className = 'mt-2'>FruitHub</h3>
            </Navbar.Brand>
            <Navbar.Toggle/>
            <Navbar.Collapse className = 'justify-content-end'>
                {(isLogin) ? <h4 className = 'mt-2'>{userData}</h4>:""}
                {(isLogin) ? (<Button variant = 'primary-text' onClick = {() => {nextPath('/favorite')}} className = 'mr-2'> 收藏 </Button>) : (<Button variant = 'primary-text' href = "Sign" className = 'mr-2'> 註冊 </Button>)}
                {(isLogin) ? (<Button variant = 'primary-text' onClick = {() => {handleLogout()}} className = 'mr-2'> 登出 </Button>) : (<Button variant = 'primary-text' href = "Login" className = 'mr-2'>登入</Button>)}
                
            </Navbar.Collapse>       
        </Navbar>
    )
}

export default NavbarS