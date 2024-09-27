import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import * as ImagePicker from 'react-native-image-picker';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import RNPhotoManipulator from 'react-native-photo-manipulator';
import axios from 'axios';

const CameraFilter = ({ route, navigation }) => {
  const { filterId, filterImageUri, locationId } = route.params;
  const [hasPermission, setHasPermission] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(true);
  const [cameraPosition, setCameraPosition] = useState('back');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isWarning1Visible, setIsWarning1Visible] = useState(false);
  const [isWarning2Visible, setIsWarning2Visible] = useState(false);
  const device = useCameraDevice(cameraPosition);
  const [isCameraReady, setIsCameraReady] = useState(false); 
  const camera = useRef(null);
  const [check, setCheck] = useState(false);

  const API_KEY = 'QAiNzAD7GEQAnT9LrZEGtVNi';

  useEffect(() => {
    const getPermissions = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized' || status === 'granted');
    };
    getPermissions();
  }, []);

  useEffect(() => {
    if (filterId) {
      setIsMenuVisible(true);
    }
  }, [filterId]);

  const toggleCamera = () => {
    setCameraPosition((prevPosition) => (prevPosition === 'back' ? 'front' : 'back'));
  };

  const resetFilters = () => {
    setIsFilterActive(true);
    setSelectedImage(null);
  };

  const capturePhoto = async () => {
    try {
      if (isCameraReady && camera.current != null) {
        const photo = await camera.current.takePhoto();
        let photoUri;
        if (photo && typeof photo.path === 'string') {
          photoUri = `file://${photo.path}`;
        } else if (photo && photo.path instanceof ReadableNativeMap) {
          photoUri = `file://${photo.path.getString('path')}`;
        } else {
          throw new Error('Photo object or path is invalid');
        }
        if (filterId === 'filter1') {
            overlayImageOnPhoto(photoUri); 
        } else if (filterId === 'filter2') {
            overlayImageOnPhoto(photoUri); 
        }
      } else {
        console.error('Camera is not ready or reference is null');
      }
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };
  
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
    setLoading(false);
  };

  const handleMenuNext = () => {
    setIsMenuVisible(false);
    if (filterId === 'filter2') {
      setIsWarning1Visible(true);
    }else if (filterId === 'filter1') {
        setSelectedImage(filterImageUri)
    }
  };

  const handleWarning1Next = () => {
    setIsWarning1Visible(false);
    setIsWarning2Visible(true);
  };

  const handleWarning2Ok = () => {
    setIsWarning2Visible(false);
    selectImage('remove-bg');
  };

  const selectImage = (mode) => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const selectedUri = response.assets[0].uri;
        setSelectedImage(selectedUri);
        setCheck(true);
        removeBackground(selectedUri);
      }
    });
  };

  if (device == null) return <Text>Loading...</Text>;
  if (!hasPermission) return <Text>No access to camera</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        ref={camera}
        device={device}
        isActive={true}
        photo={true}
        onInitialized={() => setIsCameraReady(true)}
      />
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={styles.characterImage}
          resizeMode="cover"
        />
      )}
      {loading && <Text style={styles.loadingText}>Removing background...</Text>}

      <View style={styles.cameraBarContainer}>
        <Image source={require('../img/camerabar.png')} style={styles.cameraBar} />
        <TouchableOpacity style={styles.cameraButton} onPress={resetFilters}>
          <Image source={require('../img/cameraback.png')} style={styles.cameraButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={capturePhoto}>
          <Image source={require('../img/capture.png')} style={styles.cameraButtonImage} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={toggleCamera}>
          <Image source={require('../img/change.png')} style={styles.cameraButtonImage} />
        </TouchableOpacity>
      </View>
      {/* Menu Modal */}
        <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsMenuVisible(false)}
        >
        <View style={styles.modalContainer}>
            <Image source={require('../img/camera/menu.png')} style={styles.modalImage} />
            <TouchableOpacity style={styles.nextButtonMenu} onPress={handleMenuNext}>
            <Image source={require('../img/camera/next.png')} style={styles.modalButtonImage} />
            </TouchableOpacity>
        </View>
        </Modal>

        {/* Warning1 Modal */}
        <Modal
        visible={isWarning1Visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsWarning1Visible(false)}
        >
        <View style={styles.modalContainer}>
            <Image source={require('../img/camera/warning1.png')} style={styles.modalImage} />
            <TouchableOpacity style={styles.nextButtonWarning1} onPress={handleWarning1Next}>
            <Image source={require('../img/camera/next.png')} style={styles.modalButtonImage} />
            </TouchableOpacity>
        </View>
        </Modal>

        {/* Warning2 Modal */}
        <Modal
        visible={isWarning2Visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsWarning2Visible(false)}
        >
        <View style={styles.modalContainer}>
            <Image source={require('../img/camera/warning2.png')} style={styles.modalImage} />
            <TouchableOpacity style={styles.okButton} onPress={handleWarning2Ok}>
            <Image source={require('../img/camera/ok.png')} style={styles.modalButtonImage} />
            </TouchableOpacity>
        </View>
        </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
    top: '50%',
    width: '100%',
  },
  filterImage: {
    width: 130,
    resizeMode: 'contain',
  },
  cameraBarContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '15%',
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
  loadingText: {
    position: 'absolute',
    top: 200,
    alignSelf: 'center',
    color: '#f00',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalImage: {
    width: '80%',
    height: '60%',
    resizeMode: 'contain',
  },
  nextButtonMenu: {
    width: '70%',
    top: '-29%',
  },
  nextButtonWarning1: {
    width: '70%',
    top: '-27%',
  },
  okButton: {
    width: '70%', 
    top: '-25%',
  },
  modalButtonImage: {
    width: '100%',
    resizeMode: 'contain',
  },
});

export default CameraFilter;
