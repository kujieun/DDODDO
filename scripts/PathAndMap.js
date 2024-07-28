/* 장소 입력 -> 검색 -> 선택
 * 경로 찾기 -> 정보들 표시
 * 지도에 경로 표시 (대중교통, 도보 색 다르게)
*/

import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions, Button, ScrollView } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import axios from 'axios';
import polyline from '@mapbox/polyline';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { width, height } = Dimensions.get('window');
const API_KEY = 'AIzaSyBi7dTSWOJEE6JepCHm-ABWDjt2Yne_3cw'; // Replace with your Google Maps API key

const getCoordinates = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: API_KEY,
      },
    });

    if (response.data.status === 'OK') {
      const { lat, lng } = response.data.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error('Geocoding API 호출 오류:', response.data.status);
      return { lat: null, lng: null };
    }
  } catch (error) {
    console.error('Geocoding API 호출 오류:', error);
    return { lat: null, lng: null };
  }
};

const getDirections = async (origin, destination) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        mode: 'transit',
        key: API_KEY,
        language: 'ko',
        alternatives: true,
      },
    });

    return response.data;
  } catch (error) {
    console.error('경로 검색 API 호출 오류:', error);
    return null;
  }
};

const LocationApp = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [selectedStartPlace, setSelectedStartPlace] = useState(null);
  const [selectedEndPlace, setSelectedEndPlace] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [walkingPaths, setWalkingPaths] = useState([]);
  const [transitPaths, setTransitPaths] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [transitInfo, setTransitInfo] = useState(null);

  const handleSelectPlace = async (place, type) => {
    const coordinates = await getCoordinates(place.description);

    if (type === 'start') {
      setStartLocation(place.description);
      setSelectedStartPlace(coordinates);
    } else {
      setEndLocation(place.description);
      setSelectedEndPlace(coordinates);
    }
  };

  const findRoute = async () => {
    if (selectedStartPlace && selectedEndPlace) {
      setLoading(true);
      setError(null);
      const origin = `${selectedStartPlace.lat},${selectedStartPlace.lng}`;
      const destination = `${selectedEndPlace.lat},${selectedEndPlace.lng}`;
      const data = await getDirections(origin, destination);

      if (data && data.routes.length > 0) {
        const walking = [];
        const transit = [];

        data.routes[0].legs[0].steps.forEach(step => {
          const encodedPoints = step.polyline?.points;
          if (encodedPoints) {
            const decodedPoints = polyline.decode(encodedPoints).map(point => ({
              latitude: point[0],
              longitude: point[1],
            }));
            if (step.travel_mode === 'WALKING') {
              walking.push(decodedPoints);
            } else if (step.travel_mode === 'TRANSIT') {
              transit.push(decodedPoints);
            }
          }
        });

        setWalkingPaths(walking);
        setTransitPaths(transit);

        setTransitInfo(data.routes[0].legs[0].steps.map(step => ({
          distance: step.distance.text,
          duration: step.duration.text,
          instructions: step.html_instructions,
          travel_mode: step.travel_mode,
          transit_details: step.transit_details,
        })));
      } else {
        setError('경로를 찾을 수 없습니다. 입력을 확인해 주세요.');
      }
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        placeholder="출발지를 입력하세요"
        onPress={(data, details) => handleSelectPlace(data, 'start')}
        query={{
          key: API_KEY,
          language: 'ko',
          components: 'country:kr',
        }}
        fetchDetails={true}
        enablePoweredByContainer={false}
        styles={styles.search}
      />
      <GooglePlacesAutocomplete
        placeholder="도착지를 입력하세요"
        onPress={(data, details) => handleSelectPlace(data, 'end')}
        query={{
          key: API_KEY,
          language: 'ko',
          components: 'country:kr',
        }}
        fetchDetails={true}
        enablePoweredByContainer={false}
        styles={styles.search}
      />

      <View style={styles.buttonContainer}>
        <Button
          title="경로 찾기"
          onPress={() => {
            if (selectedStartPlace && selectedEndPlace) {
              findRoute();
            } else {
              setError('출발지와 도착지를 모두 선택해 주세요.');
            }
          }}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {loading && <ActivityIndicator size="large" color="#0000ff" />}
        {error && <Text style={styles.error}>{error}</Text>}
        {transitInfo && (
          <View style={styles.transitInfo}>
            {transitInfo.map((step, index) => (
              <View key={index} style={styles.stepContainer}>
                <Text style={styles.stepDistance}>{step.distance} - {step.duration}</Text>
                <Text style={styles.stepInstructions}>
                  {step.instructions.replace(/<\/?b>/g, '')}
                </Text>
                {step.travel_mode === 'TRANSIT' && step.transit_details && (
                  <View>
                    <Text style={styles.stepTransitMode}>
                      {step.transit_details.line.vehicle.type} {step.transit_details.line.name}
                    </Text>
                    {step.transit_details.line.short_name && (
                      <Text style={styles.stepTransitNumber}>
                        버스 노선: {step.transit_details.line.short_name}
                      </Text>
                    )}
                    {step.transit_details.line.agencies.length > 0 && (
                      <Text style={styles.stepTransitAgency}>
                        {step.transit_details.line.agencies[0].name}
                      </Text>
                    )}
                    {step.transit_details.line.number && (
                      <Text style={styles.stepTransitNumber}>
                        {step.transit_details.line.number}
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: selectedStartPlace ? selectedStartPlace.lat : 37.5665,
          longitude: selectedStartPlace ? selectedStartPlace.lng : 126.978,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {selectedStartPlace && (
          <Marker coordinate={{ latitude: selectedStartPlace.lat, longitude: selectedStartPlace.lng }} title="출발지" />
        )}
        {selectedEndPlace && (
          <Marker coordinate={{ latitude: selectedEndPlace.lat, longitude: selectedEndPlace.lng }} title="도착지" />
        )}
        {walkingPaths.map((path, index) => (
          <Polyline
            key={`walking-${index}`}
            coordinates={path}
            strokeColor="blue" // 도보 경로의 색상
            strokeWidth={3}
          />
        ))}
        {transitPaths.map((path, index) => (
          <Polyline
            key={`transit-${index}`}
            coordinates={path}
            strokeColor="red" // 대중교통 경로의 색상
            strokeWidth={3}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  search: {
    container: {
      flex: 0,
    },
    textInput: {
      height: 40,
      borderColor: '#ddd',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 8,
      paddingHorizontal: 8,
    },
    listView: {
      backgroundColor: 'white',
    },
    description: {
      fontSize: 16,
    },
  },
  buttonContainer: {
    marginVertical: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  transitInfo: {
    marginVertical: 10,
  },
  stepContainer: {
    marginVertical: 5,
  },
  stepDistance: {
    fontWeight: 'bold',
  },
  stepInstructions: {
    marginVertical: 5,
  },
  stepTransitMode: {
    color: 'blue',
  },
  stepTransitNumber: {
    color: 'green',
  },
  stepTransitAgency: {
    color: 'purple',
  },
  map: {
    width: width*0.9,
    height: height * 0.5,
  },
});

export default LocationApp;
