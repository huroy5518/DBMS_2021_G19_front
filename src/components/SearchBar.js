import {useEffect, useState} from 'react'
import ReactLoading from 'react-loading'
import {Container, Row, Col, InputGroup, FormControl, Button, Card, Badge} from 'react-bootstrap'
import Select from 'react-select'
import {useHistory} from 'react-router-dom'
import axios from 'axios'
import './BodyS.css'
import { useAuthDispatch, useAuthState } from './context/context'

const SearchBar = ()=> {
    const Month = [
        {value:1, label: "1月"},
        {value:2, label: "2月"},
        {value:3, label: "3月"},
        {value:4, label: "4月"},
        {value:5, label: "5月"},
        {value:6, label: "6月"},
        {value:7, label: "7月"},
        {value:8, label: "8月"},
        {value:9, label: "9月"},
        {value:10, label: "10月"},
        {value:11, label: "11月"},
        {value:12, label: "12月"},
        {value: 13, label: "全選"},
        {value: 14, label: '無'}
    ]
    const Season = [
        {value:1, label:"春"},
        {value:2, label:"夏"},
        {value:3, label:"秋"},
        {value:4, label:"冬"},
        {value: 5, label: "全選"},
        {value: 6, label: '無'}
    ]
    const {isLogin} = useAuthState()
    const history = useHistory()

    const [selectMonth, setMonth] = useState([])
    const [selectSeason, setSeason] = useState([])
    const [lowest, setLowest] = useState('')
    const [highest, setHighest] = useState('')
    const [inputFruitName, setInputFruitName] = useState('')
    const [inputLocationName, setInputLocationName] = useState('')
    const [inputMarketName, setInputMarketName] = useState('')
    const {favorite_id,favorite} = useAuthState()
    const [fruitData, setFruitData] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useAuthDispatch()
    useEffect(() => {
        axios.get('http://192.168.88.248:8000/fruit').then(
            res => setFruitData(res.data)
        ).then(setIsLoading(false))
        .catch(e => {
            console.log(e)
        })

    }, [])

    const handleHighestChange = (e) => {
        setHighest(e.target.value)
    }
    const handleLowestChange = (e) => {
        setLowest(e.target.value)
    }
    const handleMonthChange = (e)=> {
        console.log(lowest)
        if(e.length === 0) {
            setMonth([])
            return
        }
        if(e[e.length - 1].value === 13) {
            setMonth([1,2,3,4,5,6,7,8,9,10,11,12])
            return
        }
        if(e[e.length - 1].value === 14) {
            setMonth([])
            return
        }
        setMonth((e) ? e.map(x=>x.value):[])
    }
    const handleSeasonChange = (e)=> {
        if(e.length === 0) {
            setSeason([])
            return
        }
        if(e[e.length - 1].value === 5) {
            setSeason([1,2,3,4])
            return
        }
        if(e[e.length - 1].value === 6) {
            setSeason([])
            return
        }
        setSeason((e) ? e.map(x=>x.value):[])
    }
    // const customStyles = {
    //     option: (provided, state) =>( {
    //         ...provided,
    //     }),
    //     multiValue : (styles, {data}) => ({
    //         ...styles,
    //         backrgoundColor: 'blue',
    //         opacity: 0.1
    //     }),
    //     multiValueLabel: (styles, { data }) => ({
    //         ...styles,
    //         backgroundColor: 'blue',
    //         opacity: 0.1
    //     }),
    //     multiValueRemove: (styles, { data }) => ({
    //         ...styles,
    //         backgroundColor: rgba(0, 0, 0, 0.5)
    //     }),
    // }
    const handleMarketNameChange = (e) => {
        setInputMarketName(e.target.value)
    }
    const handleLocationNameChange = (e) => {
        setInputLocationName(e.target.value)
    }
    const handleFruitNameChange = (e) => {
        setInputFruitName(e.target.value)
    }
    const handleSearch = () => {
        setIsLoading(true)
        const searchURL = 'http://192.168.88.248:8000/fruit/search'
        axios.post(
            searchURL,
            {
                id:"",
                name: inputFruitName,
                months: selectMonth
            }
        ).then(
            res => setFruitData(res.data) 
        ).then(
            setIsLoading(false)
        ).catch(e => console.log(e))
    }
    const handleCardClick = (e) => {

        if(e.target.id.split(':')[0] === 'favorite') {
            return
        }
        console.log(e.currentTarget.id)
        history.push('/id/' +e.currentTarget.id)
    }

    const handleFavoriteAdd = (e)=> {
        // TODO communicate
        // const tmp_favorite = favorite
        // console.log(e)
        // tmp_favorite.push(parseInt(e.target.id.split(':')[1]))
        const tmp_favorite = favorite
        const tmp = parseInt((e.target.id.split(':')[1]))
        tmp_favorite.push(fruitData[tmp])
        const tmp_set = favorite_id
        tmp_set.add(fruitData[tmp].id)
        dispatch({type:'SET_FAVORITE', payload: {favorite:tmp_favorite}, newSet:tmp_set})
    }
    const handleFavoriteRemove = (e)=> {
        // TODO communicate
        const tmp_favorite = favorite
        const tmp = parseInt((e.target.id.split(':')[1]))
        tmp_favorite.splice(tmp,1)
        const tmp_set = favorite_id
        tmp_set.delete(fruitData[tmp].id)
        dispatch({type:'SET_FAVORITE', payload: {favorite:tmp_favorite}, newSet:tmp_set})
    }

    // const DataCard = data.map(item => (
    //     <Card className = 'card-1'>
    //         <h1>{item.name}</h1>
    //         {item.season.map(seasons =>
    //             {
    //                 console.log(seasons)
    //                 return <h6 className = 'mr-2'>{seasons}</h6>
    //             }
    //         )}
    //         <span className = 'mr-2'>hello</span>
    //     </Card>
    // ))

    
    let DataCard = (isLoading)? 
    <Container fluid className = 'd-flex justify-content-center'>
        <ReactLoading type={"bars"} color={"grey"} />
    </Container>
    : fruitData.map((item,idx) => {
                        const h = item.months.map(month =>
                            <Badge pill variant='warning' className = 'ml-2 mb-2' key = {month}>{month}月</Badge> )
                        if(isLogin && favorite_id.has(item.id)) {
                            h.push(
                            <Badge pill variant = 'secondary' className = 'ml-2 mb-2 favorite' id = {'favorite:' + idx} key ={'favorite:' + item.id}  onClick = {handleFavoriteRemove}>
                                已收藏  
                            </Badge>)
                        }else if(isLogin){
                            h.push(
                            <Badge pill className = 'ml-2 mb-2 favorite add' id = {'favorite:' + idx} key ={'favorite:' + item.id} onClick = {handleFavoriteAdd}>
                                收藏  
                            </Badge>)

                        }

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
    

    return (
        <Card>
            <Container fluid>
                <Row className = 'mt-2'>
                    <Col>
                        <h3>依月份</h3>
                        <Select
                            name = "selectMonth"
                            // styles = {customStyles}
                            closeMenuOnSelect={false}
                            // components={animatedComponents}
                            value = {Month.filter(item => selectMonth.includes(item.value))}
                            onChange = {handleMonthChange}
                            isMulti
                            options={Month}
                        />
                    </Col>
                    <Col>
                        <h3>依季節</h3>
                        <Select
                            name = "selectMonth"
                            closeMenuOnSelect={false}
                            // components={animatedComponents}
                            value = {Season.filter(item => selectSeason.includes(item.value))}
                            onChange = {handleSeasonChange}
                            isMulti
                            options={Season}
                        />
                    </Col>
                    <Col>
                        <h3>依產地</h3>
                        {/* <AsyncSelect
                            loadOptions = {loadLocationName}
                            defaultOptions = {defaultLocationName}
                            onInputChange = {handleLocationNameChange}
                        /> */}
                        <InputGroup>
                            <FormControl placeholder = "產地" value = {inputLocationName} onChange = {handleLocationNameChange}/>
                        </InputGroup>

                    </Col>
                </Row>
                <Row className = 'mt-5'>
                    
                    <Col>
                        <h3>依價格</h3>
                        <Container fluid className = "px-0">
                            <Row className = 'no-gutters px-0'>
                                <Col xs={5}>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl placeholder = "最低" onChange = {handleLowestChange} type = 'number' value = {lowest}/>
                                    </InputGroup>
                                </Col>
                                <Col xs={2}>
                                    <h3 align = 'center'>~</h3>
                                </Col>
                                <Col xs={5}>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>$</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl placeholder = "最高" onChange = {handleHighestChange} type = 'number' value = {highest}/>
                                    </InputGroup>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col>
                        <h3>依名稱</h3>
                        <InputGroup>
                            <FormControl placeholder = "名稱" value = {inputFruitName} onChange = {handleFruitNameChange}/>
                        </InputGroup>
                        {/* <AsyncSelect
                            loadOptions = {loadFruitName}
                            defaultOptions = {defaultName}
                            onInputChange = {handleFruitNameChange}
                        /> */}
                    </Col>
                    <Col>
                        <h3>依市場</h3>
                        {/* <AsyncSelect
                            loadOptions = {loadMarketName}
                            defaultOptions = {defaultMarketName}
                            onInputChange = {handleMarketNameChange}
                        /> */}
                        <InputGroup>
                            <FormControl placeholder = "市場" value = {inputMarketName} onChange = {handleMarketNameChange}/>
                        </InputGroup>
                    </Col>
                </Row>
                <Row>
                <Container fuild className = 'd-flex justify-content-start mt-3' >
                    <Button onClick = {handleSearch}>Search</Button>
                </Container>
                </Row>
            </Container>
            <Container fluid className = 'mt-5 h-100'>
                {DataCard}
            </Container>
        </Card>
    )
}

export default SearchBar