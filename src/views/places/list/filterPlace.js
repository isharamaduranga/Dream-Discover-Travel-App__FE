import React, { useEffect, useState } from "react"
import { Badge, Card, CardBody, CardImg, CardText, CardTitle, Col, Row } from "reactstrap"
import classnames from "classnames"
import { badgeColorsArr } from "@src/utility/text_details"
import { Link, useLocation } from "react-router-dom"
import Avatar from "@components/avatar"
import moment from "moment/moment"
import { MessageSquare } from "react-feather"

const SearchPlace = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    console.log("Location State:", location.state) // Debugging: Log the entire location.state
    if (location.state?.searchData) {
      console.log("Received Data:", location.state.searchData) // Debugging: Log the received data
      setData(location.state.searchData)
      setLoading(false)
    } else {
      console.log("No searchData found in location.state") // Debugging: Log if no data is found
      setData([])
      setLoading(false)
    }
  }, [location.state])

  const renderPlaceCards = () => {
    return data.map((item) => (
      <Col key={item.id} md="4" className="mb-1">
        <Card>
          <Link to={`/pages/blog/detail/${item.id}`}>
            <CardImg
              top
              src={item.image}
              alt={item.title}
              style={{
                height: "250px",
                objectFit: "cover",
                borderBottom: "3px solid #eee"
              }}
            />
          </Link>
          <CardBody>
            <CardTitle tag="h3">
              <Link to={`/pages/blog/detail/${item.id}`} className="blog-title-truncate">
                {item.title}
              </Link>
            </CardTitle>
            <div className="d-flex align-items-center mb-2">
              <Avatar
                className="me-50"
                img={item.user_image}
                imgHeight="30"
                imgWidth="30"
              />
              <div>
                <small className="text-muted me-25">by</small>
                <small className="fw-bold">
                  {item.user_full_name}
                </small>
                <span className="mx-50">|</span>
                <small className="text-secondary">
                  {moment(item.posted_date).format("lll")}
                </small>
              </div>
            </div>

            <div className="my-1 py-25">
              {item.category?.map((cat, index) => (
                <Badge
                  key={index}
                  className={classnames({ "me-50": index !== item.category.length - 1 })}
                  color={badgeColorsArr[cat]}
                  pill
                >
                  {cat}
                </Badge>
              ))}
            </div>
            <CardText className="blog-content-truncate">
              {item.content?.split(" ").slice(0, 15).join(" ") || "No description available"}...
            </CardText>
            <hr />
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <MessageSquare size={16} className="me-50" />
                <span className="fw-bold">
                  {item.comments_count} Comments
                </span>
              </div>
              <Link to={`/pages/blog/detail/${item.id}`} className="fw-bold">
                Read More
              </Link>
            </div>
          </CardBody>
        </Card>
      </Col>
    ))
  }

  return (
    <div className="container mt-4">
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center my-5 py-5">
          <h4>No places found matching your criteria</h4>
        </div>
      ) : (
        <Row className={'d-flex justify-content-center align-content-center flex-wrap'}>{renderPlaceCards()}</Row>
      )}
    </div>
  )
}

export default SearchPlace