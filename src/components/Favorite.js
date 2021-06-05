import {useEffect, useState} from 'react'
import {Container, Row, Col,Badge, Card} from 'react-bootstrap'
import ReactLoading from 'react-loading'
import { useAuthDispatch, useAuthState } from './context/context'
import {useHistory} from 'react-router-dom'

const Favorite = () => {
    const {isLogin} = useAuthState()
    const [isLoading, setLoading] = useState('')
    const {favorite, favorite_id} = useAuthState()
    
    const history = useHistory()
    const dispatch = useAuthDispatch()

    const handleCardClick = (e) => {

        if(e.target.id.split(':')[0] === 'favorite') {
            return
        }
        console.log(e.currentTarget.id)
        history.push('/id/' +e.currentTarget.id)
    }

    const handleFavoriteRemove = (e)=> {
        // TODO communicate
        const tmp_favorite = favorite
        const tmp = parseInt((e.target.id.split(':')[1]))
        const tmp_set = favorite_id
        tmp_set.delete(tmp_favorite[tmp].id)
        tmp_favorite.splice(tmp,1)
        dispatch({type:'SET_FAVORITE', payload: {favorite:tmp_favorite}, newSet:tmp_set})
    }

    let DataCard = (isLoading)? 
    <Container fluid className = 'd-flex justify-content-center'>
        <ReactLoading type={"bars"} color={"grey"} />
    </Container>
    : favorite.map((item,idx) => {
                        const h = item.months.map(month =>
                            <Badge pill variant='warning' className = 'ml-2 mb-2' key = {month}>{month}月</Badge> )
                            h.push(
                            <Badge pill variant = 'secondary' className = 'ml-2 mb-2 favorite' id = {'favorite:' + idx} key ={'favorite:' + item.id}  onClick = {handleFavoriteRemove}>
                                已收藏  
                            </Badge>)

                        return(
                            <Card className = 'card-1 px-0 p-0 card-1 mb-2' key = {item.id} id = {idx} onClick = {handleCardClick}>
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
                                            <Row>
                                                <Container className = 'd-flex align-items-center justify-content-end'>
                                                    <h5>今日價格：{item.today_price}</h5>
                                                </Container>
                                            </Row>
                                            <Row>
                                                <Container className = 'd-flex align-items-center justify-content-end'>
                                                    {h}
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