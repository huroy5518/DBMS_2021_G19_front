import {useEffect, useState} from 'react'
import {Container, Row, Badge, Col} from 'react-bootstrap'
import {useAuthState, useAuthDispatch} from './context/context'
import axios from 'axios'
import ReactLoading from 'react-loading'
import {Line} from 'react-chartjs-2'
import {getFavorite} from './context/action'
import {path} from './context/path'

const FruitPage = (props) => {
    const fruitId = props.match.params.id
    const [Loading, setLoading] = useState(true)
    const [fruitData, setFruitData] = useState({})
    const [notFound, setNotFound] = useState(false)
    const {isLogin, favorite_id, token, favorite} = useAuthState()
    const [twoYearPrice, setTwoYearPrice] = useState([])
    const [twoYearDate, setTwoYearDate] = useState([])

    const dispatch = useAuthDispatch()

    const URL = path + '/fruit/' + fruitId
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
        getFavorite(dispatch, token)
    }, [])
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
                let tmp = res.data.monthly_price
                tmp = tmp.map((item) => {
                    return item.price
                })
                setTwoYearPrice(tmp)
                tmp = res.data.monthly_price
                tmp = tmp.map((item) => {
                    return item.year.toString() + '-' + item.month.toString()
                })
                setTwoYearDate(tmp)
                setNotFound(false)
                setLoading(false)
            }
        ).catch(e => console.log(e))
    }, [])
    if(notFound) {
        return (
            <h1 align='center'>無此水果</h1>
        )
    }
    if(Loading || fruitData === {}) {
        return (
            <Container fluid className = 'd-flex justify-content-center'>
                <ReactLoading type={"bars"} color={"grey"} />
            </Container>
        )
    }
    const handleFavoriteAdd = async (e)=> {
        // TODO communicate
        const tmp_favorite = favorite
        const postURL = path + '/follow/' + fruitData.id
        await axios.post(postURL,
            {},
            {headers: {'Authorization': `Bearer ${token}`}}
                    
        )
        tmp_favorite.push(fruitData)
        const tmp_set = favorite_id
        tmp_set.add(fruitData.id)
        dispatch({type:'SET_FAVORITE', payload:tmp_favorite, favorite_id:tmp_set})
    }
    const handleFavoriteRemove = async (e)=> {
        // TODO communicate
        const tmp_set = favorite_id
        const tmp_favorite = favorite.filter((item) => {
            return item.id !== fruitData.id
        })
        const deleteURL = path + '/follow/' + fruitData.id
        await axios.delete(deleteURL,
            {headers: {'Authorization': `Bearer ${token}`}}
                    
        )
        tmp_set.delete(fruitData.id)
        dispatch({type:'SET_FAVORITE', payload: tmp_favorite, favorite_id:tmp_set})
    }

    const data = {
        labels: twoYearDate,
        datasets: [
          {
            label: '價格',
            data: twoYearPrice,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
          },
        ],
      };
      
      const options = {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      };
      const LineChart = () => {
          return(
            <>
                <div className='header'>
                    <h5 className='title mt-2'>進兩年價格走向</h5>
                </div>
                <Line data={data} options={options} className = 'mb-3'/>
            </>
          )
      }

    return (
        <>
            {(fruitData === {})?
                <Container fluid className = 'd-flex justify-content-center'>
                    <ReactLoading type={"bars"} color={"grey"} />
                </Container>
            :<Container>
                <h1 className = 'mt-2 ml-3'>{fruitData.name}</h1>
                <Container fluid>
                    <Row>
                        <Col>

                            <h4>盛產月份</h4>
                            {fruitData.months.map(month=>{
                                    return (
                                    <Badge pill variant='warning' className = 'mb-2 mr-2 pt-2' key = {month}>{month}月</Badge>
                                )
                            })
                            }
                            {
                            (isLogin)?
                            ((favorite_id.has(fruitId))? 
                                <Badge pill variant = 'secondary' className = 'mb-2 pt-2 favorite' id = {'favorite'} key ={'not_favorite'}  onClick = {handleFavoriteRemove}>
                                    已收藏  
                                </Badge>
                                :
                                <Badge pill className = 'mb-2 mr-2 pt-2 favorite add' id = {'favorite'} key ={'favorite'} onClick = {handleFavoriteAdd}>
                                    收藏  
                                </Badge>):""

                            }

                        </Col>
                            {( !Loading && fruitData.locations.length >= 1) ? 
                                <Col>
                                <Row>
                                    <h4>產地</h4>
                                </Row>
                                <Row>
                                    {fruitData.locations.map((item) => {
                                        return (
                                            <Badge pill className = 'ml-2 mb-2 pt-2 favorite add' key ={item.id} onClick = {()=>{}}>
                                                {item.name}    
                                            </Badge>
                                        )
                                    })}
                                </Row>
                            </Col>
                            :""}
                    </Row>
                </Container>
                <Container className = 'mt-4'>
                    <LineChart className = 'ml-2'/>
                </Container>
            </Container>
            }
        </>
    )
}

export default FruitPage
