import React, { useState, useEffect } from "react";
import { Button, Modal, ScrollView, Text,StatusBar, View, StyleSheet, TouchableOpacity, Image, Dimensions, TouchableWithoutFeedback  } from "react-native";
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';

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

const storageimages = {
  'store_sea': require('../../image/game/storage/storageitem/box_sea.png'),
  'store_vintage': require('../../image/game/storage/storageitem/box_vintage.png'),
  'store_forest': require('../../image/game/storage/storageitem/box_forest.png'),
  'store_window_sea': require('../../image/game/storage/storageitem/box_window_sea.png'),
  'store_frame': require('../../image/game/storage/storageitem/box_frame.png'),
  'store_wheel': require('../../image/game/storage/storageitem/box_wheel.png'),
  'store_round_rug': require('../../image/game/storage/storageitem/box_round_rug.png'),
  'store_rectangle_rug': require('../../image/game/storage/storageitem/box_rectangle_rug.png'),
  'store_shell_sofa': require('../../image/game/storage/storageitem/box_shell_sofa.png'),
  'store_green_sofa': require('../../image/game/storage/storageitem/box_green_sofa.png'),
  'store_pot': require('../../image/game/storage/storageitem/box_pot.png'),
  'store_shell': require('../../image/game/storage/storageitem/box_shell.png'),
  'store_bottle': require('../../image/game/storage/storageitem/box_bottle.png'),
  'store_desk': require('../../image/game/storage/storageitem/box_desk.png'),
  'store_eye': require('../../image/game/storage/storageitem/box_eye.png'),
  'store_dragon': require('../../image/game/storage/storageitem/box_dragon.png'),
};

