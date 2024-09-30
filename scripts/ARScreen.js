import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroImage,
  ViroTrackingReason,
  ViroTrackingStateConstants,
} from "@reactvision/react-viro";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import { useNavigation } from '@react-navigation/native';


const alarmImage = require('../image/ar/alarm.png');
const noPlacesImage = require('../image/ar/alarm2.png'); // 추가된 이미지
const backtohomeImage = require('../image/ar/backtohome.png');
const foundcoinpaper = require('../image/ar/foundcoin/foundcoinpaper.png');

// 이미지 파일 경로를 require로 불러오기
const JeongDongJin = require('../image/ar/place/JeongDongJin.png');
const noodle = require('../image/ar/place/noodle.png');
const eateryg = require('../image/ar/place/eateryg.png');
const bori = require('../image/ar/place/bori.png');
const sun = require('../image/ar/place/sun.png');
const santorini = require('../image/ar/place/santorini.png');
const bosa = require('../image/ar/place/bosa.png');
const eastcoffee = require('../image/ar/place/eastcoffee.png');
const sibi = require('../image/ar/place/sibi.png');

const locations = [
  {
    category: '관광지',
    places: [
      {
        name: 'JeongDongJin',
        image: JeongDongJin,
        coordinates: { latitude: 37.7546233, longitude: 128.8799170 },
      },
      {
        name: 'sun',
        image: sun,
        coordinates: { latitude: 37.7866796, longitude: 128.8851259 },
      },
      {
          name: 'sibi',
          image: sibi,
          coordinates: { latitude: 37.8399325, longitude: 128.8697820 },
        },
    ],
  },
  {
    category: '식당',
    places: [
      { name: 'noodle', image: noodle, coordinates: { latitude: 37.7215947, longitude: 128.8817995 } },
      { name: 'bori', image: bori, coordinates: { latitude: 37.7177515, longitude: 128.8797010 } },
      { name: 'eateryg', image: eateryg, coordinates: { latitude: 37.7183532, longitude: 128.8808296 } },
    ],
  },
  {
    category: '카페',
    places: [
      { name: 'santorini', image: santorini, coordinates: { latitude: 37.7707270, longitude: 128.9501998 } },
      { name: 'bosa', image: bosa, coordinates: { latitude: 37.7720449, longitude: 128.9478398 } },
       { name: 'eastcoffee', image: eastcoffee, coordinates: { latitude: 37.7552490, longitude: 128.8789420} },
    ],
  },
];

const HelloWorldSceneAR = () => {
  const [text, setText] = useState("Initializing AR...");
  const [showAlarm, setShowAlarm] = useState(false);
  const [showNoPlaces, setShowNoPlaces] = useState(false);
  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [currentPosition, setCurrentPosition] = useState(null);

  function onInitialized(state, reason) {
    console.log("onInitialized", state, reason);
    if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
      setText("Hello World!");
    } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
      // Handle loss of tracking
    }
  }

  const getCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition(position.coords);
        console.log("Current Position:", position.coords);
        filterPlacesWithin1km(position.coords);
      },
      (error) => {
        console.log(error.code, error.message);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

const filterPlacesWithin1km = (currentCoords) => {
    const nearbyPlaces = locations.flatMap(location => location.places).filter(place => {
        const distance = getDistance(
            { latitude: currentCoords.latitude, longitude: currentCoords.longitude },
            { latitude: place.coordinates.latitude, longitude: place.coordinates.longitude }
        );
        console.log(`Distance to ${place.name}: ${distance} meters`); // 거리 출력
        return distance <= 100;  // 거리 계산 (미터 단위)
    });
    setFilteredPlaces(nearbyPlaces);
};


  const getDistance = (coords1, coords2) => {
    // Haversine 공식을 사용한 거리 계산
    const R = 6371e3; // 지구 반지름 (미터)
    const φ1 = coords1.latitude * Math.PI / 180;
    const φ2 = coords2.latitude * Math.PI / 180;
    const Δφ = (coords2.latitude - coords1.latitude) * Math.PI / 180;
    const Δλ = (coords2.longitude - coords1.longitude) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 미터 단위
  };

  useEffect(() => {
    getCurrentPosition();
  }, []);



  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      {/* 초기 이미지 제거 */}
      {filteredPlaces.length > 0 && filteredPlaces.map((place, index) => (
        <ViroImage
          key={index}
          source={place.image}
          scale={[1, 0.5, 0.5]} // 이미지 크기 조정
          position={[0, 0, -3]} // 위치 설정
        />
      ))}
    </ViroARScene>
  );
};

const App = () => {
const navigation = useNavigation();

  const handleBackToHomePress = () => {
    navigation.goBack();
  };

  const handlePress = (category) => {
    const selectedPlaces = locations.find(loc => loc.category === category)?.places || [];
    setFilteredPlaces(selectedPlaces);
    // 필요한 경우 AR에 선택된 장소를 추가하는 로직을 구현
  };

  return (
    <View style={styles.container}>
      {/* backtohome 버튼 추가 */}
      <TouchableOpacity style={styles.backtohome} onPress={handleBackToHomePress}>
        <Image source={backtohomeImage} style={styles.backtohomeImage} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.frame, styles.frame240]} onPress={() => handlePress('관광지')}>
        <Text style={styles.textSmall}>관광지</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.frame, styles.frame241]} onPress={() => handlePress('식당')}>
        <Text style={styles.textSmall}>식당</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.frame, styles.frame242]} onPress={() => handlePress('카페')}>
        <Text style={styles.textSmall}>카페</Text>
      </TouchableOpacity>

      {showAlarm && (
        <Image
          source={alarmImage}
          style={styles.alarmImage}
        />
      )}

      {showNoPlaces && (
        <Image
          source={noPlacesImage}
          style={styles.alarmImage}
          onLoad={() => console.log("No Places Image Loaded")}
          onError={() => console.log("No Places Image Error")}
        />
      )}
    </View>
  );
};

export default () => {
  return (
    <ViroARSceneNavigator
      autofocus={true}
      initialScene={{
        scene: HelloWorldSceneAR,
      }}
      style={styles.f1}
    />
  );
};

const styles = StyleSheet.create({
  f1: { flex: 1 },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  frame: {
    position: 'absolute',
    height: 30,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 34,
    gap: 8,
    shadowColor: 'rgba(100, 149, 237, 0.1)',
    borderRadius: 12,
  },
  backtohome: {
    position: 'absolute',
    top: 42,
    left: 21,
    width: 30, // Adjusted size for the button
    height: 30, // Adjusted size for the button
    resizeMode: 'cover', // 크기에 맞게 조정
  },
  frame240: { left: '5.56%', top: 76, elevation: 10 },
  frame241: { left: '35.83%', top: 76, elevation: 10 },
  frame242: { left: '66.39%', top: 76, elevation: 10 },
  textSmall: {
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 20,
    color: '#000000',
  },
  alarmImage: {
    position: 'absolute',
    top: 300,
    left: 30,
    width: 100,
    height: 100,
    resizeMode: 'contain', // 이미지를 비율에 맞게 조정
  },
});
