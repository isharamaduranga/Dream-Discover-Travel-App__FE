import ApiService from "@src/services/apiService"

export async function addNewPlace(placeDetails) {
  const apiObject = {}
  apiObject.method = "POST"
  apiObject.authentication = false
  apiObject.endpoint = "createPlace"
  apiObject.multipart = true
  apiObject.urlencoded = false
  apiObject.body = placeDetails
  return await ApiService.callApi(apiObject)
}

export async function getAllPlaces() {
  const apiObject = {}
  apiObject.method = "GET"
  apiObject.authentication = false
  apiObject.endpoint = "placesWithComments"
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  return await ApiService.callApi(apiObject)
}


export async function getAllPendingPlaces() {
  const apiObject = {}
  apiObject.method = "GET"
  apiObject.authentication = false
  apiObject.endpoint = "places/pending-inactive"
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  return await ApiService.callApi(apiObject)
}


export async function getPlaceByPlaceId(placeId) {
  const apiObject = {}
  apiObject.method = "GET"
  apiObject.authentication = false
  apiObject.endpoint = `placesWithComments/${placeId}`
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  return await ApiService.callApi(apiObject)
}

export async function getPlaceByCategoryId(categoryId) {
  const apiObject = {}
  apiObject.method = "GET"
  apiObject.authentication = false
  apiObject.endpoint = `categories/${categoryId}/places`
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  return await ApiService.callApi(apiObject)
}


export async function updateRateScoreInPlaceWithFeedback(placeId) {
  const apiObject = {}
  apiObject.method = "POST"
  apiObject.authentication = false
  apiObject.endpoint = `places/scoreAndUpdate/${placeId}`
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  return await ApiService.callApi(apiObject)
}

export async function searchPlaceByTypeText(searchText) {
  const apiObject = {}
  apiObject.method = "GET"
  apiObject.authentication = false
  apiObject.endpoint = `placesWithComments/search/${searchText}`
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  return await ApiService.callApi(apiObject)
}

export async function searchPlaceByTag_Min_Max(placeDetails) {
  const apiObject = {}
  apiObject.method = "POST"
  apiObject.authentication = false
  apiObject.endpoint = `places/getByPlace`
  apiObject.isBasicAuth = false
  apiObject.urlencoded = false
  apiObject.multipart = true
  apiObject.body = placeDetails
  return await ApiService.callApi(apiObject)
}

export async function changeStatus(placeDetails) {
  const apiObject = {}
  apiObject.method = "PATCH"
  apiObject.authentication = false
  apiObject.endpoint = "places/change-status"
  apiObject.multipart = false
  apiObject.urlencoded = false
  apiObject.body = placeDetails
  return await ApiService.callApi(apiObject)
}
