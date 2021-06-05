import {Form, Row, Col} from 'react-bootstrap'
import {Container} from 'react-bootstrap'
import {Button} from 'react-bootstrap'
import {useState, useEffect} from 'react'


function SearchMS() {
    const [month, setMonth] = useState({
        '1':false,
        '2':false,
        '3':false,
        '4':false,
        '5':false,
        '6':false,
        '7':false,
        '8':false,
        '9':false,
        '10':false,
        '11':false,
        '12':false,
        'allmonth':false
    })

    const [season, setSeason] = useState({
        'spring':false,
        'summer': false,
        'autumn': false,
        'winter': false
    })
    const handleMonthChange = (e)=>{
        const tmp_month = month
        tmp_month[e.target.id] = !tmp_month[e.target.id]
        setMonth(tmp_month)
        console.log(tmp_month)
    }
    const handleSeasonChange = (e)=>{
        const tmp_season = season
        tmp_season[e.target.id] = !tmp_season[e.target.id]
        setSeason(tmp_season)
    }
    const monthCheckbox = []
    for(let i = 1; i < 12; i += 3) {
        monthCheckbox.push(
            <div key = {'inline-checkbox-' + i.toString()} className = 'mb-3 checkbox-lg'>
            <Form.Check inline label = {(i).toString()} name = "group1" type = "checkbox" id = {i.toString()}  checked = {month[i.toString()]} onChange = {handleMonthChange}/>
            <Form.Check inline label = {(i+1).toString()} name = "group1" type = "checkbox" id = {(i + 1).toString()} checked = {month[(i+1).toString()]} onChange = {handleMonthChange}/>
            <Form.Check inline label = {(i+2).toString()} name = "group1" type = "checkbox" id = {(i + 2).toString()} checked = {month[(i + 2).toString()]} onChange = {handleMonthChange}/>
            </div>
        )

    }
    const SearchFilter = (
        <Container fluid>
            <Row>
                <Col>
                    <Container className = 'd-flex justify-content-center'>
                        <h3>
                            Search by Month or Season
                        </h3>
                    </Container>
                    <Container fluid>
                        <Row>
                            <Col>
                                <Container className = 'd-flex justify-content-right'>
                                    <Col>
                                        <Row>
                                            <Container className = 'd-flex justify-content-center'>
                                                <h4>Month</h4>
                                            </Container>
                                        </Row>
                                        <Row>
                                            <Container className = 'd-flex justify-content-center'>
                                                <Form className = 'wd-100'>
                                                    <Row className = ''>
                                                        <Col className = ''>
                                                            {monthCheckbox}
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Container>
                                        </Row>
                                    </Col>
                                </Container>
                            </Col>
                            <Col>
                                <Container className = 'd-flex justify-content-center'>
                                    <Col>
                                        <Row>
                                            <Container className = 'd-flex justify-content-center'>
                                                <h4>Season</h4>
                                            </Container>
                                        </Row>
                                        <Row>
                                            <Container className = 'd-flex justify-content-center'>
                                                <Form className = 'wd-100'>
                                                    <Row className = 'wd-100'>
                                                        <Col>
                                                            <Form.Check label = "Spring" name = "group1" type = "checkbox" id = 'spring' checked = {season['spring']} onChange = {handleSeasonChange}/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Check label = "Summer" name = "group1" type = "checkbox" id = 'summer' checked = {season['summer']} onChange = {handleSeasonChange}/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col>
                                                            <Form.Check inline label = "Autumn" name = "group1" type = "checkbox" id = 'autumn' checked = {season['autumn']} onChange = {handleSeasonChange}/>
                                                        </Col>
                                                        <Col>
                                                            <Form.Check inline label = "Winter" name = "group1" type = "checkbox" id = 'winter' checked = {season['winter']} onChange = {handleSeasonChange}/>
                                                        </Col>
                                                    </Row> 
                                                    <Row>
                                                        <Col>
                                                            <Form.Check inline label = 'all season' name = 'group1' type = 'checkbox' id = 'allseason' checked = {season['allseason']}/>
                                                            <Form.Check inline label = 'all month' name = 'group1' type = 'checkbox' id = 'allmonth' checked = {month['allmonth']}/>
                                                        </Col>
                                                    </Row>
                                                </Form>
                                            </Container>
                                        </Row>
                                    </Col>
                                </Container>
                            </Col>
                        </Row>
                    </Container>
                </Col>
                <Col>
                    <h1>2</h1>
                </Col>
            </Row>
        </Container>
    )
    return (
        <>
        {SearchFilter}
        </>
    )
}

export default SearchMS;
