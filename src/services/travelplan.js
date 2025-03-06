import ApiService from "@src/services/apiService"

export async function createTravelPlan(planDetails) {
  const apiObject = {}
  apiObject.method = "POST"
  apiObject.authentication = false
  apiObject.endpoint = `travel-plans`
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  apiObject.multipart = true
  apiObject.body = planDetails
  return await ApiService.callApi(apiObject)
}

export async function updateTravelPlan(planDetails, travel_plan_id) {
  const apiObject = {}
  apiObject.method = "PUT"
  apiObject.authentication = false
  apiObject.endpoint = `travel-plans/${travel_plan_id}`
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  apiObject.multipart = true
  apiObject.body = planDetails
  return await ApiService.callApi(apiObject)
}