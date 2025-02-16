// ** React Imports
import { Link, useNavigate } from "react-router-dom"

// ** Icons Imports

// ** Custom Components
import InputPasswordToggle from "@components/input-password-toggle"

// ** Reactstrap Imports
import { Button, CardText, CardTitle, Col, Form, Input, Label, Row } from "reactstrap"


// ** Styles
import "@styles/react/pages/page-authentication.scss"
import { Assets } from "@src/assets/images"
import { useEffect, useState } from "react";
import { ADMIN_PATH, HOME_PATH } from "@src/router/routes/route-constant";
import { IS_LOGIN, USER_LOGIN_DETAILS } from "@src/router/RouteConstant";
import { validateLoginDetails } from "@src/utility/validation"
import SpinnerComponent from "@components/spinner/Fallback-spinner"
import { loginExistingClient } from "@src/services/user"
import toast from "react-hot-toast"
import themeConfig from "@configs/themeConfig";


// ** Google Maps API Key (Replace with your actual key)
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const Login = () => {

  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [location, setLocation] = useState({ latitude: null, longitude: null })
  const [form, setForm] = useState({
    username: "",
    password: ""
  })


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        error => {
          console.error("Error fetching location: ", error)
          toast.error("Unable to retrieve location")
        }
      )
    } else {
      toast.error("Geolocation is not supported by this browser.")
    }
  }, [])

  // ** Fetch location using Google Geolocation API
  // const fetchLocation = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://www.googleapis.com/geolocation/v1/geolocate?key=${GOOGLE_MAPS_API_KEY}`,
  //       { method: "POST" }
  //     )
  //     const data = await response.json()
  //
  //     if (data.location) {
  //       setLocation({
  //         latitude: data.location.lat,
  //         longitude: data.location.lng
  //       })
  //     } else {
  //       toast.error("Unable to retrieve accurate location from Google API.")
  //     }
  //   } catch (error) {
  //     console.error("Google Maps API Error:", error)
  //     toast.error("Error fetching location. Check API key and internet connection.")
  //   }
  // }
  //
  // useEffect(() => {
  //   fetchLocation()
  // }, [])

  const createLoginUser = form => {
    return {
      username: form.username ?? null,
      password: form.password ?? null,
      latitude: location.latitude,
      longitude: location.longitude
    }
  }

  const onTextChange = async (event) => {
    await setForm(prev => ({
        ...prev,
        [event.target.name]: event.target.value
      })
    )
  }

  const apiHandler = () => {
    if (validateLoginDetails(form)) {
      setLoading(true)
      loginExistingClient(createLoginUser(form))
        .then(response => {
          console.log('------------------->', response)
          if (response.data) {
            console.log("**********************>>>>>",response.data)
            const userData = {
              user_id:response.data.id,
              username:response.data.username,
              userRole:response.data.userRole,
              email:response.data.email,
              latitude: location.latitude,
              longitude: location.longitude
            }

            localStorage.setItem(USER_LOGIN_DETAILS, JSON.stringify(userData))
            localStorage.setItem(IS_LOGIN, response.data.userRole.toUpperCase())

            // Check user role and navigate accordingly
            if (userData.userRole === "admin") {

              navigate(ADMIN_PATH) // Navigate to Admin Dashboard
              //window.location.reload();
            } else {
              navigate(HOME_PATH) // Navigate to User Dashboard
            }
            toast.success(response.message)
          } else {
            toast.error(response.message)
          }

        })
        .catch(error => {
          console.error("API Request Error:", error.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }

  return (
    <>
      {loading === true ? (
        <SpinnerComponent />
      ) : (
        <div className="auth-wrapper auth-cover">
          <Row className="auth-inner m-0">
            <Col className="d-none d-lg-flex align-items-center m-0 p-0" lg="8" sm="12">
              <div className="w-100 d-lg-flex align-items-center justify-content-center">
                <img className="img-fluid" style={{ width: "100%", height: "100vh", objectFit: "cover" }}
                     src={Assets.nature_cover}
                     alt="Login Cover"
                />
              </div>
            </Col>
            <Col
              className="d-flex align-items-center auth-bg px-2 p-lg-5"
              lg="4"
              sm="12"
            >
              <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
                <div className={"text-center"}>
                  <img src={Assets.logo} alt={"log_img"} width={100} />
                </div>

                <CardTitle tag="h2" className="fw-bold mb-1">
                  Welcome to Dream Discover!
                </CardTitle>
                <CardText className="mb-2">
                  Please sign-in to your account and start the adventure
                </CardText>
                <Form
                  className="auth-login-form mt-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="mb-1">
                    <Label className="form-label" for="login-email">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="emailAddress"
                      placeholder="john@example.com"
                      name="username"
                      autoFocus
                      onChange={onTextChange}
                    />
                  </div>
                  <div className="mb-2 mt-2">
                    <div className="d-flex justify-content-between">
                      <Label className="form-label" for="login-password">
                        Password
                      </Label>
                      <Link to="/forgot-password">
                        <small>Forgot Password?</small>
                      </Link>
                    </div>
                    <InputPasswordToggle
                      className="input-group-merge"
                      id="password"
                      name="password"
                      onChange={onTextChange}
                    />
                  </div>
                  <div className="form-check mb-1">
                    <Input type="checkbox" id="remember-me" />
                    <Label className="form-check-label" for="remember-me">
                      Remember Me
                    </Label>
                  </div>
                  <hr className={"mt-1 mb-1"} />
                  <Button
                    color={"success"}
                    className={"signIn_btn mb-1"}
                    block
                    onClick={apiHandler}
                  >
                    Sign in
                  </Button>
                </Form>
                <p className="text-center mt-2">
                  <span className="me-25">New on our platform?</span>
                  <Link to="/register">
                    <span>Create an account</span>
                  </Link>
                </p>

              </Col>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}

export default Login
