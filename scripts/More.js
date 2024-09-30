import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';

const MyComponent = ({route}) => {
  const navigation = useNavigation(); // Get the navigation object

const { userInfo } = route.params;
console.log(userInfo)
  //const postsCollection = firestore().collection('location');
  // Handler for image touch events
  const handleImagePress = (imageId) => {
    switch (imageId) {
      case '1a':
        navigation.navigate('RestaurantHome', { userInfo });
        break;
      case '1b':
        navigation.navigate('TourPlaceHome', { userInfo });
        break;
      case '1c':
        navigation.navigate('gangneungmap');
        break;
      case '2a':
        navigation.navigate('Tip');
        break;
      case '2b':
        navigation.navigate('gangneungnow');
        break;
      case '2c':
        navigation.navigate('home', { userInfo });
        break;
      case '3a':
        navigation.navigate('Weather');
        break;
      case '3b':
        navigation.navigate('CameraMenu');
        break;
      case '3c':
        navigation.navigate('Community', { userInfo });
        break;
      case '3d':
        navigation.navigate('ARScreen');
        break;
      case '3e':
        navigation.navigate('Tutorial', { userInfo });
        break;
      // case '4a':
      //   // 코멘트 처리
      //   console.log('4a pressed, currently commented out.');
        // break;
      default:
        console.log('Unknown image pressed');
    }
  };

  return (
    <View style={styles.container}>
      {/* 상태 표시줄 */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content" // 상태 표시줄 내용물 색상 설정
      />

      {/* 로고 */}
      <Image source={require('../image/mainhome/logo.png')} style={styles.logo} />

      {/* 첫 번째 제목과 내용 */}
      <Image source={require('../image/more/1.png')} style={styles.title} />
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('1a')}>
          <Image source={require('../image/more/1a.png')} style={styles.content} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImagePress('1b')}>
          <Image source={require('../image/more/1b.png')} style={styles.content} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('1c')}>
          <Image source={require('../image/more/1c.png')} style={styles.content} />
        </TouchableOpacity>
      </View>

      {/* 두 번째 제목과 내용 */}
      <Image source={require('../image/more/2.png')} style={styles.title} />
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('2a')}>
          <Image source={require('../image/more/2a.png')} style={styles.content} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImagePress('2b')}>
          <Image source={require('../image/more/2b.png')} style={styles.content} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('2c')}>
          <Image source={require('../image/more/2c.png')} style={styles.content} />
        </TouchableOpacity>
      </View>

      {/* 세 번째 제목과 내용 */}
      <Image source={require('../image/more/3.png')} style={styles.title} />
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('3a')}>
          <Image source={require('../image/more/3a.png')} style={styles.content} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImagePress('3b')}>
          <Image source={require('../image/more/3b.png')} style={styles.content} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('3c')}>
          <Image source={require('../image/more/3c.png')} style={styles.content} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleImagePress('3d')}>
          <Image source={require('../image/more/3d.png')} style={styles.content} />
        </TouchableOpacity>
      </View>
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('3e')}>
          <Image source={require('../image/more/3e.png')} style={styles.content} />
        </TouchableOpacity>
      </View>

      {/* 네 번째 제목과 내용
      <Image source={require('../image/more/4.png')} style={styles.title} />
      <View style={styles.contentRow}>
        <TouchableOpacity onPress={() => handleImagePress('4a')}>
          <Image source={require('../image/more/4a.png')} style={styles.content} />
        </TouchableOpacity>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    top: 20,
  },
  logo: {
    width: 77,
    height: 27.93, // 로고 크기
    marginBottom: 20,
  },
  title: {
    width: 116,
    height: 37, // 제목 크기
    marginBottom: 10,
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  content: {
    width: 150, // 내용 이미지 크기
    height: 44, // 내용 이미지 높이
  },
});

export default MyComponent;
