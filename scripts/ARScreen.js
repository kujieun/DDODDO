import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import { ViroARScene, ViroARSceneNavigator, ViroText, ViroTrackingStateConstants } from '@reactvision/react-viro';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

const HelloWorldSceneAR = ({ category }) => {
  const [places, setPlaces] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!category) return; // 카테고리가 설정되지 않은 경우 데이터 가져오지 않음

    function onLocationSuccess(position) {
      const { latitude, longitude } = position.coords;
      setUserLocation({ latitude, longitude });
      fetchNearbyPlaces(latitude, longitude, category).then(places => {
        console.log('============================');
        console.log('사용자의 현재 위치:');
        console.log(`위도: ${latitude}, 경도: ${longitude}`);
        console.log('============================');
        console.log('근처 장소 목록:');
        places.forEach((place, index) => {
          console.log(`장소 ${index + 1}:`);
          console.log(`이름: ${place.name}`);
          console.log(`별점: ${place.rating || '정보 없음'}`);
          console.log(`영업 상태: ${place.opening_hours ? (place.opening_hours.open_now ? '영업 중' : '영업 종료') : '알 수 없음'}`);
          console.log('----------------------------');
        });
        console.log('============================');
        setPlaces(places);
      });
    }

    function onLocationError(error) {
      console.error('위치 정보 가져오기 오류:', error);
    }

    Geolocation.getCurrentPosition(onLocationSuccess, onLocationError, {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 10000,
    });
  }, [category]);

  async function fetchNearbyPlaces(lat, lon, type) {
    const apiKey = 'AIzaSyBi7dTSWOJEE6JepCHm-ABWDjt2Yne_3cw';
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=1000&type=${type}&key=${apiKey}`;
    try {
      const response = await axios.get(url);
      // 상위 7개 장소만 반환
      return response.data.results.slice(0, 7);
    } catch (error) {
      console.error('API error:', error);
      return [];
    }
  }

  function onInitialized(state) {
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      // 정상적으로 추적됨
    }
  }

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // 지구 반지름 (미터 단위)
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // 거리 (미터)
  }

  function getPosition(place) {
    if (!userLocation) return [0, 0, -1];

    const { latitude: userLat, longitude: userLon } = userLocation;
    const { lat: placeLat, lng: placeLon } = place.geometry.location;

    const distance = calculateDistance(userLat, userLon, placeLat, placeLon) / 100;
    const angle = Math.atan2(placeLon - userLon, placeLat - userLat);

    const xPos = distance * Math.cos(angle);
    const zPos = distance * Math.sin(angle);

    return [xPos, 0, zPos];
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {places.length === 0 && category && (
        <ViroText

          text={`주변에 ${category} 정보가 없습니다.`}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={styles.helloWorldTextStyle}
        />
      )}
      {places.map((place, index) => (
        <ViroText
          key={index}
          text={`${place.name}\n별점: ${place.rating || '정보 없음'}\n영업 상태: ${place.opening_hours ? (place.opening_hours.open_now ? '영업 중' : '영업 종료') : '알 수 없음'}`}
          scale={[0.5, 0.5, 0.5]}
          position={getPosition(place)}
           style={{
              fontFamily: 'NotoSansKR-Bold', // 폰트 이름 설정
              fontSize: 20,
              color: '#ffffff',
              textAlign: 'center'
            }}
        />
      ))}
    </ViroARScene>
  );
};

const App = () => {
  const [category, setCategory] = useState(null); // 기본 값은 null로 설정

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="관광 명소" onPress={() => setCategory('tourist_attraction')} />
        <Button title="식당" onPress={() => setCategory('restaurant')} />
        <Button title="카페" onPress={() => setCategory('cafe')} />
      </View>
      {!category && <Text style={styles.text}>카테고리를 선택해주세요.</Text>}
      {category && (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{
            scene: () => <HelloWorldSceneAR category={category} />,
          }}
          style={styles.f1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  f1: { flex: 1 },
  helloWorldTextStyle: {
    fontFamily: 'NotoSansCJK',
    fontSize: 20,
    color: '#ffffff',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontSize: 18,
    margin: 20,
    fontFamily: 'NotoSansKR-Bold',
  },
  buttonText: {
    fontFamily: 'NotoSansKR-Bold',
  }
});

export default App;
