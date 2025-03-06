// ** Third Party Components
import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import { Box, Calendar, MapPin } from "react-feather";

// ** Reactstrap Imports
import { Card, CardHeader, CardTitle, CardBody, Col, Label } from "reactstrap"
import { useEffect, useState } from "react"
import { getAllCategory } from "@src/services/category"
import Select from "react-select"
import axios from "axios"
import { getPlaceByCategoryId } from "@src/services/place"


  const ApexColumnCharts  = ({ direction }) => {

    const columnColors = {
      positive: 'rgba(40,199,111,0.92)',
      negative: 'rgba(234,84,85,0.91)',
      neutral: 'rgba(255,193,7,0.91)',
      bg: '#f8d3ff'
    }

    const [categoriesOptions, setCategoriesOptions] = useState([])
    const [selectedCategory, setSelectedCategory] = useState(null)
    const [placesOptions, setPlacesOptions] = useState([])
    const [selectedPlace, setSelectedPlace] = useState(null)
    const [dateRange, setDateRange] = useState([
      new Date(new Date().setDate(new Date().getDate() - 16)),
      new Date()
    ])
    const [chartData, setChartData] = useState({
      series: [],
      categories: []
    })


// ** Fetch Categories on Component Mount
    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const response = await getAllCategory()
          if (response.status === 200) {
            const categoriesData = response.data.categories.map((cat) => ({
              value: cat.id,
              label: cat.title
            }))
            setCategoriesOptions(categoriesData)

            // Set first category as default
            if (categoriesData.length > 0) {
              setSelectedCategory(categoriesData[0])
              fetchPlaces(categoriesData[0].value)
            }
          }
        } catch (error) {
          console.error("Error fetching categories:", error)
        }
      }
      fetchCategories()
    }, [])

    // ** Fetch Places based on Selected Category
    const fetchPlaces = async (categoryId) => {
      try {
        const response = await getPlaceByCategoryId(categoryId)
        if (response.status === 200) {
          const placesData = response.data.places.map((place) => ({
            value: place.id,
            label: place.title
          }))
          setPlacesOptions(placesData)

          // Set first place as default
          if (placesData.length > 0) {
            setSelectedPlace(placesData[0])
            fetchSentimentData(placesData[0].value, dateRange)
          }
        }
      } catch (error) {
        console.error("Error fetching places:", error)
      }
    }

    // ** Fetch Sentiment Data
    const fetchSentimentData = async (placeId, dateRange) => {
      try {
        const startDate = dateRange[0].toISOString().split('T')[0]
        const endDate = dateRange[1].toISOString().split('T')[0]
        const response = await axios.get(
          `http://localhost:8000/api/v1/places/${placeId}/sentiment-analysis?start_date=${startDate}&end_date=${endDate}`
        )
        if (response.status === 200) {
          const tweetSentiment = response.data.data.tweet_sentiment
          const categories = tweetSentiment.map(item => item.date)
          const positiveData = tweetSentiment.map(item => item.positive)
          const negativeData = tweetSentiment.map(item => item.negative)
          const neutralData = tweetSentiment.map(item => item.neutral)

          setChartData({
            categories,
            series: [
              { name: 'Positive Tweets', data: positiveData },
              { name: 'Negative Tweets', data: negativeData },
              { name: 'Neutral Tweets', data: neutralData }
            ]
          })
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error)
      }
    }

    // ** Handle Category Change
    const handleCategoryChange = (selectedOption) => {
      setSelectedCategory(selectedOption)
      setSelectedPlace(null)
      setPlacesOptions([])

      if (selectedOption) {
        fetchPlaces(selectedOption.value)
      }
    }

    // ** Handle Place Change
    const handlePlaceChange = (selectedOption) => {
      setSelectedPlace(selectedOption)
      if (selectedOption) {
        fetchSentimentData(selectedOption.value, dateRange)
      }
    }

    // ** Handle Date Change
    const handleDateChange = (selectedDates) => {
      setDateRange(selectedDates)
      if (selectedPlace) {
        fetchSentimentData(selectedPlace.value, selectedDates)
      }
    }


    // ** Chart Options
    const options = {
      chart: {
        height: 400,
        type: 'bar',
        stacked: true,
        parentHeightOffset: 0,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          columnWidth: '15%',
          colors: {
            backgroundBarColors: [columnColors.bg],
            backgroundBarRadius: 10
          }
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        position: 'top',
        horizontalAlign: 'start'
      },
      colors: [columnColors.positive, columnColors.negative, columnColors.neutral],
      stroke: {
        show: true,
        colors: ['transparent']
      },
      grid: {
        xaxis: {
          lines: {
            show: true
          }
        }
      },
      xaxis: {
        categories: chartData.categories
      },
      fill: {
        opacity: 1
      },
      yaxis: {
        title: {
          text: 'Number of Tweets'
        },
        opposite: direction === 'rtl'
      },
      tooltip: {
        y: {
          formatter: val => `${val} Tweets`
        }
      }
    }

    return (
        <Card>
          <CardHeader className='d-flex flex-md-row flex-column justify-content-md-between justify-content-start align-items-md-center align-items-start'>
            <CardTitle tag='h4'>Tweet Sentiment <br/> <p className={'ps-1'}>Analysis Chart</p></CardTitle>

            <Col md={3} >
              <Label className="form-label text-dark fw-semibold" for="input-name">
                <Box size={18} className={'text-info'}/>  Select Category
              </Label>
              <Select
                id={`categoryTag`}
                className="react-select"
                classNamePrefix="select"
                value={selectedCategory} // Bind selected value
                options={categoriesOptions} // Use the dynamically fetched categories
                isClearable={false}
                onChange={handleCategoryChange} // Handle the change event
              />
            </Col>

            <Col md={3}>
              <Label className="form-label text-dark fw-semibold" for="input-name">
                <MapPin size={18} className={'text-danger'}/>  Select Place
              </Label>
              <Select
                id={`placeTag`}
                className="react-select"
                classNamePrefix="select"
                value={selectedPlace}
                options={placesOptions}
                isClearable={true}
                onChange={handlePlaceChange}
                isDisabled={!selectedCategory}
              />
            </Col>

              <Col md={3}>
              <Label className="form-label text-dark fw-semibold">
                <Calendar size={18} className={'text-warning'}/>  Select Range
              </Label>
              <Flatpickr
                className="form-control flat-picker bg-white border-1 pe-1 shadow-none"
                value={dateRange} // Bind state to Flatpick
                default={dateRange}
                onChange={handleDateChange}
                options={{
                  mode: 'range',
                  maxDate: 'today'
                }}
              />
              </Col>

          </CardHeader>

          <CardBody>
            <Chart options={options} series={chartData.series} type='bar' height={400} />
          </CardBody>
        </Card>
    )
  }

  export default ApexColumnCharts