import {useEffect, useState} from 'react'
import {Container, Row, Badge} from 'react-bootstrap'
import {useAuthState, useAuthDispatch} from './context/context'
import axios from 'axios'
import ReactLoading from 'react-loading'
import {Line} from 'react-chartjs-2'
import {getFavorite} from './context/action'

const FruitPage = (props) => {
    const fruitId = props.match.params.id
    const [Loading, setLoading] = useState(true)
    const [fruitData, setFruitData] = useState({})
    const [notFound, setNotFound] = useState(false)
    const {isLogin, favorite_id, token, favorite} = useAuthState()
    const [twoYearPrice, setTwoYearPrice] = useState([])
    const [twoYearDate, setTwoYearData] = useState([])

    const dispatch = useAuthDispatch()

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
        getFavorite(dispatch, token)
    }, [])
    useEffect(() => {
        console.log(favorite_id)
        let op = getdata()
        console.log(isLogin)
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
                setTwoYearData(tmp)
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
    const handleFavoriteAdd = async (e)=> {
        // TODO communicate
        const tmp_favorite = favorite
        const tmp = parseInt((e.target.id.split(':')[1]))
        const postURL = 'http://192.168.88.248:8000/follow/' + fruitData[tmp].id
        await axios.post(postURL,
            {},
            {headers: {'Authorization': `Bearer ${token}`}}
                    
        )
        tmp_favorite.push(fruitData[tmp])
        const tmp_set = favorite_id
        tmp_set.add(fruitData[tmp].id)
        dispatch({type:'SET_FAVORITE', payload:tmp_favorite, favorite_id:tmp_set})
    }
    const handleFavoriteRemove = async (e)=> {
        // TODO communicate
        const tmp = parseInt((e.target.id.split(':')[1]))
        const tmp_set = favorite_id
        const tmp_favorite = favorite.filter((item) => {
            return item.id !== fruitData[tmp].id
        })
        const deleteURL = 'http://192.168.88.248:8000/follow/' + fruitData[tmp].id
        await axios.delete(deleteURL,
            {headers: {'Authorization': `Bearer ${token}`}}
                    
        )
        tmp_set.delete(fruitData[tmp].id)
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
                <h1 className = 'mt-2'>{fruitData.name}</h1>
                <Container>
                    <Row>
                        <h4>盛產季節</h4>
                        {fruitData.months.map(month=>{
                                return (
                                <Badge pill variant='warning' className = 'ml-2 mb-2 pt-2' key = {month}>{month}月</Badge>
                            )
                        })
                        }
                        {
                         (isLogin)?
                          ((favorite_id.has(fruitId))? 
                            <Badge pill variant = 'secondary' className = 'ml-2 mb-2 pt-2 favorite' id = {'favorite'} key ={'not_favorite'}  onClick = {handleFavoriteRemove}>
                                已收藏  
                            </Badge>
                            :
                            <Badge pill className = 'ml-2 mb-2 pt-2 favorite add' id = {'favorite'} key ={'favorite'} onClick = {handleFavoriteAdd}>
                                收藏  
                            </Badge>):""

                        }

                    </Row>
                </Container>
                    <LineChart/>
            </Container>
            }
        </>
    )
}

export default FruitPage