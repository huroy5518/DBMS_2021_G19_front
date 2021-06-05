import logo from './logo.svg'
import './App.css';
import NavbarS from './components/NavbarS'
import BodyS from './components/BodyS'
import LoginPage from './components/LoginPage'
import SignPage from './components/SignPage'
import FruitPage from './components/FruitPage'
import Favorite from './components/Favorite'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useHistory} from 'react-router-dom'
import {AuthProvider} from './components/context/context'


function App() {
  // const history = useHistory()
  // const nextPath = (path)=> {
  //   history.push(path)
  // }
  // const [user,dispatch] = useReducer(AuthReducer, initialState)
  const history = useHistory()
  return (
    <AuthProvider>
      <Router history = {history}>
        <NavbarS/>
        <Switch>
          <Route path = '/login' component = {LoginPage}/>,
          <Route path = '/sign' component = {SignPage}/>,
          <Route path = '/favorite' component = {Favorite}/>,
          <Route exact path='/' component = {BodyS}/>,
          <Route path = '/id/:id' component = {FruitPage}/>,
        </Switch>
      </Router>
     </AuthProvider>
  );
}

export default App;
