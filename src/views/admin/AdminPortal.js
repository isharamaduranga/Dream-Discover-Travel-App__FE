import React from "react"
import CardCongratulations from "@src/views/admin/Cards/CardCongratulations";
import { Col, Row } from "reactstrap";
import StatsCard from "@src/views/admin/Cards/StatsCard";
import '@styles/base/pages/dashboard-ecommerce.scss'
// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import ApexColumnChart from '../admin/Cards/ApexColumnCharts'
function AdminPortal() {

  return (
    <div id='dashboard-ecommerce'>
      <Row className='match-height'>
        <Col xl='4' md='6' xs='12'>
          <CardCongratulations/>
        </Col>
        <Col xl='8' md='6' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
      <Row>
        <Col sm='12'>
          <ApexColumnChart  />
        </Col>
      </Row>
    </div>
  )
}

export default AdminPortal