const placeimages = {
  'store_sea': require('../../image/game/placeitem/background_sea.png'),
  'store_vintage': require('../../image/game/placeitem/background_vintage.png'),
  'store_forest': require('../../image/game/placeitem/window_forest.png'),
  'store_window_sea': require('../../image/game/placeitem/window_sea.png'),
  'store_frame': require('../../image/game/placeitem/wall_frame.png'),
  'store_wheel': require('../../image/game/placeitem/wall_wheel.png'),
  'store_round_rug': require('../../image/game/placeitem/rug_round.png'),
  'store_rectangle_rug': require('../../image/game/placeitem/rug_rectangle.png'),
  'store_shell_sofa': require('../../image/game/placeitem/sofa_shell.png'),
  'store_green_sofa': require('../../image/game/placeitem/sofa_green.png'),
  'store_pot': require('../../image/game/placeitem/right_pot.png'),
  'store_shell': require('../../image/game/placeitem/right_shell.png'),
  'store_bottle': require('../../image/game/placeitem/left_bottle.png'),
  'store_desk': require('../../image/game/placeitem/left_desk.png'),
  'store_eye': require('../../image/game/placeitem/cloth.png'),
  'store_dragon': require('../../image/game/placeitem/dragon.png'),
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

const FrameComponent = ({route}) => {
  const [selectedMenu, setSelectedMenu] = useState('menu1'); // 기본값은 'menu1'
  const [currentTextIndex, setCurrentTextIndex] = useState(0); // 텍스트 인덱스 상태
  const [isAngry, setIsAngry] = useState(false);
  const [goldCoinCount, setGoldCoinCount] = useState(0); // 예시 값
  const [silverCoinCount, setSilverCoinCount] = useState(0); // 예시 값
  const [isItemBoxVisible, setIsItemBoxVisible] = useState(false); // 새 상태 추가
  const [isItem1BoxVisible, setIsItem1BoxVisible] = useState(false); // 새 상태 추가
  const [isItem2BoxVisible, setIsItem2BoxVisible] = useState(false); // 새 상태 추가
    const [isItemTextOn, setIsItemTextOn] = useState(true);
    const [isPresentTextOn, setIsPresentTextOn] = useState(false);
    const [activeCategory, setActiveCategory] = useState("전체");
     const [modalVisible, setModalVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [selectedItemName, setSelectedItemName] = useState("");
    const [selectedPresent, setSelectedPresent] = useState(null);
    const [missionVisible, setMissionVisible] = useState(false); // 미션 창 표시 상태
    const [purchasedItems, setPurchasedItems] = useState([]);
    const [errorMessage, setErrorMessage] = useState('확인');  // 에러 메시지 상태

    const {userInfo} = route.params;
    const screenWidth = Dimensions.get('window').width;
    
    const [selectedImage, setSelectedImage] = useState(null); // 선택된 이미지 상태
    const [background, setbackground] = useState(backgroundRectangleImage); // 선택된 이미지 상태
    const [left, setleft] = useState(null); 
    const [right, setright] = useState(null); 
    const [window, setwindow] = useState(null); 
    const [wall, setwall] = useState(null); 
    const [rug, setrug] = useState(null); 
    const [sofa, setsofa] = useState(null); 
    const [cloth, setcloth] = useState(null); 

    const [itemcheck, setitemcheck] = useState(false);


    const handleImgPress = (itemId) => {
      // 모든 카테고리에서 아이템을 검색
      const selectedItem = Object.values(item).flat().find(i => i.id === itemId);
      
      if (selectedItem) {
        console.log(`Image pressed: ${itemId}`);
        setSelectedItemId(itemId);
        setSelectedItemName(selectedItem.name); // 선택한 아이템 이름 설정
        setModalVisible(true);
        setErrorMessage('확인');
        // console.log(selectedItem.name)
 
    
        if(selectedItem.name === '바다 배경' || selectedItem.name === '빈티지 배경'){
          const image = placeimages[selectedItem.storeImage]; 
          setbackground(image); // 선택된 이미지를 상태에 저장
          setitemcheck(true);
        } else if (selectedItem.name === '숲 속 창문' || selectedItem.name === '바닷속 창문') {
          const image = placeimages[selectedItem.storeImage]; 
          setwindow(image); 
          setitemcheck(true);
        } else if (selectedItem.name === '액자' || selectedItem.name === '타륜 장식') {
            const image = placeimages[selectedItem.storeImage]; 
            setwall(image); 
            setitemcheck(true);
        } else if (selectedItem.name === '둥근 러그' || selectedItem.name === '사각 러그') {
            const image = placeimages[selectedItem.storeImage]; 
            setrug(image); 
            setitemcheck(true);
        } else if (selectedItem.name === '조개 소파' || selectedItem.name === '초록 소파') {
            const image = placeimages[selectedItem.storeImage]; 
            setsofa(image); 
            setitemcheck(true);
        } else if (selectedItem.name === '화분' || selectedItem.name === '조개 조명') {
            const image = placeimages[selectedItem.storeImage]; 
            setright(image); 
            setitemcheck(true);
        } else if (selectedItem.name === '오크통' || selectedItem.name === '협탁') {
            const image = placeimages[selectedItem.storeImage]; 
            setleft(image); 
            setitemcheck(true);
        } else if (selectedItem.name === '잠옷' || selectedItem.name === '용용이') {
            const image = placeimages[selectedItem.storeImage]; 
            setcloth(image); 
            setitemcheck(true);
        }

        setitemcheck(false);



      }

     
    };
    


   // DB에 보관함, 미션 클리어 내용, 코인 값 업로드
    useEffect(() => {
      const uploadUserData = async () => {
        try {
          // 보관함, 미션 클리어 내용, 코인 값 설정
          const userData = {
            purchasedItems: purchasedItems,      // 보관함 (구매한 아이템)
            missionsCleared: isClaimed,    // 미션 클리어 상태
            silverCoin: silverCoinCount,         // 실버 코인 값
            goldCoin: goldCoinCount,              // 골드 코인 값
            background: background,
            left: left,
            right: right,
            window: window,
            wall: wall,
            rug: rug,
            sofa: sofa,
            cloth: cloth,
          };

          // 해당 유저의 도큐먼트를 업데이트 또는 생성
          await firestore().collection('game').doc(userInfo.email).set(userData, { merge: true });

          console.log('데이터 업로드 성공:', userData);
        } catch (error) {
          console.error('데이터 업로드 중 에러 발생:', error);
        }
      };

      // 실버코인, 골드코인, 미션 클리어 내용이 업데이트될 때 업로드 실행
      uploadUserData();
    }, [silverCoinCount, goldCoinCount, purchasedItems, isClaimed, itemcheck]);



    // 보관함, 미션 클리어 내용, 코인 값 받아오기
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userDoc = await firestore().collection('game').doc(userInfo.email).get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            
          // 가져온 데이터를 상태로 설정
          setPurchasedItems(userData.purchasedItems || []); // 보관함
          setIsClaimed(userData.missionsCleared || []); // 미션 클리어 내용
          setSilverCoinCount(userData.silverCoin || 0); // 실버 코인 값
          setGoldCoinCount(userData.goldCoin || 0); // 골드 코인 값

          setbackground(userData.background || null);
          setleft(userData.left || null);
          setright(userData.right || null);
          setwindow(userData.window || null);
          setwall(userData.wall || null);
          setrug(userData.rug || null);
          setsofa(userData.sofa || null);
          setcloth(userData.cloth || null);

          console.log('사용자 데이터 불러오기 성공:', userData);
        } else {
          console.log('사용자 문서가 존재하지 않습니다.');
        }
      } catch (error) {
        console.error('데이터를 가져오는 중 에러 발생:', error);
      }
    };

    fetchUserData(); // 컴포넌트가 마운트될 때 데이터 가져오기
  }, []);     

    

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
        setIsItemBoxVisible((prev) => !prev); // itemBox를 토글
        setMissionVisible(false);
        setIsItem2BoxVisible(false); // item2Box는 닫음
        setIsItem1BoxVisible(false); // item2Box는 닫음
    } else if (menu === 'menu3') {
            setIsItem1BoxVisible((prev) => !prev); // item2Box를 토글
            setIsItemBoxVisible(false); // itemBox는 닫음
            setIsItem2BoxVisible(false);
            setMissionVisible(false);
    } else if (menu === 'menu4') {
        setIsItem2BoxVisible((prev) => !prev); // item2Box를 토글
        setIsItemBoxVisible(false); // itemBox는 닫음
        setIsItem1BoxVisible(false); // item2Box는 닫음
        setMissionVisible(false);
    } else if (menu === 'menu5') {
        setMissionVisible(true); // mission 화면을 보임
        setIsItemBoxVisible(false);
        setIsItem1BoxVisible(false); // item2Box는 닫음
        setIsItem2BoxVisible(false);

    } else {
        setIsItemBoxVisible(false);
        setMissionVisible(false);
        setIsItem2BoxVisible(false);
    }
};

  // 사용 시 storeImage 경로를 동적으로 설정
  const getImage = (isItem1BoxVisible, storeImage) => {
    if (isItem1BoxVisible) {
      return storageimages[storeImage] || images[storeImage];
    }
    return images[storeImage];
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

    const getItems = () => {
      return item.전체; // 선택된 카테고리의 아이템 반환
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
          setErrorMessage('확인');
        }
      };

      // 이미지 클릭 시 모달을 띄우는 함수
      const handlePresentPress = (present) => {
        setSelectedPresent(present);  // 선택된 아이템 저장
        setModalVisible(true);  // 모달 표시
      };

      const handlePurchase = () => {
        // const selectedItem = item[activeCategory].find(i => i.id === selectedItemId);

        const silvercoinCost = (item[activeCategory].find(i => i.id === selectedItemId)?.silvercoin || 0);  // 실버 코인 가격
        const goldcoinCost = (item[activeCategory].find(i => i.id === selectedItemId)?.goldcoin || 0);      // 골드 코인 가격

        // 실버 코인으로 구매하는 경우
        if (silvercoinCost > 0) {
          if (silverCoinCount >= silvercoinCost) {
            // 코인이 충분하면 구매 가능
            setSilverCoinCount(prevCount => prevCount - (item[activeCategory].find(i => i.id === selectedItemId)?.silvercoin || 0));
          } else {
            setErrorMessage('코인부족');  // 실버 코인이 부족할 경우 메시지
            return;
          }
        }

        // 골드 코인으로 구매하는 경우
        if (goldcoinCost > 0) {
          if (goldCoinCount >= goldcoinCost) {
            // 코인이 충분하면 구매 가능
            setGoldCoinCount(prevCount => prevCount - (item[activeCategory].find(i => i.id === selectedItemId)?.goldcoin || 0));  // 골드 코인 차감
          } else {
            setErrorMessage('코인부족');  // 골드 코인이 부족할 경우 메시지
            return;
          }
        }

        // 구매한 아이템 ID를 상태에 추가
        setPurchasedItems(prevItems => [...prevItems, selectedItemId]);
        setModalVisible(false);
        setErrorMessage('확인');  // 구매 성공 시, 에러 메시지 초기화

      };


      /*==============미션 가져오기==============*/

      // 미션 데이터 배열
      const missions = [
          { index: 1, text: '회원 가입하기', silvercoin: 5 },
          // { index: 2, text: '여행 계획 세우기', silvercoin: 3 },
          // { index: 3, text: '카카오톡 공유하기', silvercoin: 3 },
          // { index: 4, text: '카카오톡 공유하기(0/5)', silvercoin: 6 },
          { index: 5, text: '커뮤니티 좋아요 누르기 (0/10)', silvercoin: 4 },
          { index: 6, text: '커뮤니티 좋아요 누르기 (0/20)', silvercoin: 5 },
          { index: 7, text: '커뮤니티 좋아요 누르기 (0/30)', silvercoin: 6 },
      ];
 
      const [likes, setLikes] = useState(0);
      const [likedPosts, setLikedPosts] = useState([]);
      const [check, setCheck] = useState(false);
      const [isClaimed, setIsClaimed] = useState({}); // 미션 완료 상태를 객체로 관리

     // Firestore에서 좋아요 수와 사용자 좋아요 목록 가져오기
      useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userDoc = await firestore()
              .collection('game')
              .doc(userInfo.email)
              .get();

            if (userDoc.exists) {
              const userData = userDoc.data();
              setLikedPosts(userData.likedPosts || []); // 사용자 좋아요 목록
              setLikes(likedPosts.length);
            } else {
              console.log('사용자 문서가 존재하지 않습니다.');
            }
          } catch (error) {
            console.error('사용자 데이터를 가져오는 중 에러 발생:', error);
          }
        };

        fetchUserData();
      }, [check]); 
      
      
      
    
      

      const TaskItem = ({ text, silvercoin, onTaskComplete }) => {
        // checkLikedPosts();
        console.log(likes);
        setCheck(true)
        const handleClaim = () => {
            if (text === '회원 가입하기') {
                onTaskComplete(silvercoin); // 은화 추가 
                setIsClaimed(prev => ({ ...prev, [text]: true }));
            }else if (text.includes('커뮤니티 좋아요 누르기')) {
              const requiredLikes = parseInt(text.match(/\d+/g)[1]); // 현재 좋아요 수를 가져옴
              if (likes >= requiredLikes) {
                  onTaskComplete(silvercoin); // 은화 추가 
                  setIsClaimed(prev => ({ ...prev, [text]: true })); // 상태 업데이트
              } else {
                  alert(`이 작업을 완료할 수 없습니다. 현재 좋아요 수: ${likes}`);
              }
          }

          }

          // 커뮤니티 좋아요 수에 따라 텍스트 업데이트
          const requiredLikes = text.match(/\d+/g) ? text.match(/\d+/g)[1] : '10'; // 기본값 10으로 설정
          const updatedText = text.includes('커뮤니티 좋아요 누르기')
              ? text.replace(/\d+\/\d+/, `${likes}/${requiredLikes}`)
              : text;
                    
    
        return (
            <View style={styles.taskContainer}>
                <Text style={styles.taskText}>
                  {updatedText} {'\n'}보상:
                    <Image
                        source={require('../../image/game/missioncontent/silvercoin.png')}
                        style={styles.rewardIcon}
                    />
                    +{silvercoin}
                </Text>
    
                <TouchableOpacity
                    style={styles.yetbutton}
                    onPress={handleClaim} // handleClaim 호출
                    disabled={isClaimed[text]} // text가 isClaimed와 같을 경우 비활성화
                    >
                      <Text style={styles.buttonText}>{isClaimed[text] ? '받기 완료' : '받기'}</Text>
                </TouchableOpacity>
  
                <View style={styles.line} />
            </View>
        );
    };
    

    const TaskList = ({ tasks, onTaskComplete }) => (
      <ScrollView style={styles.scrollContainer}>
          {tasks.map((task) => (
              <TaskItem
                  key={task.index}
                  text={task.text} // text 전달
                  silvercoin={task.silvercoin}
                  onTaskComplete={onTaskComplete}
              />
          ))}
      </ScrollView>
  );

  const handleTaskComplete = (silvercoin) => {
    setSilverCoinCount(prevCount => prevCount + silvercoin); // 은화를 추가하는 함수
};

  

