import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';

// Google API 키
const googleMapsApiKey = 'AIzaSyBi7dTSWOJEE6JepCHm-ABWDjt2Yne_3cw';

// 공공 데이터 포털 인증키
const serviceKey = 'FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==';

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

// 근처 버스 정류소를 찾는 함수
const getNearbyBusStops = async (latitude, longitude) => {
  try {
    const response = await axios.get('http://apis.data.go.kr/1613000/BusSttnInfoInqireService/getCrdntPrxmtSttnList', {
      params: {
        serviceKey: serviceKey,
        gpsLati: latitude,
        gpsLong: longitude,
        numOfRows: 10,
        pageNo: 1,
        _type: 'json',
      },
    });

    // 응답 데이터 구조 로깅
    console.log('근처 버스 정류소 응답 데이터:\n', JSON.stringify(response.data, null, 1));


    if (response.data.response && response.data.response.header && response.data.response.header.resultCode === '00') {
      return response.data.response.body.items.item;
    } else {
      console.error('API 응답 오류:', response.data.response.header.resultMsg || 'Unknown error');
      return [];
    }
  } catch (error) {
    console.error('API 호출 오류:', error.message || error);
    return [];
  }
};

// 메인 컴포넌트
const BusApp = () => {
  const [location, setLocation] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [nearestBusStop, setNearestBusStop] = useState(null);

  const handleSearch = async (query) => {
    const results = await searchPlaces(query);
    setSearchResults(results);
  };

  const handleSelectPlace = async (place) => {
    const coordinates = await getCoordinates(place.description);
    setLocation(place.description);
    setSelectedPlace(coordinates);
    setSearchResults([]);
  };

  const handleGetNearbyBusStops = async () => {
    if (!selectedPlace) {
      console.error('장소가 선택되지 않았습니다.');
      return;
    }

    try {
      const busStops = await getNearbyBusStops(selectedPlace.lat, selectedPlace.lng);
      if (busStops.length === 0) {
        console.error('근처 버스 정류소를 찾을 수 없습니다.');
        return;
      }

      console.log('근처 버스 정류소 목록:', busStops);


    } catch (error) {
      console.error('근처 버스 정류소를 찾는 중 오류 발생:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>장소:</Text>
      <TextInput
        style={styles.input}
        placeholder="장소를 입력하세요"
        value={location}
        onChangeText={(text) => {
          setLocation(text);
          handleSearch(text);
        }}
      />
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectPlace(item)}
            >
              <Text>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <Button
        title="근처 정류소 찾기"
        onPress={handleGetNearbyBusStops}
        disabled={!selectedPlace}
      />
      {nearestBusStop && (
        <View style={styles.locationInfo}>
          <Text>선택한 장소: {location}</Text>
          <Text>위도: {selectedPlace.lat}</Text>
          <Text>경도: {selectedPlace.lng}</Text>
          <Text>가장 가까운 정류장: {nearestBusStop.sttnNm}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resultItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  locationInfo: {
    marginTop: 20,
  },
});

export default BusApp;