import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';

// Google API 키
const googleMapsApiKey = 'AIzaSyBi7dTSWOJEE6JepCHm-ABWDjt2Yne_3cw';

// 장소 검색 함수
const searchPlaces = async (query) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
      params: {
        input: query,
        key: googleMapsApiKey,
        types: 'establishment',
        language: 'ko',
        components: 'country:kr',
      },
    });

    // '대한민국' 단어를 제거하는 함수
    const removeCountryName = (description) => description.replace(/대한민국/g, '').trim();

    // 검색 결과에서 '대한민국'을 제거
    const cleanedPredictions = response.data.predictions.map(prediction => ({
      ...prediction,
      description: removeCountryName(prediction.description),
    }));

    return cleanedPredictions;
  } catch (error) {
    console.error('장소 검색 API 호출 오류:', error);
    return [];
  }
};

// 주소를 좌표로 변환하는 함수 (Geocoding API 사용)
const getCoordinates = async (address) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address: address,
        key: googleMapsApiKey,
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

// 경로 검색 함수
const getDirections = async (origin, destination, mode) => {
  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin,
        destination,
        mode, // 이동 모드 설정
        key: googleMapsApiKey,
        language: 'ko', // 한국어로 응답 받기
        alternatives: true, // 대안 경로 요청
      },
    });

    return response.data;
  } catch (error) {
    console.error('경로 검색 API 호출 오류:', error);
    return null;
  }
};

// 메인 컴포넌트
const LocationApp = () => {
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  const [searchResultsStart, setSearchResultsStart] = useState([]);
  const [searchResultsEnd, setSearchResultsEnd] = useState([]);
  const [selectedStartPlace, setSelectedStartPlace] = useState(null);
  const [selectedEndPlace, setSelectedEndPlace] = useState(null);
  const [directions, setDirections] = useState([]);
  const [mode, setMode] = useState('transit'); // 기본 모드는 대중교통

  const handleSearchStart = async (query) => {
    const results = await searchPlaces(query);
    setSearchResultsStart(results);
  };

  const handleSearchEnd = async (query) => {
    const results = await searchPlaces(query);
    setSearchResultsEnd(results);
  };

  const handleSelectPlace = async (place, type) => {
    const coordinates = await getCoordinates(place.description);

    if (type === 'start') {
      setStartLocation(place.description);
      setSelectedStartPlace({ ...coordinates });
    } else {
      setEndLocation(place.description);
      setSelectedEndPlace({ ...coordinates });
    }

    if (type === 'start') {
      setSearchResultsStart([]);
    } else {
      setSearchResultsEnd([]);
    }
  };

  const findRoute = async () => {
    if (selectedStartPlace && selectedEndPlace) {
      const origin = `${selectedStartPlace.lat},${selectedStartPlace.lng}`;
      const destination = `${selectedEndPlace.lat},${selectedEndPlace.lng}`;
      const data = await getDirections(origin, destination, mode);

      if (data && data.routes.length > 0) {
        setDirections(data.routes);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderTransitDetails = (details) => (
    <View style={styles.transitDetails}>
      <Text>출발 정류소: {details.departure_stop?.name}</Text>
      <Text>도착 정류소: {details.arrival_stop?.name}</Text>
      <Text>출발 시간: {new Date(details.departure_time?.value * 1000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text>도착 시간: {new Date(details.arrival_time?.value * 1000).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text>버스 노선: {details.line?.short_name}</Text>
      <Text>방향: {details.headsign}</Text>
      <Text>정류장 수: {details.num_stops}개</Text>
      <Text>배차 간격: {details.headway ? `${details.headway / 60}분` : '정보 없음'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>출발지:</Text>
      <TextInput
        style={styles.input}
        placeholder="출발지를 입력하세요"
        value={startLocation}
        onChangeText={(text) => {
          setStartLocation(text);
          handleSearchStart(text);
        }}
      />
      {searchResultsStart.length > 0 && (
        <FlatList
          data={searchResultsStart}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectPlace(item, 'start')}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <Text style={styles.label}>도착지:</Text>
      <TextInput
        style={styles.input}
        placeholder="도착지를 입력하세요"
        value={endLocation}
        onChangeText={(text) => {
          setEndLocation(text);
          handleSearchEnd(text);
        }}
      />
      {searchResultsEnd.length > 0 && (
        <FlatList
          data={searchResultsEnd}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectPlace(item, 'end')}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.modeContainer}>
        {['transit', 'driving', 'walking', 'bicycling'].map((modeOption) => (
          <TouchableOpacity
            key={modeOption}
            style={[styles.modeButton, mode === modeOption && styles.modeButtonActive]}
            onPress={() => {
              setMode(modeOption);
              findRoute();
            }}
          >
            <Text style={[styles.modeButtonText, mode === modeOption && styles.modeButtonTextActive]}>
              {modeOption === 'transit' ? '대중교통' :
               modeOption === 'driving' ? '자동차' :
               modeOption === 'walking' ? '도보' : '자전거'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.directionsContainer}>
        {directions.length > 0 && (
          <View>
            {directions.map((route, routeIndex) => (
              <View key={routeIndex} style={styles.routeContainer}>
                <Text style={styles.routeTitle}>경로 {routeIndex + 1}:</Text>
                {route.legs.map((leg, legIndex) => (
                  <View key={legIndex} style={styles.legContainer}>
                    <Text style={styles.legText}>총 거리: {leg.distance.text}</Text>
                    <FlatList
                      data={leg.steps}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item, index }) => (
                        <View style={styles.stepContainer}>
                          <Text>구간 {index + 1}:</Text>
                          <Text>{item.html_instructions.replace(/<\/?b>/g, '')}</Text>
                          {item.transit_details && renderTransitDetails(item.transit_details)}
                        </View>
                      )}
                    />
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#343a40',
  },
  input: {
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderColor: '#dee2e6',
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  modeButtonActive: {
    backgroundColor: '#007bff',
    borderColor: '#0056b3',
  },
  modeButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  modeButtonTextActive: {
    color: '#ffffff',
  },
  directionsContainer: {
    marginTop: 20,
  },
  routeContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#343a40',
  },
  legContainer: {
    marginBottom: 15,
  },
  legText: {
    fontSize: 16,
    color: '#495057',
  },
  stepContainer: {
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f1f3f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  transitDetails: {
    marginTop: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 5,
    backgroundColor: '#ffffff',
  },
});

export default LocationApp;
