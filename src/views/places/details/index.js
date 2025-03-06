// ** React Imports
import React, { Fragment, useContext, useEffect, useState } from "react"

// ** Third Party Components
import classnames from "classnames"
import { Bookmark, ChevronsDown, ChevronsUp, MessageSquare, Share2, Star } from "react-feather"

// ** Utils
import { kFormatter } from "@utils"

// ** Custom Components
import Sidebar from "../BlogSidebar"
import Avatar from "@components/avatar"
import Breadcrumbs from "@components/breadcrumbs"

// ** Reactstrap Imports
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  DropdownToggle,
  Form,
  Input,
  Label,
  Row,
  UncontrolledDropdown
} from "reactstrap"

// ** Styles
import "@styles/base/pages/page-blog.scss"
import Rating from "react-rating"
import { getPlaceByPlaceId } from "@src/services/place"
import moment from "moment/moment"
import { USER_LOGIN_DETAILS } from "@src/router/RouteConstant"
import { badgeColorsArr } from "@src/utility/text_details"
import { validateCommentDetails } from "@src/utility/validation"
import { createNewComment } from "@src/services/user"
import toast from "react-hot-toast"
import LoadingSpinner from "@components/spinner/Loading-spinner"
import ApexDonutChart from "@src/views/apex/ApexDonutChart"

// ** Styles
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import RouteMap from "@src/views/map_route/RouteMap"
// import { useRTL } from "@hooks/useRTL"
// import { ThemeColors } from "@src/utility/context/ThemeColors"
import { animateScroll as scroll } from 'react-scroll'

