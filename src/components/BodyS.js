import { Container } from 'react-bootstrap'
import SearchMS from './SearchMS'
import SearchBar from './SearchBar'
import './BodyS.css'

function BodyS() {
    return (
        <Container>
            <h2 className='ml-3 mt-3 mb-3'>找到理想水果</h2>
            <SearchBar/>
        </Container>
    )
}

export default BodyS
