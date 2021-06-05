import React, {useState} from 'react'
import {Container, Form, Button} from 'react-bootstrap'
import {loginUser} from './context/action'
import {useAuthDispatch, useAuthState} from './context/context'
import {useHistory} from 'react-router-dom'
import ReactLoading from 'react-loading'
const LoginPage = ()=> {

  const [username, setId] = useState("");
  const [password, setPassword] = useState("")
  const [wrong, setWrong] = useState(false);
  const history = useHistory()
  const [isLoading, setLoading] = useState(false)

  const dispatch = useAuthDispatch()
  const validForm = () => {
    return password.length > 0 && username.length > 0;
  }
  const handleSubmit = async (e) => {
    if(!validForm()){
      return;
    }
    setLoading(true)
    try{
      let res = await loginUser(dispatch, username, password)
      if(res.status === 200) {
        history.push('/')
        setLoading(false)
        setWrong(false)
      }else {
        setLoading(false)
        setWrong(true)
      }
    }catch(e){
      console.log(e)
    }

    // const url = "http://192.168.88.248:8000/auth/login"
    // const data = {"username" : username, "password" : password}
    // let res;
    // axios.post(url,
    //   `username=${username}&password=${password}`,
    //   {
    //     headers:
    //     {'Content-Type': 'application/x-www-form-urlencoded',
    //       // 'Authorization': `Bearer ${token}`
    //     }
    // })
    // .then(res => {
    //   console.log(res)
    // })
    // .catch(e => console.log(e))
  }

  return(
      <Container className='mt-3 w-25'>
          {(isLoading) ? 
            <Container fluid className = 'd-flex justify-content-center'>
                <ReactLoading type={"bars"} color={"grey"} />
            </Container>
          :
            <Form>
              <Form.Group className="mb-3" controlId="id">
                <Form.Label>Account ID</Form.Label>
                <Form.Control value = {username} onChange = {(e) => setId(e.target.value)} type="text" placeholder="ID" />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control value = {password} onChange = {(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
              </Form.Group>
              <Button block size = 'lg' variant="warning" onClick = {handleSubmit}>
                login
              </Button>
            </Form>
          }
          {(wrong && !isLoading)?<h4 align='center' className = 'mt-4'>帳號或密碼錯誤</h4>:""}
      </Container>
  )
}

export default LoginPage;