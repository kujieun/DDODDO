import React, { useState } from "react";
import { Button, Modal, ScrollView, Text,StatusBar, View, StyleSheet, TouchableOpacity, Image, Dimensions, TouchableWithoutFeedback  } from "react-native";
import FastImage from 'react-native-fast-image';

const backtohomeImage = require('../../image/game/backtohome.png');
const backgroundRectangleImage = require('../../image/game/tutorialbackground.png');
const goldCoinImage = require('../../image/game/topcoin/gold.png');
const silverCoinImage = require('../../image/game/topcoin/silver.png');
const itemTextOnImage = require('../../image/game/storetext/itemtexton.png');
const itemTextOffImage = require('../../image/game/storetext/itemtextoff.png');
const presentTextOnImage = require('../../image/game/storetext/presenttexton.png');
const presentTextOffImage = require('../../image/game/storetext/presenttextoff.png');

const textImages = [
  require('../../image/game/tutorialtext/text1.png'),
  require('../../image/game/tutorialtext/text2.png'),
  require('../../image/game/tutorialtext/text3.png'),
  require('../../image/game/tutorialtext/text4.png'),
  require('../../image/game/tutorialtext/text5.png'),
];

const images = {
  'store_sea': require('../../image/game/store/store_sea.png'),
  'store_vintage': require('../../image/game/store/store_vintage.png'),
  'store_forest': require('../../image/game/store/store_forest.png'),
  'store_window_sea': require('../../image/game/store/store_window_sea.png'),
  'store_frame': require('../../image/game/store/store_frame.png'),
  'store_wheel': require('../../image/game/store/store_wheel.png'),
  'store_round_rug': require('../../image/game/store/store_round_rug.png'),
  'store_rectangle_rug': require('../../image/game/store/store_rectangle_rug.png'),
  'store_shell_sofa': require('../../image/game/store/store_shell_sofa.png'),
  'store_green_sofa': require('../../image/game/store/store_green_sofa.png'),
  'store_pot': require('../../image/game/store/store_pot.png'),
  'store_shell': require('../../image/game/store/store_shell.png'),
  'store_bottle': require('../../image/game/store/store_bottle.png'),
  'store_desk': require('../../image/game/store/store_desk.png'),
  'store_eye': require('../../image/game/store/store_eye.png'),
  'store_dragon': require('../../image/game/store/store_dragon.png'),
  'present_1': require('../../image/game/store/store_gift1.png'),
  'present_2': require('../../image/game/store/store_gift2.png'),
  'present_3': require('../../image/game/store/store_gift3.png'),
};


const categoriesName= [
  '전체', '벽과 바닥', '창문', '벽 장식물', '러그', '소파', '오른쪽 장식물', '왼쪽 장식물', '순찌 옷'
];

