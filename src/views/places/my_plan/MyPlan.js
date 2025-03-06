import React, { useState, useEffect, Fragment } from "react"
import {
  Card, CardBody, Button, Row, Col,
  Modal, ModalHeader, ModalBody, Form, FormGroup,
  Label, Input, Spinner, Badge, Alert
} from "reactstrap"
import Select from "react-select"
import Flatpickr from "react-flatpickr"
import axios from "axios"
import toast from "react-hot-toast"
import Breadcrumbs from "@components/breadcrumbs"
import { getPlaceByCategoryId } from "@src/services/place"
import { getAllCategory } from "@src/services/category"
import { createTravelPlan, updateTravelPlan } from "@src/services/travelplan"
import "@styles/react/libs/flatpickr/flatpickr.scss"
import "@styles/base/pages/app-todo.scss"
import {
  Activity,
  Bell,
  Calendar,
  CheckCircle, Clipboard,
  Clock,
  DollarSign,
  Mail,
  Package,
  PlusCircle, Target,
  Users
} from "react-feather";
import moment from "moment";

const MyPlan = () => {
  const [plans, setPlans] = useState([])
  const [categories, setCategories] = useState([])
  const [places, setPlaces] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPlan, setCurrentPlan] = useState(null)

  // Form state
  const [formState, setFormState] = useState({
    place_id: null,
    travel_date: new Date(),
    email_address: "",
    budget: "",
    number_of_travelers: "",
    preferred_activities: "",
    special_notes: "",
    notification_preference: null,
    notification_days_before: ""
  })

  const userId = localStorage.getItem("userId") || 2
  const notificationOptions = [
    { value: "email", label: "📧 Email" },
    { value: "none", label: "📱 SMS" }
  ]

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        await fetchCategories()
        await fetchPlans()
      } catch (error) {
        toast.error("Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await getAllCategory()
      if (res.status === 200) {
 
      const categoriesData = res.data.categories.map((cat) => ({
        value: cat.id,
        label: cat.title
      }))
      setCategories(categoriesData)
      }
    } catch (error) {
      toast.error("Failed to fetch categories")
    }
  }

  // Fetch places when category changes
  useEffect(() => {
    const fetchPlacesByCategory = async () => {
      if (selectedCategory?.value) {
        try {
          const res = await getPlaceByCategoryId(selectedCategory.value)
          setPlaces(res.data.places.map(p => ({
            value: p.id,
            label: p.title,
            img: p.img
          })))
        } catch (error) {
          toast.error("Failed to fetch places")
        }
      }
    }
    fetchPlacesByCategory()
  }, [selectedCategory])

  // Fetch travel plans
  const fetchPlans = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/travel-plans?user_id=${userId}`
      )
      setPlans(res.data.data.travel_plans)
    } catch (error) {
      toast.error("Failed to fetch plans")
    }
  }

  // Handle form changes
  const handleChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value })
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const payload = {
      ...formState,
      user_id: userId,
      place_id: formState.place_id?.value,
      travel_date: formState.travel_date.toISOString(),
      notification_preference: formState.notification_preference?.value
    }

    try {
      let response
      if (currentPlan) {
        response = await updateTravelPlan(payload, currentPlan.id)
        toast.success(response.message || "Plan updated successfully")
      } else {
        response = await createTravelPlan(payload)
        toast.success(response.message || "Plan created successfully")
      }
      await fetchPlans()
      closeModal()
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Edit plan handler
  const handleEdit = (plan) => {
    setCurrentPlan(plan)
    setFormState({
      ...formState,
      place_id: { value: plan.place_id, label: plan.place_title },
      travel_date: new Date(plan.travel_date),
      email_address: plan.email_address,
      budget: plan.budget,
      number_of_travelers: plan.number_of_travelers,
      preferred_activities: plan.preferred_activities,
      special_notes: plan.special_notes,
      notification_preference: notificationOptions.find(
        opt => opt.value === plan.notification_preference
      ),
      notification_days_before: plan.notification_days_before
    })
    setModalOpen(true)
  }

  // Close modal
  const closeModal = () => {
    setModalOpen(false)
    setCurrentPlan(null)
    setSelectedCategory(null)
    setFormState({
      place_id: null,
      travel_date: new Date(),
      email_address: "",
      budget: "",
      number_of_travelers: "",
      preferred_activities: "",
      special_notes: "",
      notification_preference: null,
      notification_days_before: ""
    })
  }

  // Plan Card Component
  const PlanCard = ({ plan }) => (
    <Col md="6" lg="3" className="mb-5">
      <Card
        className="h-100 shadow-sm hover-shadow-lg transition"
        onClick={() => handleEdit(plan)}
      >
        <div className="position-relative">
          <img
            src={plan.place_img}
            alt={plan.place_title}
            className="card-img-top"
            style={{ height: "220px", objectFit: "cover", borderTopLeftRadius: '0.375rem', borderTopRightRadius: '0.375rem' }}
          />
          <div className="position-absolute top-0 start-0 end-0 d-flex justify-content-between p-2">
            <Badge pill className="bg-danger d-flex align-items-center">
              <Bell size={14} className="me-1" />
              {plan.notification_days_before || 0}d Reminder
            </Badge>
            <Badge pill className="bg-secondary">
              <Clock size={14} className="me-1" />
              {new Date(plan.created_at).toLocaleDateString()}
            </Badge>
          </div>
        </div>

        <CardBody className="d-flex flex-column">
          <div className="">
            <h5 className="mb-1 d-flex align-items-center">
              {plan.place_title}
              <Badge color="success" className="ms-5" pill>
                <CheckCircle size={20} className="me-sm-1" />
                Rs. {plan.budget.toLocaleString()}
              </Badge>
            </h5>

            <div className="d-flex align-items-center text-muted">
              <Mail size={16} className="me-1" />
              <small className="text-truncate">{plan.email_address}</small>
            </div>
          </div>


          <div className="mt-auto">
            <div className="d-flex justify-content-between mb-2">
              <div className="d-flex align-items-center">
                <Calendar size={18} className="me-1 text-primary" />
                <small>{`Trip Date `}</small>
                <span className="fw-semibold">{` : `}
                {moment(new Date(plan.travel_date).toLocaleDateString()).format("ll")}
              </span>
              </div>
              <div className="d-flex align-items-center">
                <Users size={18} className="me-1 text-info" />
                <span className="fw-semibold">{plan.number_of_travelers}</span>
              </div>
            </div>

            {plan.preferred_activities && (
              <div className="d-flex align-items-center mb-2">
                <Target  size={18} className="me-1 text-warning" />
                <Badge color="warning" className="text-truncate" pill>
                  {plan.preferred_activities}
                </Badge>
              </div>
            )}

            {plan.special_notes && (
              <div className="d-flex align-items-center mb-2">
                <Clipboard size={18} className="me-1 text-success" />

                <small className="text-muted text-truncate">{plan.special_notes.split(" ").slice(0, 8).join(" ")}..</small>
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mt-2">
              <Badge color="light-primary" className="text-uppercase">
                {plan.notification_preference}
              </Badge>
              <small className="text-muted">
                Created: {new Date(plan.created_at).toLocaleDateString()}
              </small>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  )

  return (
    <div className="app-todo">
      <Row>
        <Col md={10}>
          <Breadcrumbs title="My Travel Plans" data={[{ title: "Dashboard" }, { title: "My Plans" }]} />
        </Col>
        <Col md={2}>
          <Button
            color="success"
            onClick={() => setModalOpen(true)}
            className="shadow mt-1"
          >
            <PlusCircle size={20}/>  Create New Plan
          </Button>
        </Col>
      </Row>
        <hr className={'mt-0 text-secondary'} />
      {isLoading ? (
        <div className="text-center">
          <Spinner className={'text-success mt-5'}/>
          <p>Loading ...</p>
        </div>
      ) : plans.length > 0 ? (
        <Row className={'d-flex justify-content-center flex-wrap'}>
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Row>
      ) : (
        <Alert color="secondary" className="text-center">
          <div className="alert-body">
            <h4 className="text-secondary mb-2">No Travel Plans Found!</h4>
            <p className="mb-0">Click the button above to create your first travel plan</p>
          </div>
        </Alert>
      )}

      <Modal
        isOpen={modalOpen}
        toggle={closeModal}
        className="modal-dialog-centered modal-lg"
        contentClassName="shadow-lg border-0"
      >
        <ModalHeader toggle={closeModal} className="bg-light">
          <h3 className="mb-0">
            {currentPlan ? "✏️ Edit Travel Plan" : "✨ Create New Plan"}
          </h3>
        </ModalHeader>
        <ModalBody className="pb-2">
            <Form onSubmit={handleSubmit}>
              <Row className="">
                <Col md={4}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Category</Label>
                    <Select
                      options={categories}
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      placeholder="Select category"
                      isSearchable
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Destination</Label>
                    <Select
                      options={places}
                      value={formState.place_id}
                      onChange={(selected) => setFormState({ ...formState, place_id: selected })}
                      placeholder="Select destination"
                      isSearchable
                      isLoading={!places.length}
                      noOptionsMessage={() => "Please select category first"}
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Travel Date</Label>
                    <Flatpickr
                      className="form-control"
                      value={formState.travel_date}
                      onChange={date => setFormState({ ...formState, travel_date: date[0] })}
                      options={{ dateFormat: 'Y-m-d', minDate: 'today' }}
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Contact Email</Label>
                    <Input
                      type="email"
                      name="email_address"
                      value={formState.email_address}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Total Budget (Rs.)</Label>
                    <Input
                      type="number"
                      name="budget"
                      value={formState.budget}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={4}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Number of Travelers</Label>
                    <Input
                      type="number"
                      name="number_of_travelers"
                      value={formState.number_of_travelers}
                      onChange={handleChange}
                      required
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Preferred Activities</Label>
                    <Input
                      type="textarea"
                      name="preferred_activities"
                      value={formState.preferred_activities}
                      onChange={handleChange}
                      placeholder="e.g., Hiking, Sightseeing, etc."
                      rows="4"
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Special Notes</Label>
                    <Input
                      type="textarea"
                      name="special_notes"
                      value={formState.special_notes}
                      onChange={handleChange}
                      rows="4"
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Notification Method</Label>
                    <Select
                      options={notificationOptions}
                      value={formState.notification_preference}
                      onChange={selected => setFormState({ ...formState, notification_preference: selected })}
                      placeholder="Select notification method"
                      isSearchable={false}
                    />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label><span className={'text-danger fw-bold fs-5'}>* </span>Reminder Before (Days)</Label>
                    <Input
                      type="number"
                      name="notification_days_before"
                      value={formState.notification_days_before}
                      onChange={handleChange}
                      placeholder="Optional"
                      min="0"
                      max="30"
                    />
                  </FormGroup>
                </Col>
              </Row>

              <div className="text-center mt-1">
                <Button
                  color="primary"
                  className="me-2 px-4"
                  disabled={isSubmitting}
                >
                  {currentPlan ? "Update Plan" : "Create Plan"}
                </Button>
                <Button
                  color="secondary"
                  outline
                  className="px-4"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
              </div>
            </Form>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default MyPlan