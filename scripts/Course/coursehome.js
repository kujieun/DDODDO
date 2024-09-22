import React, { useState, useEffect ,useMemo} from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar,  Image, FlatList, ActivityIndicator, ScrollView , TextInput} from 'react-native';

const SignupScreen = () => {
  // 검색 아이콘 클릭 시 searchbox 표시
    const handleSearchPress = () => {
      setSearchVisible(!searchVisible);
    };

      // searchbox 표시 여부를 관리하는 상태 추가
        const [searchVisible, setSearchVisible] = useState(false);



          // 장소 검색 'searchText' 상태 추가
              const [searchText, setSearchText] = useState('');


  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { /* 뒤로가기 기능 구현 */ }}
          style={styles.backButtonContainer}
        >
          <Image source={require('../../image/signup/backbutton.png')} style={styles.backButton} />
        </TouchableOpacity>
        <Text style={styles.headerText}>추천 코스</Text>
                <TouchableOpacity
                  onPress={handleSearchPress}
                  style={styles.searchButtonContainer}
                >
                  <Image source={require('../../image/restaurant/searchicon.png')} style={styles.searchIcon} />
                </TouchableOpacity>
      </View>

      {/* searchbox 표시 */}
                  {searchVisible && (
                    <View style={styles.searchBoxContainer}>
                      <Image source={require('../../image/restaurant/searchbox.png')} style={styles.searchBox} />
                      <TextInput
                        style={styles.searchInput}
                        placeholder="장소 이름 검색"
                        placeholderTextColor="#999"
                        value={searchText}
                        onChangeText={(text) => setSearchText(text)}
                      />
                    </View>
                  )}

        {/* Line 추가 */}
            <View style={styles.lineContainer}>
              <View style={styles.line} />
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
      fontFamily: 'Pretendard-SemiBold',
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
    searchButtonContainer: {
      position: 'absolute',
      right: 5,
      top: 30,
      width: 42,
      height: 50,
      justifyContent: 'center',
      backgroundColor: '#FFFFFF',
    },
    searchIcon: {
    top:2,
      width: 19,
      height: 19,
    },
    lineContainer: {
        position: 'absolute',
        top:81,
        width: '100%',
        flexDirection: 'row',
        height: 2,
        backgroundColor: '#6495ED',
      },
      line: {
        width: 60,
        height: 2,
      },
      searchBoxContainer: {
            position: 'absolute',
            left: '5.28%',
            right: '14.72%',
            top: 40,
            height: 38,
            flexDirection: 'row',
            alignItems: 'center',
          },
          searchBox: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            resizeMode: 'contain', // 이미지 비율 유지
          },
          searchInput: {
            flex: 1,
            marginLeft: 10, // 여백
            color: '#111',
            fontSize: 16,
          },
});

export default SignupScreen;