const item = {
  전체: [
    { id: 'sea', name: '바다 배경', storeImage: 'store_sea', silvercoin: 6 },
    { id: 'vintage', name: '빈티지 배경', storeImage: 'store_vintage', silvercoin: 6 },
    { id: 'forest', name: '숲 속 창문', storeImage: 'store_forest', silvercoin: 6 },
    { id: 'sea_window', name: '바닷속 창문', storeImage: 'store_window_sea', silvercoin: 6 },
    { id: 'frame', name: '액자', storeImage: 'store_frame', silvercoin: 3 },
    { id: 'wheel', name: '타륜 장식', storeImage: 'store_wheel', silvercoin: 3 },
    { id: 'round', name: '둥근 러그', storeImage: 'store_round_rug', silvercoin: 4 },
    { id: 'rectangle', name: '사각 러그', storeImage: 'store_rectangle_rug', silvercoin: 4 },
    { id: 'shell', name: '조개 소파', storeImage: 'store_shell_sofa', silvercoin: 6 },
    { id: 'green', name: '초록 소파', storeImage: 'store_green_sofa', silvercoin: 6 },
    { id: 'pot', name: '화분', storeImage: 'store_pot', silvercoin: 3 },
    { id: 'shell_decoration', name: '조개 조명', storeImage: 'store_shell', silvercoin: 3 },
    { id: 'bottle', name: '오크통', storeImage: 'store_bottle', silvercoin: 4 },
    { id: 'desk', name: '협탁', storeImage: 'store_desk', silvercoin: 4 },
    { id: 'eye', name: '잠옷', storeImage: 'store_eye', goldcoin: 5 },
    { id: 'dragon', name: '용용이', storeImage: 'store_dragon', goldcoin: 6 },
  ],
  '벽과 바닥': [
    { id: 'sea', name: '바다 배경', storeImage: 'store_sea', silvercoin: 6 },
    { id: 'vintage', name: '빈티지 배경', storeImage: 'store_vintage', silvercoin: 6 },
  ],
  창문: [
    { id: 'forest', name: '숲 속 창문', storeImage: 'store_forest', silvercoin: 6 },
    { id: 'sea_window', name: '바닷속 창문', storeImage: 'store_window_sea', silvercoin: 6 },
  ],
  '벽 장식물': [
    { id: 'frame', name: '액자', storeImage: 'store_frame', silvercoin: 3 },
    { id: 'wheel', name: '타륜 장식', storeImage: 'store_wheel', silvercoin: 3 },
  ],
  러그: [
    { id: 'round', name: '둥근 러그', storeImage: 'store_round_rug', silvercoin: 4 },
    { id: 'rectangle', name: '사각 러그', storeImage: 'store_rectangle_rug', silvercoin: 4 },
  ],
  소파: [
    { id: 'shell', name: '조개 소파', storeImage: 'store_shell_sofa', silvercoin: 6 },
    { id: 'green', name: '초록 소파', storeImage: 'store_green_sofa', silvercoin: 6 },
  ],
  '오른쪽 장식물': [
    { id: 'pot', name: '화분', storeImage: 'store_pot', silvercoin: 3 },
    { id: 'shell_decoration', name: '조개 조명', storeImage: 'store_shell', silvercoin: 3 },
  ],
  '왼쪽 장식물': [
    { id: 'bottle', name: '오크통', storeImage: 'store_bottle', silvercoin: 4 },
    { id: 'desk', name: '협탁', storeImage: 'store_desk', silvercoin: 4 },
  ],
  '순찌 옷': [
    { id: 'eye', name: '잠옷', storeImage: 'store_eye', goldcoin: 5 },
    { id: 'dragon', name: '용용이', storeImage: 'store_dragon', goldcoin: 6 },
  ],
};

const Present = [
    {id: 'present1', name: '선물1', storeImage: 'present_1', silvercoin: 6},
    {id: 'present2', name: '선물2', storeImage: 'present_2', silvercoin: 6},
    {id: 'present3', name: '선물3', storeImage: 'present_3', silvercoin: 6},
];

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height; // 화면 높이 추가

