import { useState, useCallback, useEffect } from 'react'
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
  Marker
} from '@react-google-maps/api'

const RouteMap = ({ originCoords, destinationName }) => {
  const [directions, setDirections] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // ✅ Correct way in Vite
    libraries: ['places']
  });


  useEffect(() => {
    if (isLoaded && originCoords && destinationName) {
      setIsLoading(true)
      const directionsService = new window.google.maps.DirectionsService()

      // Create origin point from coordinates
      const origin = new window.google.maps.LatLng(
        originCoords.lat,
        originCoords.lng
      )

      directionsService.route(
        {
          origin,
          destination: destinationName, // Google Maps API will geocode this string
          travelMode: window.google.maps.TravelMode.DRIVING
        },
        (result, status) => {
          setIsLoading(false)
          if (status === 'OK') {
            setDirections(result)
            setError(null)
          } else {
            setError(`Failed to find route: ${  status}`)
            setDirections(null)
          }
        }
      )
    }
  }, [isLoaded, originCoords, destinationName])

  if (!isLoaded) return <div>Loading Maps API...</div>
  if (isLoading) return <div>Calculating route...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div style={{ height: '400px', width: '100%' }}>
      <GoogleMap
        center={originCoords}
        zoom={12}
        mapContainerStyle={{ height: '100%', width: '100%' }}
        options={{
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: true,
          fullscreenControl: true
        }}
      >
         {/*Show marker for origin if no directions yet */}
        {!directions && (
          <Marker
            position={originCoords}
            title="Origin"
          />
        )}

         {/*Show the route if directions are available */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              suppressMarkers: false,
              polylineOptions: {
                strokeColor: '#2196F3',
                strokeWeight: 6
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  )
}

export default RouteMap