return (
  
  <View style={styles.container}>
    <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

    <TouchableOpacity style={styles.backtohome} onPress={handleBackToHomePress}>
      <Image source={backtohomeImage} style={styles.backtohomeImage} resizeMode="contain" />
    </TouchableOpacity>

    
    <Image source={background} style={styles.backgroundRectangle} />

    <Image source={window} style={styles.backgroundRectangle} />
    <Image source={wall} style={styles.backgroundRectangle} />
    <Image source={rug} style={styles.backgroundRectangle} />
    <Image source={sofa} style={styles.backgroundRectangle} />
    <Image source={cloth} style={styles.backgroundRectangle} />
    <Image source={left} style={styles.backgroundRectangle} />
    <Image source={right} style={styles.backgroundRectangle} />
   

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
               <Text style={styles.buttonText}>{errorMessage}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </View>
  </View>
)}


{isItem1BoxVisible && (
    <View style={styles.itemboxContainer}>
        <View style={styles.itemBox}>
              <View style={{flexDirection: 'column', marginBottom: '10%',padding: 3,}}>
                  <Image
                  source={require('../../image/game/storage/storagemenu/menubutton.png')}
                  style={styles.storageImage}
                  resizeMode="contain"
                  />
              </View>
            <View style={styles.presentimageContainer}>
        
                  {/* 구매한 아이템들만 표시 */}
                    <ScrollView style={styles.itemsContainer}>
                      {chunkArray(
                        getItems().filter((item) => purchasedItems.includes(item.id)), // 구매한 아이템 필터링
                        4
                      ).map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.rowContainer}>
                          {row.map((item) => (
                            <TouchableOpacity
                              key={item.id}
                              style={styles.itemCard}
                              onPress={() => handleImgPress(item.id)}
                            >
                              <Image
                                  source={getImage(isItem1BoxVisible, item.storeImage)}  // 경로를 동적으로 변경
                                  style={styles.itemImage}
                                />
                            </TouchableOpacity>
                          ))}
                        </View>
                      ))}
                    </ScrollView>



            </View>
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

            {/* <TouchableOpacity onPress={() => handleBarMenu('menu4')}>
              <Image
                source={selectedMenu === 'menu4'
                  ? require('../../image/game/barmenu/menu4on.png')
                  : require('../../image/game/barmenu/menu4off.png')}
                style={styles.bottombarImg}
              />
            </TouchableOpacity> */}

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
    <View style={styles.missionContainer}>
        <Image
            source={require('../../image/game/missioncontent/mission.png')}
            style={styles.missionpaper} // 스타일을 styles.image로 관리
            resizeMode="contain" // 이미지 크기 조정 방법
        />

        <ScrollView style={styles.taskList}>
            {missions.map((mission) => (
                <TaskItem
                    key={mission.index}
                    //index={mission.index}
                    text={mission.text}
                    silvercoin={mission.silvercoin}
                    onTaskComplete={handleTaskComplete} 
                />
            ))}
        </ScrollView>
    </View>
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
  window: {
    position: 'absolute',
    width:10,
    height:10,
    top: 1000,
    resizeMode: 'contain',
    zIndex: 0, // background 위에
    opacity: 0.2, 
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


      /*==========상점-========*/
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
      storageImage: {
        left:20,
        top:20,
        width: 70,  // Adjust as necessary
        height: 30,  // Adjust as necessary
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

    /*===========선물(menu4)===============*/

        itemBox1: {
        width:screenWidth,
        height: 145,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // 흰색, 불투명도 80%
        borderTopLeftRadius: 20, // 왼쪽 위 모서리
        borderTopRightRadius: 20, // 오른쪽 위 모서리
        alignItems: 'center', // Center content horizontally
      },



  /*===========선물(menu4)===============*/

      itemBox2: {
      width:screenWidth,
      height: 145,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // 흰색, 불투명도 80%
      borderTopLeftRadius: 20, // 왼쪽 위 모서리
      borderTopRightRadius: 20, // 오른쪽 위 모서리
      alignItems: 'center', // Center content horizontally
    },

       presentimageContainer: {
               width:screenWidth,
               flexDirection: 'row', // Align images in a row
               justifyContent: 'space-around', // Space them evenly
              alignItems: 'center', // Center items horizontally
              bottom:15,
       },
       imageWrapper: {
               width: 100, // Adjust this to match image width
               height: 100, // Adjust this to match image height
               justifyContent: 'center', // Center items vertically
               alignItems: 'center', // Center items horizontally
           },
       presentimage: {
            resizeMode:'contain',
            height:70,
            width:190,
       },

    textOverlay: {
            position: 'absolute', // Overlay text on the image
            color: 'black', // Text color
            fontSize: 16, // Text size
            fontWeight: 'bold', // Text style
            right:30,
        },

  yetbutton: {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: 70,
          height: 30,
          right:20,
          backgroundColor: '#DDDEE0', // 배경 색상
          borderRadius: 10, // 테두리 반경
      },
  buttonText: {
    fontFamily: 'Pretendard-Medium',
    fontSize: 12,
    lineHeight: 15,
    textAlign: 'center',
    color: '#000000',
  },

  missionContainer: {
        position: 'absolute',
        justifyContent: 'center', // 수직 중앙 정렬
        alignItems: 'center', // 수평 중앙 정렬
        height: 'auto', // Allowing auto height to accommodate the scrollable content
      },
      missionpaper: {
          position: 'absolute',
          width: 320,
          height: 424,
      },
      taskList: {
      top:20,
          padding:0,
          marginTop: 0, // 이미지와 태스크 리스트 사이에 간격 추가
          marginLeft:15,
          maxHeight: 350,
      },
       scrollContainer: {
              flex: 1,
          },
      taskContainer: {
          width: 304,
          height: 70,
          padding: 5,
          alignItems: 'center',
          flexDirection: 'row',
          position: 'relative',
          marginBottom: 10,
          zIndex: 10,

      },
      taskText: {
          fontFamily: 'Pretendard-Medium',
          fontSize: 14,
          lineHeight: 20,
          color: '#111111',
          color: '#111111',
          flex: 1,
      },
      rewardContainer: {
          flexDirection: 'column',
          marginTop: 5, // 미션 내용과 간격 추가
      },
      rewardAmount: {
          fontFamily: 'Pretendard',
          fontWeight: '400',
          fontSize: 12,
          lineHeight: 17,
          color: '#646C79',
          marginLeft: 5, // silvercoin과 간격 추가
      },

      rewardText: {
          fontFamily: 'Pretendard',
          fontWeight: '400',
          fontSize: 12,
          lineHeight: 17,
          color: '#646C79',
      },
      rewardIcon: {
          width: 17,
          height: 17,
          marginLeft: 10,
      },
      line: {
          position: 'absolute',
          width: 284,
          height: 1,
          left: 10,
          top: 69.5,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(184, 182, 195, 0.5)',
      },
});

export default FrameComponent;