const FrameComponent = () => {
  const [selectedMenu, setSelectedMenu] = useState('menu1'); // 기본값은 'menu1'
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // 텍스트 인덱스 상태
  const [isAngry, setIsAngry] = useState(false);
  const [goldCoinCount, setGoldCoinCount] = useState(0); // 예시 값
  const [silverCoinCount, setSilverCoinCount] = useState(5); // 예시 값
  const [isItemBoxVisible, setIsItemBoxVisible] = useState(false); // 새 상태 추가
    const [isItemTextOn, setIsItemTextOn] = useState(true);
    const [isPresentTextOn, setIsPresentTextOn] = useState(false);
    const [activeCategory, setActiveCategory] = useState("전체");
     const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState("");
    const [selectedPresent, setSelectedPresent] = useState(null);
    const [missionVisible, setMissionVisible] = useState(false); // 미션 창 표시 상태

  const handleBackToHomePress = () => {
    console.log('버튼 눌렀습니다');
  };

  const handlePress = () => {
    setIsAngry(true);
    setTimeout(() => {
      setIsAngry(false);
    }, 2000); // 1초 동안 angry gif를 보여줍니다.
  };

  const handleBarMenu = (menu) => {
      setSelectedMenu(menu);
            if (menu === 'menu2') {
                setIsItemBoxVisible((prev) => !prev); // menu2 클릭 시 item box 토글
                setMissionVisible(false); // menu2 클릭 시 미션 창 닫기
              } else if (menu === 'menu5') {
                setMissionVisible(true); // menu5 클릭 시 미션 창 열기
                setIsItemBoxVisible(false); // 다른 메뉴 클릭 시 item box 닫기
              } else {
                setIsItemBoxVisible(false); // 다른 메뉴 클릭 시 item box 닫기
                setMissionVisible(false); // 다른 메뉴 클릭 시 미션 창 닫기
              }
    };

   const closeItemBox = () => {
       setIsItemBoxVisible(false); // item box 닫기
     };


    // 텍스트 이미지 변경 함수
    const handleTextPress = () => {
      setCurrentTextIndex((prevIndex) => {
        // 5번째 이미지가 보일 때 클릭하면 이미지를 사라지게 설정
        if (prevIndex === 4) {
          return null; // 이미지를 보이지 않게 설정
        }
        return Math.min(prevIndex + 1, textImages.length - 1); // 인덱스 증가
      });
    };

const toggleItemText = () => {
  setIsItemTextOn(true);
  setIsPresentTextOn(false);  // Present Text는 비활성화
};

const togglePresentText = () => {
  setIsPresentTextOn(true);
  setIsItemTextOn(false);  // Item Text는 비활성화
};

const handleCategoryPress = (category) => {
    setActiveCategory(category);
  };

  // 카테고리에 맞는 아이템을 가져오는 함수
    const getFilteredItems = () => {
      return item[activeCategory] || []; // 선택된 카테고리의 아이템 반환
    };

    const chunkArray = (array, chunkSize) => {
      const result = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
      }
      return result;
    };
    const handleImagePress = (itemId) => {
        const selectedItem = Object.values(item).flat().find(i => i.id === itemId);
        if (selectedItem) {
          console.log(`Image pressed: ${itemId}`);
          setSelectedItemId(itemId);
          setSelectedItemName(selectedItem.name); // 선택한 아이템 이름 설정
          setModalVisible(true);
        }
      };

      // 이미지 클릭 시 모달을 띄우는 함수
      const handlePresentPress = (present) => {
        setSelectedPresent(present);  // 선택된 아이템 저장
        setModalVisible(true);  // 모달 표시
      };

      const handlePurchase = () => {
        console.log(`Item purchased: ${selectedItemId}`);
        // 아이템 구매 로직 추가
        setModalVisible(false);
      };

