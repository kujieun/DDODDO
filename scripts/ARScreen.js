import React, { useState, useEffect } from "react";
import {
  ViroARScene,
  ViroARSceneNavigator,
  ViroText,
} from "@reactvision/react-viro";
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, Image } from "react-native";
import Geolocation from 'react-native-geolocation-service';
import locations from './Location';

const alarmImage = require('../image/ar/alarm.png');
const noPlacesImage = require('../image/ar/alarm2.png'); // 추가된 이미지
const backtohomeImage = require('../image/ar/backtohome.png');
const foundcoinpaper = require('../image/ar/foundcoin/foundcoinpaper.png');

const FrameComponent = ({ onFilterChange, showAlarm, showNoPlaces }) => {
  const handlePress = (category) => {
    onFilterChange(category);
  };

  const handleBackToHomePress = () => {
      console.log('버튼 눌렀습니다');
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

const HelloWorldSceneAR = (props) => {
  const { userLocation, places, showFoundCoinPaper  } = props.sceneProps || {};
  const [text, setText] = useState("  ");

  function onInitialized(state, reason) {
    console.log("AR initialized", state, reason);
  }

  return (
    <ViroARScene onTrackingUpdated={onInitialized}>
      <ViroText
        text={text}
        scale={[0.5, 0.5, 0.5]}
        position={[0, 0, -1]}
        style={styles.helloWorldTextStyle}
      />
      {places && places.map((place, index) => (
        <ViroImage
          key={index}
          source={place.image}
          position={getPosition(userLocation, place, calculateDistance)}
          scale={[3.04, 0.92, 0.92]}
        />
      ))}

      {showFoundCoinPaper && (
              <ViroImage
                source={foundcoinpaper}
                position={[0, 0, -1]} // Adjust the position as needed
                scale={[0.5, 0.5, 0.5]} // Adjust the scale as needed
              />
            )}

    </ViroARScene>
  );
};

const ARSceneWithLocation = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showAlarm, setShowAlarm] = useState(false);
  const [showNoPlaces, setShowNoPlaces] = useState(false);
  const [showFoundCoinPaper, setShowFoundCoinPaper] = useState(false); // New state

const station = {
    coordinates: { latitude: 37.7550, longitude: 128.8767 },
  };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });
        console.log(`사용자의 현재 위치: 위도: ${latitude}, 경도: ${longitude}`);

        const distanceToStation = calculateDistance(latitude, longitude, station.coordinates.latitude, station.coordinates.longitude);
                if (distanceToStation <= 500) {
                  setShowFoundCoinPaper(true);
                } else {
                  setShowFoundCoinPaper(false);
                }

        // 초기 알람 이미지 표시
        setShowAlarm(true);
        setTimeout(() => setShowAlarm(false), 5000);

        const allPlaces = locations.flatMap(location => location.places);
        const filteredPlaces = allPlaces.filter(place => {
          const distance = calculateDistance(latitude, longitude, place.coordinates.latitude, place.coordinates.longitude);
          return distance <= 1000;
        });
        setPlaces(filteredPlaces);
        console.log("Filtered Places:", filteredPlaces);
        console.log("Nearby Places Length:", filteredPlaces.length);

        if (filteredPlaces.length === 0) {
          console.log("No places found, setting showNoPlaces to true.");
          setTimeout(() => {
            setShowNoPlaces(false);
          }, 2000);
        } else {
          setShowNoPlaces(false);
        }
      },
      (error) => {
        console.error("위치 정보 가져오기 오류:", error);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }, []);

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    if (userLocation) {
      const filteredPlaces = locations.find(location => location.category === category)?.places || [];
      const nearbyPlaces = filteredPlaces.filter(place => {
        const distance = calculateDistance(userLocation.latitude, userLocation.longitude,-1);
        return distance <= 1000;
      });

      setPlaces(nearbyPlaces);
      console.log("Filtered Places by Category:", nearbyPlaces);

      if (nearbyPlaces.length === 0) {
        setShowNoPlaces(true);
        console.log("No places found, setting showNoPlaces to true.");
        setTimeout(() => {
          setShowNoPlaces(false);
        }, 2000);
      } else {
        setShowNoPlaces(false);
      }
    }
  };

  return (
    <View style={styles.f1}>
      <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
      {userLocation ? (
        <ViroARSceneNavigator
          autofocus={true}
          initialScene={{ scene: HelloWorldSceneAR }}
          sceneProps={{ userLocation, places, showFoundCoinPaper  }}
          style={styles.arScene}
        />
      ) : (
        <Text> </Text>
      )}
      <FrameComponent onFilterChange={handleFilterChange} showAlarm={showAlarm} showNoPlaces={showNoPlaces} />
    </View>
  );
};

export default ARSceneWithLocation;

const styles = StyleSheet.create({
  f1: { flex: 1 },
  arScene: { flex: 1 },
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
  width: 6, // 반으로 줄임
  height: 1, // 반으로 줄임
  resizeMode: 'cover', // 크기에 맞게 조정
},

  frame240: { left: '5.56%', top: 76, elevation: 10 },
  frame241: { left: '35.83%', top: 76, elevation: 10 },
  frame242: { left: '66.39%', top: 76, elevation: 10 },
  textSmall: {
    width: 24,
    height: 22,
    fontFamily: 'Pretendard',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: -0.025,
    color: '#646C79',
  },
  helloWorldTextStyle: {
    fontFamily: "Arial",
    fontSize: 30,
    color: "#ffffff",
    textAlignVertical: "center",
    textAlign: "center",
  },
  alarmImage: {
    position: 'absolute',
    width: 320,
    height: 100,
    alignSelf: 'center',
    top: '50%',
    transform: [{ translateY: -50 }],
  },
});
