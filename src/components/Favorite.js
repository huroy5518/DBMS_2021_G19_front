import {useState, useEffect} from 'react'
import {Container, Row, Col,Badge, Card} from 'react-bootstrap'
import ReactLoading from 'react-loading'
import { useAuthDispatch, useAuthState } from './context/context'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import {getFavorite} from './context/action'

const Favorite = () => {
    const {isLogin} = useAuthState()
    const {loading, favorite, favorite_id, token} = useAuthState()
    
    const history = useHistory()
    const dispatch = useAuthDispatch()

    useEffect(() => {
        getFavorite(dispatch, token)
    },[])

    const handleCardClick = (e) => {

        if(e.target.id.split(':')[0] === 'favorite') {
            return
        }
        console.log(e.currentTarget.id)
        history.push('/id/' +e.currentTarget.id)
    }

    const handleFavoriteRemove = async (e)=> {
        // TODO communicate
        const tmp = parseInt((e.target.id.split(':')[1]))
        const tmp_set = favorite_id
        const tmp_favorite = favorite.filter((item) => {
            return item.id !== favorite[tmp].id
        })
        const deleteURL = 'http://192.168.88.248:8000/follow/' + favorite[tmp].id
        await axios.delete(deleteURL,
            {},
            {headers: {'Authorization': `Bearer ${token}`}}
        )
        tmp_set.delete(favorite[tmp].id)
        dispatch({type:'SET_FAVORITE', payload: tmp_favorite, favorite_id:tmp_set})
    }

    let DataCard = 
    (loading)? 
    (<Container fluid className = 'd-flex justify-content-center'>
        <ReactLoading type={"bars"} color={"grey"} />
    </Container>)
    :
     favorite.map((item,idx) => {

                        return(
                            <Card className = 'card-1 px-0 p-0 card-1 mb-2' key = {item.id} id = {item.id} onClick = {handleCardClick}>
                                <Container className = 'mt-3 align-items-center'>
                                    <Row xs={2}>
                                        <Col>
                                            <Row>
                                                <Container className = 'd-flex align-items-center'>
                                                    <h1 className = 'align-center'>{item.name}</h1>
                                                </Container>
                                            </Row>
                                        </Col>
                                        <Col>
                                            {/* <Row>
                                                <Container className = 'd-flex align-items-center justify-content-end'>
                                                    <h5>今日價格：{item.today_price}</h5>
                                                </Container>
                                            </Row> */}
                                            <Row>
                                                <Container className = 'd-flex align-items-center justify-content-end'>
                                                    <Badge pill variant = 'secondary' className = 'ml-2 mb-2 favorite' id = {'favorite:' + idx} key ={'favorite:' + item.id}  onClick = {handleFavoriteRemove}>
                                                        已收藏  
                                                    </Badge>
                                                </Container>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card>
                        )
                    }
                )
    


    if(!isLogin){
        return <h1 align='center'>未登入</h1>
    }
    return (
        <Container>
            <h2 className='ml-3 mt-3 mb-3'>你的收藏</h2>
            <Card>
                <Container fluid className = 'mt-5 h-100'>
                    {DataCard}
                </Container>
            </Card>
        </Container>
    )
}

export default Favorite