return (
  <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

    <TouchableOpacity style={styles.backtohome} onPress={handleBackToHomePress}>
      <Image source={backtohomeImage} style={styles.backtohomeImage} resizeMode="contain" />
    </TouchableOpacity>

    <Image source={backgroundRectangleImage} style={styles.backgroundRectangle} />

    <View style={styles.goldcoinContainer}>
      <Image source={goldCoinImage} style={styles.goldcoinImage} />
      <Text style={styles.goldcoinText}>{goldCoinCount}</Text>
    </View>

    <View style={styles.silvercoinContainer}>
      <Image source={silverCoinImage} style={styles.silvercoinImage} />
      <Text style={styles.silvercoinText}>{silverCoinCount}</Text>
    </View>

    <TouchableOpacity onPress={handlePress} style={styles.videocontainer}>
      <FastImage
        source={
          isAngry
            ? require('../../image/game/video/angry.gif')
            : require('../../image/game/video/usual.gif')
        }
        style={styles.gif}
        resizeMode="contain"
        onBuffer={this.onBuffer}
        onError={this.videoError}
      />
    </TouchableOpacity>

    {currentTextIndex !== null && currentTextIndex < textImages.length ? (
      <TouchableOpacity style={styles.textContainer} onPress={handleTextPress}>
        <Image source={textImages[currentTextIndex]} style={styles.textImage} resizeMode="contain" />
      </TouchableOpacity>
    ) : null}

{isItemBoxVisible && (
  <View style={styles.itemboxContainer}>
    <View style={styles.itemBox}>
      <View style={styles.itemTitleContainer}>
        <TouchableOpacity onPress={toggleItemText}>
          <Image
            source={isItemTextOn ? itemTextOnImage : itemTextOffImage}
            style={styles.itemTitleImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={togglePresentText}>
          <Image
            source={isPresentTextOn ? presentTextOnImage : presentTextOffImage}
            style={styles.itemTitleImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {isPresentTextOn && (
        <ScrollView style={styles.itemsContainer}>
          {chunkArray(Present, 4).map((row, rowIndex) => (
            <View key={rowIndex} style={styles.rowContainer}>
              {row.map((present) => (
                <TouchableOpacity
                  key={present.id}
                  style={styles.itemCard}
                  onPress={() => handlePresentPress(present)}  // 클릭 시 모달 띄우기
                >
                  <Image source={images[present.storeImage]} style={styles.itemImage} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      )}

      {isItemTextOn && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryContainer}
          >
            {categoriesName.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => handleCategoryPress(category)}
                style={[
                  styles.categoryButton,
                  activeCategory === category && styles.activeCategoryButton,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    activeCategory === category && styles.activeCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView style={styles.itemsContainer}>
            {chunkArray(getFilteredItems(), 4).map((row, rowIndex) => (
              <View key={rowIndex} style={styles.rowContainer}>
                {row.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.itemCard}
                    onPress={() => handleImagePress(item.id)}
                  >
                    <Image source={images[item.storeImage]} style={styles.itemImage} />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </>
      )}

      {/* Combined Modal Component */}
      <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedPresent ? (
              <Text style={styles.modalText}>"{selectedPresent.name}" 아이템을 구매할까요?</Text>
            ) : (
              <Text style={styles.modalText}>"{selectedItemName}" 아이템을 구매할까요?</Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handlePurchase}>
                <Text style={styles.buttonText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  </View>
)}



          <View style={styles.bottombarContainer}>
            <TouchableOpacity onPress={() => handleBarMenu('menu1')}>
              <Image
                source={selectedMenu === 'menu1'
                  ? require('../../image/game/barmenu/menu1on.png')
                  : require('../../image/game/barmenu/menu1off.png')}
                style={styles.bottombarImg}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleBarMenu('menu2')}>
              <Image
                source={selectedMenu === 'menu2'
                  ? require('../../image/game/barmenu/menu2on.png')
                  : require('../../image/game/barmenu/menu2off.png')}
                style={styles.bottombarImg}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleBarMenu('menu3')}>
              <Image
                source={selectedMenu === 'menu3'
                  ? require('../../image/game/barmenu/menu3on.png')
                  : require('../../image/game/barmenu/menu3off.png')}
                style={styles.bottombarImg}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleBarMenu('menu4')}>
              <Image
                source={selectedMenu === 'menu4'
                  ? require('../../image/game/barmenu/menu4on.png')
                  : require('../../image/game/barmenu/menu4off.png')}
                style={styles.bottombarImg}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleBarMenu('menu5')}>
              <Image
                source={selectedMenu === 'menu5'
                  ? require('../../image/game/barmenu/menu5on.png')
                  : require('../../image/game/barmenu/menu5off.png')}
                style={styles.bottombarImg}
              />
            </TouchableOpacity>
          </View>


{missionVisible && (
        <Image
          source={require('../../image/game/mission.png')}
          style={styles.missionpaper} // 스타일을 styles.image로 관리
          resizeMode="contain" // 이미지 크기 조정 방법
        />
      )}


        </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundRectangle: {
    position: 'absolute',
    top: 78,
    height: 677,
    width: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  backtohome: {
    position: 'absolute',
    top: 42,
    left: 21,
    width: 60,
    height: 22,
    zIndex: 2, // zIndex를 조정하여 다른 요소보다 위에 오도록 함
  },
  backtohomeImage: {
    width: 127, // 원하는 크기
    height: 22, // 원하는 크기
  },
  goldcoinContainer: {
    position: 'absolute',
    top: 89, // 필요에 따라 이 값을 조정
    left:20,
    alignItems: 'center',
  },
  goldcoinImage: {
    width: 100,
    height: 40,
  },
    goldcoinText: {
      left:50,
      top:5,
      position: 'absolute',
      fontSize: 18,
      fontWeight: 'bold',
      color: '#000000', // 텍스트 색상 조정
    },
    silvercoinContainer: {
      position: 'absolute',
      top: 89, // 필요에 따라 이 값을 조정
      left:100,
      alignItems: 'center',
    },
  silvercoinImage: {
    width: 100,
    height: 40,
  },
  silvercoinText: {
    left:50,
    top:5,
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000', // 텍스트 색상 조정
  },

  textContainer: {
      position: 'absolute',
      width: 360,
      height: 143,
      left: 0,
      top: 537,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textImage: {
      width: '100%',
      height: '100%',
    },

  bottombarContainer: {
    position: 'absolute',
    height: 83,
    width: screenWidth,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    elevation: 10,
    shadowColor: '#0000FF',
    borderTopLeftRadius: 10,  // 왼쪽 위 모서리만 둥글게
    borderTopRightRadius: 10, // 오른쪽 위 모서리만 둥글게
  },
  bottombarImg: {
    width: 38,
    height: 38,
  },
  videocontainer:{
top: screenHeight / 2 - 300, // 동영상 위치 조정 (높이의 절반에서 동영상 높이의 절반을 뺀 값)
          left: screenWidth / 2 - 180, // 동영상 가로의 절반
  },
  gif:{
      width:360,
      height:540,
  },



    itemboxContainer: {
        position: 'absolute',
        bottom: 0, // 필요에 따라 위치 조정
        width: screenWidth, // 핸드폰 가로 너비
      },
  itemBox: {
    height: 349,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 흰색, 불투명도 80%
    borderTopLeftRadius: 20, // 왼쪽 위 모서리
    borderTopRightRadius: 20, // 오른쪽 위 모서리
  },
  itemTitleContainer:{
      flexDirection: 'row',
      paddingHorizontal: 10,
      top:0,
      left:0,
      marginBottom:20,
  },
      itemTitleImage: {
        left:10,
        top:20,
        width: 58,  // Adjust as necessary
        height: 24,  // Adjust as necessary
        paddingHorizontal: 10, // Add some spacing between the images
      },
    categoryContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 10,
        top:0,
        left:10,
      },
      categoryButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3,
        paddingHorizontal: 20,
        gap: 8,
        height: 23,
        backgroundColor: '#DDDEE0',
        borderRadius: 10,
        marginRight: 10, // 버튼 간격
      },
      activeCategoryButton: {
          backgroundColor: '#FFB800',
        },
      categoryText: {
        fontFamily: 'Pretendard',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 17, // 140%에 해당하는 높이
        textAlign: 'center',
        color: '#111111',
      },
      itemsContainer: {
          padding: 10,
          marginBottom:80,
        },
        rowContainer: {
          flexDirection: 'row',
          marginBottom: 10, // 각 행 사이 간격

        },
        itemCard: {
          width: '25%', // 4개가 딱 맞게 배치되도록 설정
          aspectRatio: 1, // 정사각형 모양을 유지
        },
        itemImage: {
          width: '100%',
          height: '80%', // 이미지가 아이템 카드 안에서 차지하는 비율
          resizeMode: 'contain',
        },
modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: 100,
    height: 31,
    backgroundColor: '#DDDEE0',
    borderRadius: 5,
  },
  confirmButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    width: 100,
    height: 31,
    backgroundColor: '#FFE483',
    borderRadius: 5,
  },
  buttonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: '#000000',
  },
missionpaper: {
    position:'absolute',
    width:320,
    height:424,
  },
});

export default FrameComponent;
