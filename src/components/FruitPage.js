import {useEffect, useState} from 'react'
import {Container, Row, Badge} from 'react-bootstrap'
import {useAuthState} from './context/context'
import axios from 'axios'
import ReactLoading from 'react-loading'

const FruitPage = (props) => {
    const fruitId = props.match.params.id
    const [Loading, setLoading] = useState(true)
    const [fruitData, setFruitData] = useState({})
    const [notFound, setNotFound] = useState(false)
    const {isLogin, favorite_id} = useAuthState()

    const URL = 'http://192.168.88.248:8000/fruit/' + fruitId
    async function getdata() {
        try{

            let res = await axios.get(URL)
            if(res.status === 200)
                return res
            else {
                return {status:404}
            }
        }catch(e) {
            console.log(e)
            return {status:404}
        }
    }
    useEffect(() => {
        let op = getdata()
        // console.log(res)
        op.then(
            (res)=>{
                if(res.status === 404){
                    setNotFound(true)
                    setLoading(false)
                    return
                }
                setFruitData(res.data)
                setLoading(false)
                setNotFound(false)
            }
        ).catch(e => console.log(e))
    }, [])
    if(notFound) {
        return (
            <h1 align='center'>無此水果</h1>
        )
    }
    if(Loading || fruitData === {}) {
        console.log(fruitData)
        return (
            <Container fluid className = 'd-flex justify-content-center'>
                <ReactLoading type={"bars"} color={"grey"} />
            </Container>
        )
    }
    const handleFavoriteAdd = () => {
        return
    }
    const handleFavoriteRemove = () => {
        return
    }

    return (
        <>
            {(fruitData === {})?
                <Container fluid className = 'd-flex justify-content-center'>
                    <ReactLoading type={"bars"} color={"grey"} />
                </Container>
            :<Container>
                <h1 className = 'mt-2'>{fruitData.name}</h1>
                <Container>
                    <Row>
                        <h5>盛產季節</h5>
                        {fruitData.months.map(month=>{
                                return (
                                <Badge pill variant='warning' className = 'ml-2 mb-2 pt-2' key = {month}>{month}月</Badge>
                            )
                        })
                        }
                        {
                         (isLogin && favorite_id.has(fruitId))? 
                            <Badge pill variant = 'secondary' className = 'ml-2 mb-2 pt-2 favorite' id = {'favorite'} key ={'not_favorite'}  onClick = {handleFavoriteRemove}>
                                已收藏  
                            </Badge>
                            :
                            <Badge pill className = 'ml-2 mb-2 pt-2 favorite add' id = {'favorite'} key ={'favorite'} onClick = {handleFavoriteAdd}>
                                收藏  
                            </Badge>

                        }

                    </Row>
                </Container>
            </Container>
            }
        </>
    )
}

export default FruitPage