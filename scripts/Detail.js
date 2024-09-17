import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View, TouchableOpacity, StatusBar, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; // Navigation hook 추가

const TourPlaceHome = ({ route }) => {
  const navigation = useNavigation();
  const { contentid } = route.params; // `contentId`, 'title'을 받아옵니다.
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tourData, setTourData] = useState([]);
  const [placeName, setPlaceName] = useState('');

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get('https://apis.data.go.kr/B551011/KorService1/detailCommon1', {
        params: {
          serviceKey: 'FQpciKW/JvtOmZVINTmwg2cOAZ2XZqKAZAluhDuoWqQXqDBoJFK48P+uEyIcNqIYPYT6HJzKxdYXuwD9nOX+CA==',
          numOfRows: 10,
          pageNo: 1,
          MobileOS: 'AND',
          MobileApp: '또,강릉',
          _type: 'json',
          defaultYN: 'Y',
          contentId: contentid,
          firstImageYN: 'Y',
          overviewYN: 'Y',
          addrinfoYN: 'Y',
          mapinfoYN: 'Y',
        },
      });

      console.log('API Response:', response.data);

      if (response.status === 200 && response.data.response?.body?.items?.item) {
        const items = response.data.response.body.items.item;

        const formattedData = items.map(item => ({
          title: item.title || "No Title",
          overview: item.overview || "No Overview",
          firstimage: item.firstimage || '',
          addr1: item.addr1 || "No Address",
          tel: item.tel || "No Phone Number",
          homepage: item.homepage || "No Website",
          mapx: item.mapx || null,
          mapy: item.mapy || null,
        }));

        setTourData(formattedData);
         setPlaceName(items[0].title || 'Unknown Place');
         console.log(`Number of images fetched: ${formattedData.length}`);
      } else {
        setError('No items found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, []);

  const handleBackButton = () => {
      navigation.goBack(); // 이전 화면으로 돌아가는 함수
    };

  const handleActionPress = () => {
    setIsLiked(!isLiked);
  };

  if (error) return <Text style={styles.error}>{`Error: ${error}`}</Text>;

  return (
    <View style={styles.container}>
      <StatusBar translucent={true} backgroundColor="transparent" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
           onPress={handleBackButton}
          style={styles.backButtonContainer}
        >
          <Image source={require('../image/signup/backbutton.png')} style={styles.backButton} />
        </TouchableOpacity>
         <Text style={styles.headerText}>{placeName}</Text>
        <TouchableOpacity
          onPress={handleActionPress}
          style={styles.actionButtonContainer}
        >
          <Image
            source={isLiked ? require('../image/restaurant/like.png') : require('../image/restaurant/unlike.png')}
            style={styles.actionIcon}
          />
        </TouchableOpacity>
      </View>

<View style={styles.backgroundContainer}></View>


      <View
        horizontal
        style={styles.imageView}

      >
        {tourData.map((place, index) => (
          <View key={index} style={styles.imageContainer}>
            <Image
              source={{ uri: place.firstimage }}
              style={styles.placeImage}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    top: 45,
    fontFamily: 'Pretendard',
    fontWeight: '600',
    fontSize: 16,
    color: '#111111',
  },
  backButtonContainer: {
    position: 'absolute',
    left: 20,
    top: 30,
    width: 39.51,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    width: 30,
    height: 30,
  },
  actionButtonContainer: {
    position: 'absolute',
    right: 5,
    top: 30,
    width: 42,
    height: 50,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  actionIcon: {
    top: 2,
    width: 19,
    height: 19,
    resizeMode: 'contain',
  },
  imageView: {
    marginTop: 80,
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: 265,
    marginRight: 10,
  },
  placeImage: {
    width: '100%',
    height: '100%',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
 backgroundContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 308,
    height: 223,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    zIndex:1,
  },

});

export default TourPlaceHome;
