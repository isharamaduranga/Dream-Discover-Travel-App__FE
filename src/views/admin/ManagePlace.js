import React, { Fragment, useState, useEffect } from "react"
import {
  Badge, Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row
} from "reactstrap"
import classnames from "classnames"
import { badgeColorsArr } from "@src/utility/text_details"
import { Link } from "react-router-dom"
import Avatar from "@components/avatar"
import moment from "moment"
import { MessageSquare } from "react-feather"
import { getAllPendingPlaces, getAllPlaces } from "@src/services/place"
import SpinnerComponent from "@components/spinner/Fallback-spinner"
import Breadcrumbs from "@components/breadcrumbs"
import { Assets } from "@src/assets/images"

function ManagePlace() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  /** Fetch All Places from Backend */
  const fetchAllPlaces = async () => {
    try {
      const response = await getAllPendingPlaces()
      if (response.status === 200) {
        // Combine both pending and inactive places
        const combinedPlaces = [
          ...(response.data.pending_places || []),
          ...(response.data.inactive_places || [])
        ]
        setData(combinedPlaces)
      } else {
        console.error("Error fetching places:", response.message)
      }
    } catch (error) {
      console.error("An error occurred:", error)
    } finally {
      setLoading(false)
    }
  }

  /** Check if no data is available */
  /** Check if no data is available */
  const isEmptyData = data.length === 0


  useEffect(() => {
    fetchAllPlaces()
  }, [])

  const renderPlaceList = () => {
    return data.map((item) => {
      const renderTags = () => {
        return item.tags.map((tag, index) => {
          return (
            <a key={index} href="/" onClick={(e) => e.preventDefault()}>
              <Badge
                className={classnames({
                  "me-50": index !== item.tags.length - 1
                })}
                color={badgeColorsArr[tag]}
                pill
              >
                {tag}
              </Badge>
            </a>
          )
        })
      }

      return (
        <Col key={item.id} md="4">
          <Card>
            <Link to={`/manage-place/pages/pending-place/detail/${item.id}`}>
              <CardImg
                style={{ maxHeight: "220px"  }}
                className="img-fluid"
                src={item.img}
                alt={item.title}
                top
              />
            </Link>
            <CardBody>
              <div className="d-flex justify-content-between align-items-center">
                <CardTitle tag="h4" className="text-truncate mb-0">
                  <Link
                    className="blog-title-truncate text-body-heading"
                    to={`/manage-place/pages/pending-place/detail/${item.id}`}
                  >
                    {item.title}
                  </Link>
                </CardTitle>
                <Badge color={item.status == 'pending' ? 'warning' : 'danger'} className="badge-glow">
                  {item.status}
                </Badge>
              </div>
              <div className="d-flex my-2">
                <Avatar
                  className="me-50"
                  img={item.user_image}
                  imgHeight="25"
                  imgWidth="25"
                />
                <div>
                  <small className="text-muted fw-bold me-25">by</small>
                  <small className={"fw-bold"}>
                    <a
                      className="text-body"
                      href="/"
                      onClick={(e) => e.preventDefault()}
                    >
                      {item.user_full_name}
                    </a>
                  </small>
                  <span className="text-dark ms-50 me-25">|</span>
                  <small className="text-secondary fw-bold">
                    {moment(item.posted_date).format("lll")}
                  </small>
                </div>
              </div>
              <div className="my-1 py-25">{renderTags()}</div>
              <CardText className="blog-content-truncate">
                {item.content.split(" ").slice(0, 10).join(" ")}...
              </CardText>
              <hr className={'text-secondary'}/>
              <div className="d-flex justify-content-center align-items-center">
                  <Link className="fw-bold " to={`/manage-place/pages/pending-place/detail/${item.id}`}>
                    View Request
                  </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }

  return (
    <div>
      {loading ? (
        <SpinnerComponent />
      ) : (
        <Fragment>
          <Breadcrumbs title="Manage Place Request" data={[{ title: "Places" }]} />
          <hr />
          <div className="blog-list-wrapper">
            <Row>{renderPlaceList()}</Row>
            <div className={'d-flex justify-content-center align-items-center-center mt-5 '}>
              <div className={"text-center"}>

                {isEmptyData && (
                  <div>
                  <img src={Assets.nomore} alt={"log_img"} width={250} />
                  <br/>
                  <div>No place requests available at the moment.</div>
                  </div>
                  )
                }
              </div>

            </div>

          </div>
        </Fragment>
      )}
    </div>
  )
}

export default ManagePlace