const BlogDetails = () => {

  // ** Hooks
  // const [isRtl] = useRTL()
  //
  // // ** Context
  // const themeColors = useContext(ThemeColors)

  // ** States
  const [data, setData] = useState(null)
  const [displayedComments, setDisplayedComments] = useState(2)
  const [cardId, setCardId] = useState(null)
  const [loggedUser, setLoggedUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const [originCoords, setOriginCoords] = useState(null)
  const [destinationName, setDestinationName] = useState('colombo')
  const [sentimentCounts, setSentimentCounts] = useState([0, 0, 0])

  const [form, setForm] = useState({
    comment_text: "",
    email: "",
    name: "",
    static_rating: 0, //add new property static_rating
    place_id: "",
    user_id: ""
  })

  console.log(form)

// ** Load User Details and Coordinates from Local Storage
  useEffect(() => {
    const storedUserDetails = localStorage.getItem(USER_LOGIN_DETAILS)
    if (storedUserDetails) {
      const user = JSON.parse(storedUserDetails)
      setLoggedUser(user)

      if (user.latitude && user.longitude) {
        setOriginCoords({
          lat: parseFloat(user.latitude),
          lng: parseFloat(user.longitude)
        })
      }
    }
  }, [])


  useEffect(() => {
    // Extract the cardId from the URL
    const extractedCardId = window.location.pathname.split("/").pop()
    setCardId(extractedCardId)

    fetchPlaceById(extractedCardId)

  }, [])

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      place_id: cardId,
      user_id: loggedUser?.user_id || ""
    }))
  }, [cardId, loggedUser])


  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }))
  }

  const clearForm = () => {
    setForm((prevState) => ({
      ...prevState,
        comment_text: '',
        name: '',
        email: '',
        static_rating: 0

    }))
  }

  const fetchPlaceById = async (cardId) => {
    try {
      const response = await getPlaceByPlaceId(cardId)
      if (response.status === 200) {
        console.log(response.data.data)
        const placeData = response.data.data[0]  // <-- Define placeData first
        setData(response.data.data[0])
        setDestinationName(response.data ? `${response.data.data[0].title}` : "colombo")

        // Safely parse sentiment counts as numbers
        const {
          positive_sentiment_count = 0,
          negative_sentiment_count = 0,
          neutral_sentiment_count = 0
        } = placeData

        // Convert them to integers to avoid NaN
        const pos = parseInt(positive_sentiment_count) || 0
        const neg = parseInt(negative_sentiment_count) || 0
        const neu = parseInt(neutral_sentiment_count) || 0

        setSentimentCounts([pos, neu, neg]) // Order: [Positive, Neutral, Negative]

      } else {
        console.error("Error fetching places:", response.message)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }

  function addNewCommentApiHandler() {
    if (validateCommentDetails(form)) {
      setLoading(true)
      createNewComment(form)
        .then((response) => {
          if (response.data) {
            toast.success(response.message)

            // Scroll up smoothly to the chart section after comment creation
            scroll.scrollTo(document.getElementById("chart-section").offsetTop - 100, {
              duration: 800,
              smooth: "easeInOutQuad"
            })
            // After successfully adding a comment, fetch updated place details
            fetchPlaceById(cardId)
            //updateRateScore(cardId)
          }
          clearForm()
        })
        .catch((error) => {
          console.error("API Request Error:", error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  const handleAddComment = () => {
    addNewCommentApiHandler()
  }

  const renderTags = () => {
    return data?.tags?.map((tag, index) => (
      <a key={index} href="/" onClick={(e) => e.preventDefault()}>
        <Badge
          className={classnames({
            "me-50": index !== data.tags.length - 1
          })}
          color={badgeColorsArr[tag]}
          pill
        >
          {tag}
        </Badge>
      </a>
    ))
  }

  const handleViewMoreClick = () => {
    setDisplayedComments((prevCount) => (prevCount === data?.comments?.length ? 2 : data?.comments?.length))
  }

  const renderComments = () => {
    return data.comments.slice(0, displayedComments).map(comment => (
      <Card className="mb-2" key={comment.comment_id}>
        <CardBody>
          <div className="d-flex">
            <div>
              <Avatar className="me-75" img={comment.user_image} imgHeight="38" imgWidth="38" />
            </div>
            <div>
              <h6 className="fw-bolder mb-25">{comment.name}</h6>
              <CardText>{moment(comment.commented_at).format("lll")}</CardText>
              <CardText>{comment.comment_text}</CardText>
              <a href="/" onClick={e => e.preventDefault()}></a>
            </div>
          </div>
        </CardBody>
      </Card>
    ))
  }

    console.log(`destination name => ${destinationName} /   originCoords => ${originCoords}`)

  return (
    <Fragment>
      <Breadcrumbs title="Place Details" data={[{ title: "Place" }, { title: "Details" }]} />
      <div className="blog-wrapper">
        <div className="content-detached content-right">
          <div className="content-body">
            {data !== null ? (
              <Row>

                <Col sm="12">
                  <Card className="mb-4 shadow-sm border-0">
                    <CardImg src={data.img} className="w-100 rounded-top" style={{ maxHeight: "500px", objectFit: "cover" }} />
                    <CardBody>
                      {/* Title & User Info */}
                      <h1 className="fw-bold text-primary mb-2">{data.title}</h1>
                      <hr />
                      {/* Ratings & Chart */}
                      <Row className="gy-3">
                        <Col md="6">
                          <div className="d-flex align-items-center mb-3">
                            <Avatar img={data.user_image} imgHeight="65" imgWidth="65" className="me-1" />
                            <div>
                              <p className="text-muted me-1">by</p>
                              <a className="fw-bold text-dark" href="/" onClick={e => e.preventDefault()}>
                                {data.user_full_name}
                              </a>
                              <span className="text-muted"> | </span>
                              <small className="text-muted">{moment(data.posted_date).format("lll")}</small>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="mb-2">{renderTags()}</div>
                          <div>
                            <span className="fw-bold">Ratings</span>
                            <br />
                            <Rating
                              readonly
                              initialRating={data.rating_score}
                              emptySymbol={<Star size={25} fill="#babfc7" stroke="#babfc7" />}
                              fullSymbol={<Star size={25} fill="#ffc107" stroke="#ffc107" />}
                            />
                          </div>
                          {/* Content */}
                          <CardText className="mt-3 text-muted"
                                    dangerouslySetInnerHTML={{ __html: data.content }}></CardText>

                        </Col>

                        <Col md="6" id="chart-section">
                          <ApexDonutChart seriesData={sentimentCounts} />
                        </Col>
                      </Row>
                      <div>

                        <h1>Route Map</h1>
                        <RouteMap
                          originCoords={originCoords}
                          destinationName={destinationName}
                        />
                      </div>
                      <hr />
                      {/* Actions */}
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex">
                          <Button color="light" className="me-2 d-flex align-items-center">
                            <MessageSquare size={20} className="me-1" />
                            {kFormatter(data.comments.length)}
                          </Button>
                          <Button color="light" className="me-2 d-flex align-items-center">
                            <Bookmark size={20} className="me-1" />
                            10
                          </Button>
                        </div>
                        <UncontrolledDropdown>
                          <DropdownToggle tag="span" className="cursor-pointer">
                            <Share2 size={21} className="text-body" />
                          </DropdownToggle>
                        </UncontrolledDropdown>
                      </div>
                    </CardBody>
                  </Card>
                </Col>

                {
                  loading === true ? (
                    <LoadingSpinner />
                  ) : (
                    <Col sm="12" id="blogComment">
                      <h6 className="section-label text-dark fs-5 mt-1">Comments</h6>
                      {renderComments()}
                      {data.comments.length > 2 && (
                        <div className={"text-center mb-2 mt-2"}>
                          <Button color="info" onClick={handleViewMoreClick}>
                            {displayedComments === 2 ? (
                              <>View More <ChevronsDown size={16} /></>
                            ) : (
                              <>View Less <ChevronsUp size={16} /></>
                            )}
                          </Button>
                        </div>
                      )}
                    </Col>
                  )
                }
                <Col sm="12" className={"mt-1"}>
                  <h6 className="section-label text-dark fs-5 mt-1">Leave a Comment</h6>
                  <Card>
                    <CardBody>
                      <Form className="form" onSubmit={e => e.preventDefault()}>
                        <Row>
                          <Col sm="3">
                            <Rating
                              initialRating={form.static_rating} // Use form state for persistent rating
                              emptySymbol={<Star size={25} fill="#babfc7" stroke="#babfc7" />}
                              fullSymbol={<Star size={25} fill="#ffc107" stroke="#ffc107" />}
                              onClick={(value) => {
                                setForm((prevForm) => ({
                                  ...prevForm,
                                  static_rating: value // Persist rating in form state
                                }))
                              }}
                            />
                            <div className='counter-wrapper mt-1'>
                              <span className='fw-bold'>Ratings: {form.static_rating}</span> {/* Display from form.static_rating */}
                            </div>
                          </Col>

                          <Col sm="5">
                            <div className="mb-2">
                              <Input
                                placeholder="Name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleFormChange}
                              />
                            </div>
                          </Col>
                          <Col sm="4">
                            <div className="mb-2">
                              <Input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={form.email}
                                onChange={handleFormChange}
                              />
                            </div>
                          </Col>
                          <Col sm="12" className={'mt-2'}>
                            <div className="mb-2">
                              <Input
                                className="mb-2"
                                type="textarea"
                                rows="4"
                                placeholder="Comment"
                                name="comment_text"
                                value={form.comment_text}
                                onChange={handleFormChange}
                              />
                            </div>
                          </Col>
                          <Col sm="12">
                            <div className="form-check mb-2">
                              <Input type="checkbox" id="save-data-checkbox" />
                              <Label className="form-check-label" for="save-data-checkbox">
                                Save my name, email, and website in this browser for the next time I comment.
                              </Label>
                            </div>
                          </Col>
                          <Col sm="12">
                            <Button
                              color="primary"
                              onClick={handleAddComment}
                            >
                              Post Comment
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            ) : null}
          </div>
        </div>
        <Sidebar />
      </div>
    </Fragment>
  )
}

export default BlogDetails
