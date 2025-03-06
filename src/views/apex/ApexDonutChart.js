// ** Third Party Components
import Chart from 'react-apexcharts'

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle } from 'reactstrap'
import PropTypes from "prop-types";

const ApexDonutChart = ({ seriesData }) => {
  const donutColors = {
    positive: '#22b910',
    neutral: '#2b9bf4',
    negative: '#f35f5f'
  }

  // ** Chart Options
  const options = {
    legend: {
      show: true,
      position: 'bottom'
    },

    labels: ['Positive', 'Neutral', 'Negative'],

    // labels2: [`${85} - Positive`, `${16} - Neutral`, `${50} - Negative`],

    //labels: [`${85} - Positive`, `${16} - Neutral`, `${50} - Negative`],

    colors: [donutColors.positive, donutColors.neutral, donutColors.negative],
    dataLabels: {
      enabled: true,
      formatter(val) {
        return `${parseInt(val)}%`
      }
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              fontSize: '2rem',
              fontFamily: 'Montserrat'
            },
            value: {
              fontSize: '1rem',
              fontFamily: 'Montserrat',
              formatter(val) {
                return `${parseInt(val)}`
              }
            },
            total: {
              show: true,
              fontSize: '1.5rem',
              label: 'Total Reviews',
              formatter() {
                return seriesData.reduce((a, b) => a + b, 0)
              }
            }
          }
        }
      }
    },
    responsive: [
      {
        breakpoint: 992,
        options: {
          chart: {
            height: 380
          },
          legend: {
            position: 'bottom'
          }
        }
      },
      {
        breakpoint: 576,
        options: {
          chart: {
            height: 320
          },
          plotOptions: {
            pie: {
              donut: {
                labels: {
                  show: true,
                  name: {
                    fontSize: '1.5rem'
                  },
                  value: {
                    fontSize: '1rem'
                  },
                  total: {
                    fontSize: '1.5rem'
                  }
                }
              }
            }
          }
        }
      }
    ]
  }

  // ** Chart Series
  const series = [75, 40, 50]

  return (
    <Card>
      <CardBody>
        <CardTitle className={'text-center'} >
          Travellers Review Ratings
        </CardTitle>
        <Chart options={options} series={seriesData} type='donut' height={350} />
      </CardBody>
    </Card>
  )
}
// ** Prop-Types
ApexDonutChart.propTypes = {
  seriesData: PropTypes.arrayOf(PropTypes.number).isRequired
}

export default ApexDonutChart
