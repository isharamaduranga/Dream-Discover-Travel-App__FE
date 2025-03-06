// ** React Imports
import React, { Fragment, useEffect, useState } from "react"

// ** Third Party Components
import classnames from "classnames"
import { Bookmark, MessageSquare, Share2, Star } from "react-feather"

// ** Utils
import { kFormatter } from "@utils"

// ** Custom Components
import Avatar from "@components/avatar"
import Breadcrumbs from "@components/breadcrumbs"

// ** Reactstrap Imports
import { Badge, Button, Card, CardBody, CardImg, CardText, Col, Row, UncontrolledDropdown, DropdownToggle } from "reactstrap"

// ** Styles
import "@styles/base/pages/page-blog.scss"
import Rating from "react-rating"
import { changeStatus, getPlaceByPlaceId } from "@src/services/place";
import moment from "moment/moment"
import { USER_LOGIN_DETAILS } from "@src/router/RouteConstant"
import { badgeColorsArr } from "@src/utility/text_details"
import RouteMap from "@src/views/map_route/RouteMap"
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { MANAGE_PLACE_PATH } from "@src/router/routes/route-constant";
import axios from "axios";

const BlogDetails = () => {
  const [data, setData] = useState(null)
  const [cardId, setCardId] = useState(null)
  const [loggedUser, setLoggedUser] = useState(null)
  const [originCoords, setOriginCoords] = useState(null)
  const [destinationName, setDestinationName] = useState('colombo')
  const navigate = useNavigate()

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
    const extractedCardId = window.location.pathname.split("/").pop()
    setCardId(extractedCardId)
    fetchPlaceById(extractedCardId)
  }, [])

  const fetchPlaceById = async (cardId) => {
    try {
      const response = await getPlaceByPlaceId(cardId)
      if (response.status === 200) {
        setData(response.data.data[0])
        setDestinationName(response.data ? `${response.data.data[0].title}` : "colombo")
      } else {
        console.error("Error fetching places:", response.message)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    }
  }

  const handleChangeStatus = async (status) => {
    try {
      const payload = {
        place_id: cardId,
        status: status
      }

      const response = await changeStatus(payload)

      if (response.status === 200) {
        toast.success(`Place status updated to ${status} successfully!`)
        setTimeout(() => {
          navigate(MANAGE_PLACE_PATH)  // Navigate to home after status change
        }, 2000)
      } else {
        toast.error("Failed to update status. Please try again.")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("An error occurred while updating the status.")
    }
  }


  const renderTags = () => {
    return data?.tags?.map((tag, index) => (
      <a key={index} href="/" onClick={(e) => e.preventDefault()}>
        <Badge className={classnames({ "me-50": index !== data.tags.length - 1 })} color={badgeColorsArr[tag]} pill>
          {tag}
        </Badge>
      </a>
    ))
  }

  return (
    <Fragment>
      <Breadcrumbs title="Place Details" data={[{ title: "Place" }, { title: "Details" }]} />

      {data !== null ? (
        <Row className="gy-4">
          <Col md="4" style={{ maxHeight: "520px"}}>

            <div className="pb-1">
              <CardImg src={data.img} className="w-100 rounded" style={{ maxHeight: "300px", objectFit: "cover" }} />
            </div>
            <div className="">
              <Card>
                <RouteMap  originCoords={originCoords} destinationName={destinationName} />
              </Card>

            </div>

          </Col>
          <Col md="7">
            <h1 className="fw-bold text-primary mb-2">{data.title}</h1>
            <div className="d-flex align-items-center mb-3">
              <Avatar img={data.user_image} imgHeight="50" imgWidth="50" className="me-2" />
              <div>
                <p className="text-muted">by {data.user_full_name}</p>
                <small className="text-muted">{moment(data.posted_date).format("lll")}</small>
              </div>
            </div>
            <div>{renderTags()}</div>

            <CardText className="mt-3 text-muted" dangerouslySetInnerHTML={{ __html: data.content }}></CardText>
            <div className="d-flex justify-content-start gap-4 mt-4">
              <Button
                color="success"
                onClick={() => handleChangeStatus("active")}
                disabled={data.status === "active"}
              >
                Approve
              </Button>
              <Button
                color="danger"
                onClick={() => handleChangeStatus("inactive")}
                disabled={data.status === "inactive"}
              >
                Decline
              </Button>
            </div>
          </Col>
        </Row>

      ) : null}
    </Fragment>
  )
}

export default BlogDetails
