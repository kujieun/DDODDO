import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native'; 

const MyPage = ({ route }) => {
  
  const [posts, setPosts] = useState([]);
  const [likedLocations, setLikedLocations] = useState([]);
  const navigation = useNavigation();
  const { userInfo } = route.params;

   // 추가한 상태 (아이콘 변경 관리)
   const [selectedTab, setSelectedTab] = useState({
    community: false,
    location: false,
    plan: false,
  });

  const [dataFetched, setDataFetched] = useState(false); // 데이터가 이미 가져왔는지 확인하는 상태


  //프로필 편집 페이지 이동 함수
  const gotoeditpage = () => {
    navigation.navigate('SignupNickname', {userInfo});
  }


  // Firestore에서 해당 유저의 게시글 가져오기
  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const postsCollection = await firestore()
          .collection('community') // 게시글 컬렉션
          .where('user.email', '==', userInfo.email) // 이메일이 일치하는 게시글만 필터링
          .get();

        const userPosts = postsCollection.docs.map((doc) => doc.data());
        setPosts(userPosts);
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };

    fetchUserPosts();
  }, [userInfo.email]);

 // Firestore에서 사용자가 좋아요한 장소 데이터 가져오기
 

  // likedLocations의 contentid로 API에서 상세 데이터 가져오기
  

  
  
  // 이미지 선택 핸들러
  const handleTabPress = async (tab) => {
    setSelectedTab((prevState) => ({
      community: tab === 'community' ? !prevState.community : false,
      location: tab === 'location' ? !prevState.location : false,
      plan: tab === 'plan' ? !prevState.plan : false,
    }));

  };

 // 게시글 목록 렌더링
 const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        {item.user.profileImage ? (
          <Image
            source={{ uri: item.user.profileImage }}
            style={styles.postProfileImage}
          />
        ) : (
          <View style={styles.nullprofile} />
        )}
        <Text style={styles.postNickname}>{item.user.name}</Text>
      </View>
  
      <Text style={styles.postDescription}>{item.content}</Text>
  
      {/* 이미지 렌더링 */}
      {item.images && item.images.length > 0 ? (
        <FlatList
          data={item.images}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={styles.postImage}
              onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      ) : (
        <View />
      )}
  
      {/* 태그 */}
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>#{tag}</Text>
          </View>
        ))}
      </View>
  
      <View style={styles.line44} />
    </View>
  );

  // like한 location 목록 렌더링
  const renderLocation = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.description}</Text>
  
      {/* location 이미지 렌더링 */}
      {item.image ? (
        <Image
          source={{ uri: item.image }}
          style={styles.postImage}
        />
      ) : (
        <View />
      )}
  
      <View style={styles.line44} />
    </View>
  );
  
  
  

  return (
    <View style={styles.container}>
      {/* 로고 */}
      <Image source={require('../img/mypage/logo.png')} style={styles.logo} />

      {/* 프로필 이미지와 닉네임, 편집 버튼 */}
      <View style={styles.profileContainer}>
        {/* 프로필 이미지 */}
        {userInfo.profileImage ? (
          <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={styles.nullprofile} />
        )}

        {/* 닉네임과 편집 버튼 */}
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userInfo.name}</Text>

          <View style={styles.editContainer}>
            <Text style={styles.editText}>프로필 편집</Text>
            <TouchableOpacity onPress={gotoeditpage}>
              <Image source={require('../img/mypage/edit.png')} style={styles.editIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 버튼 3개 추가 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={() => handleTabPress('community')}>
          <Image
            source={
              selectedTab.community
                ? require('../img/mypage/selectcommunity.png')
                : require('../img/mypage/community.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('location')}>
          <Image
            source={
              selectedTab.location
                ? require('../img/mypage/selectlocation.png')
                : require('../img/mypage/location.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabPress('plan')}>
          <Image
            source={
              selectedTab.plan
                ? require('../img/mypage/selectplan.png')
                : require('../img/mypage/plan.png')
            }
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>

       {/* 사용자가 작성한 게시글 표시 */}
       {selectedTab.community && (
            <FlatList
                data={posts}
                renderItem={renderPost}
                keyExtractor={(item, index) => index.toString()}
                style={styles.postList}
                ListEmptyComponent={<Text style={styles.noPostsText}>작성한 게시글이 없습니다.</Text>}
            />
        )}

        {/* 사용자가 like한 location 정보 표시 */}
        {selectedTab.location && (
        <FlatList
          data={likedLocations}
          renderItem={renderLocation}
          keyExtractor={(item) => item.contentId.toString()}
          ListEmptyComponent={<Text>좋아요한 장소가 없습니다.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  logo: {
    width: '100%',
    height: '3.5%',
    left: '-32%',
    resizeMode: 'contain',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: '7%',
    left: '-10%',
  },
  profileImage: {
    width: 75,
    height: 75,
    borderRadius: 50,
    marginRight: 20,
  },
  nullprofile: {
    width: 40,
    height: 40,
    backgroundColor: '#D9D9D9',
    borderRadius: 12,
    marginRight: 10,
  },
  profileInfo: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 19,
    fontWeight: '500',
    color: 'black',
    marginBottom: 5,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editText: {
    fontSize: 13,
    color: '#646C79',
    marginRight: 2,
  },
  editIcon: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
  },
  postList: {
    // marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  postContent: {
    fontSize: 14,
  },
  noPostsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 20,
  },
  postContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  postImage: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
    marginRight: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: '#DDDEE0',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 12,
    marginRight: 10,
  },
  postNickname: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '600',
    fontSize: 15,
    lineHeight: 22,
    color: '#111111',
  },
  postDescription: {
    fontFamily: 'Pretendard',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.025,
    color: '#646C79',
    textAlign: 'left',
    marginBottom: 10,
  },
  line44: {
    width: 350,
    height: 0,
    borderWidth: 0.2,
    borderColor: 'rgba(221, 222, 224, 1)',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',   // 가로로 나열
    justifyContent: 'space-between', // 아이콘 간격 균등
    alignItems: 'center',
    width: '100%',  // 화면 꽉 채움
    paddingHorizontal: 20,  // 좌우 여백 추가
  },
  icon: {
    width: 100,  
    height: 100,
    resizeMode: 'contain',  // 이미지를 비율에 맞게
  },
});

export default MyPage;
