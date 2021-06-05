import {Container, Form, Button} from 'react-bootstrap'
import ReactLoading from 'react-loading'
import React, {useState} from 'react'
import {sign} from './context/action'
import {useHistory} from 'react-router-dom'
const SignPage = ()=> {

  const [email, setEmail] = useState("")
  const [id, setId] = useState("")
  const [password, setPassword] = useState("")
  const [exists, setExists] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const history = useHistory()

  const validForm = () =>{
    if(email.length === 0 || id.length === 0 || password.length === 0) {
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    if(!validForm()){
      return;
    }
    setLoading(true) 
    try{
      let res = await sign({'username':id, 'password':password, 'email':email})
      if(res.status === 201) {
        setLoading(false)
        setExists(false)
        history.push('/login')
      }
      else{
        setLoading(false)
        setExists(true)
      }
        
    }catch(e){
      setExists(true)
    }
  }
  return(
    <>
      {(isLoading) ?
      <Container fluid className = 'd-flex justify-content-center'>
          <ReactLoading type={"bars"} color={"grey"} />
      </Container>
        : 
        <Container className='mt-3 w-25'>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control value = {email} type="email" placeholder="Enter email" onChange = {(e) => setEmail(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicId">
              <Form.Label>Account ID</Form.Label>
              <Form.Control value = {id} onChange = {(e) => setId(e.target.value)} type="text" placeholder="ID" />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control value = {password} onChange = {(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckbox">
            </Form.Group>
            <Button block size = 'lg' variant="warning" onClick = {handleSubmit}>
              Sign
            </Button>
            {(!exists)? "" : "ID or Email already exist"}
          </Form>
      </Container>
      }
      </>
  )
}

export default SignPage;