import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
// import PhotoEditor from 'react-native-photo-editor';
import RNPhotoManipulator from 'react-native-photo-manipulator';
// import RNFS from 'react-native-fs';
// import { ImageEditor } from 'react-native';

const API_KEY = 'QAiNzAD7GEQAnT9LrZEGtVNi';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(true);
  const [check, setCheck] = useState(false);
  const [cameraPosition, setCameraPosition] = useState('back');
  const device = useCameraDevice(cameraPosition);
  const [isCameraReady, setIsCameraReady] = useState(false); 
  const camera = useRef(null);
  


  useEffect(() => {
    const getPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized' || status === 'granted');
    };
    getPermissions();
  }, []);

  const toggleCamera = () => {
    setCameraPosition((prevPosition) => (prevPosition === 'back' ? 'front' : 'back'));
  };

  const resetFilters = () => {
    setIsFilterActive(true);  // 필터 선택 화면 활성화
    setSelectedImage(null);  // 선택된 이미지 초기화
  };

  const capturePhoto = async () => {
    try {
      if (isCameraReady && camera.current != null) {
        // 사진을 찍음
        const photo = await camera.current.takePhoto();
    
        // photo 객체의 구조를 확인
        console.log('Captured photo object:', photo);
  
        // path 값이 문자열인지 확인
        let photoUri;
        if (photo && typeof photo.path === 'string') {
          photoUri = `file://${photo.path}`;
        } else if (photo && photo.path instanceof ReadableNativeMap) {
          // ReadableNativeMap에서 값 추출
          photoUri = `file://${photo.path.getString('path')}`;
        } else {
          throw new Error('Photo object or path is invalid');
        }
  
        console.log("Captured photo path:", photoUri);
    
        // 오버레이 이미지를 합침
        overlayImageOnPhoto(photoUri);  
      } else {
        console.error('Camera is not ready or reference is null');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };


  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
  const overlayImageOnPhoto = async (photoUri) => {
    try {
      if (selectedImage) {
        if(check){
             // 선택된 이미지의 원본 크기 가져오기
            Image.getSize(selectedImage, async (imageWidth, imageHeight) => {
                Image.getSize(photoUri, async (imgWidth, imgHeight) => {
                    // 크롭 영역 설정 (이미지 원본 크기와 동일)
                    const cropRegion = { x: 0, y: 0, width: imgWidth, height: imgHeight };
            
                    // 목표 크기 설정 (원본 이미지 크기와 동일)
                    const targetSize = { width: imageWidth, height: imageHeight };
            
                    // 작업을 설정
                    const operations = [
                        { 
                        operation: "overlay", 
                        overlay: selectedImage, 
                        position: { x: 0, y: 0 }, // 화면 전체에 오버레이
                        width: imageWidth, // 이미지 원본 크기 설정
                        height: imageHeight // 이미지 원본 크기 설정
                        }
                    ];
            
                    // 이미지 조작 수행
                    const mergedImageUri = await RNPhotoManipulator.batch(photoUri, operations, cropRegion, targetSize);
                    
                    console.log('Merged image URI:', mergedImageUri);
            
                    // 합친 이미지를 갤러리에 저장
                    await CameraRoll.save(mergedImageUri, { type: 'photo' });
                    // Alert.alert('Success', 'Photo saved to gallery');
                    
                    }, (error) => {
                    console.error('Error getting image size:', error);
            });
        });

        }else{
            
            Image.getSize(selectedImage, async (imageWidth, imageHeight) => {
                Image.getSize(photoUri, async (imgWidth, imgHeight) => {
                    // 오버레이 적용 전에 크기 조정
                
                        const operations = [
                            { 
                                operation: "overlay", 
                                overlay: selectedImage, 
                                position: { 
                                    x: 0,  // 위치 설정: 필요 시 조정
                                    y: 0 
                                },
                            }
                        ];
            
                        const cropRegion = { x: 0, y: 0, width: imgWidth, height: imgHeight };
                        const targetSize = { width: imageWidth, height: imageHeight};  // 원본 이미지 크기로 설정
            
                        // 이미지 병합 작업 수행
                        const mergedImageUri = await RNPhotoManipulator.batch(photoUri, operations, cropRegion, targetSize, 90);
                        
                        console.log('Merged image URI:', mergedImageUri);
            
                        // 병합된 이미지를 갤러리에 저장
                        await CameraRoll.save(mergedImageUri, { type: 'photo' });
                    });
                });
           
            

        }
       
      } else {
        console.error('No image selected to overlay');
      }
    } catch (error) {
      console.error('Error merging or saving photo:', error);
    }
  }; 
  
  
  
  

  const selectImage = (mode) => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedUri = response.assets[0].uri;
        setIsFilterActive(false);  // 버튼을 누르면 비활성화
        if (mode === 'remove-bg') {
          removeBackground(selectedUri);
          setCheck(true);
        } 
      }
    });
  };

  const onCameraFilter1Press = () => {
    setIsFilterActive(false);
    const filterImageUri = 'https://firebasestorage.googleapis.com/v0/b/ddoddo-e621b.appspot.com/o/camera%2Flocation1%2Fcharacter.png?alt=media&token=c546ab8b-ef32-400f-8c32-f56d67d98ffa';
    // https://firebasestorage.googleapis.com/v0/b/ddoddo-e621b.appspot.com/o/camera%2Flocation2%2Fcharacter.png?alt=media&token=b2e99438-1eb8-413f-b7df-6849437deb7c
    setSelectedImage(filterImageUri);
  };
  

  const removeBackground = async (imageUri) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image_file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'photo.jpg',
    });
    formData.append('size', 'auto');

    try {
      const response = await axios({
        method: 'post',
        url: 'https://api.remove.bg/v1.0/removebg',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-Api-Key': API_KEY,
        },
        responseType: 'blob',
      });

      if (response.status === 200) {
        const blob = response.data;

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          setSelectedImage(base64data);
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      console.error('Error during the request:', error.message);
    }
    setLoading(false)
  };

  if (device == null) return <Text>Loading...</Text>;
  if (!hasPermission) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        ref={camera}  // Camera 컴포넌트에 카메라 참조 연결
        device={device}
        isActive={true}
        photo={true}  // 촬영 기능 활성화
        onInitialized={() => setIsCameraReady(true)}  // 카메라 준비 완료되면 상태 업데이트
      />

      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={check ? styles.overlayImage : styles.characterImage}
          resizeMode="cover"
        />
      )}
      

      {loading && <Text style={styles.loadingText}>Removing background...</Text>}

      {isFilterActive && (
        <>
            {/* 로케이션 장소 */}
            <Image source={require('../img/location1.png')} style={styles.locationImage} />

            {/* 필터 버튼들 */}
            <View style={styles.filterContainer}>
            <TouchableOpacity onPress={() => selectImage('remove-bg')}>
                <Image source={require('../img/camerafilter2.png')} style={styles.filterImage} />
            </TouchableOpacity>

            <TouchableOpacity onPress={onCameraFilter1Press}>
                <Image source={require('../img/camerafilter1.png')} style={styles.filterImage} />
            </TouchableOpacity>
            </View>
        </>
        )}


            <View style={styles.cameraBarContainer}>
            {/* 카메라 바 배경 이미지 */}
            <Image source={require('../img/camerabar.png')} style={styles.cameraBar} />

            {/* 카메라 백 버튼 */}
            <TouchableOpacity style={styles.cameraButton} onPress={resetFilters}>
                <Image source={require('../img/cameraback.png')} style={styles.cameraButtonImage} />
            </TouchableOpacity>

            {/* 캡처 버튼 */}
            <TouchableOpacity style={styles.cameraButton} onPress={capturePhoto}>
                <Image source={require('../img/capture.png')} style={styles.cameraButtonImage} />
            </TouchableOpacity>

            {/* 카메라 전환 버튼 */}
            <TouchableOpacity style={styles.cameraButton} onPress={toggleCamera}>
                <Image source={require('../img/change.png')} style={styles.cameraButtonImage} />
            </TouchableOpacity>
            </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  overlayImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  characterImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    position: 'absolute',
    top: '50%',  // location 이미지의 아래에 겹치도록 위치
    width: '100%',
  },
  filterImage: {
    width: 130,
    resizeMode: 'contain',
  },
  locationImage: {
    position: 'absolute',
    top: '25%', // 적당한 위치에 배치
    left: '7.5%', // 적당한 위치에 배치
    width: 350,
    resizeMode: 'contain',
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#000',
  },
  loadingText: {
    position: 'absolute',
    top: 200,
    alignSelf: 'center',
    color: '#f00',
  },
  cameraBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '15%', // camerabar 높이에 맞춤
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  cameraBar: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cameraButton: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraButtonImage: {
    width: '65%',
    resizeMode: 'contain',
  },
  
});

export default CameraScreen;
