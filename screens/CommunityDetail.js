import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import firestore from '@react-native-firebase/firestore';

const PostDetail = ({route}) => {

    const navigation = useNavigation();
    const { post } = route.params;
    const { userInfo } = route.params;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    
    const [likes, setLikes] = useState(0);
    const [commentcount, setCount] = useState(0);
    const [liked, setLiked] = useState(false); // 좋아요 상태

    const postsCollection = firestore().collection('game');
    const [currentPost, setCurrentPost] = useState(post);
    const [likedPostsCount, setLikedPostsCount] = useState(0); // 사용자가 좋아요 누른 게시글 수 상태 추가

     // Firestore에서 좋아요 수 가져오기
     useEffect(() => {
        const unsubscribe = firestore()
            .collection('game')
            .doc(userInfo.email)
            .onSnapshot(doc => {
                const userData = doc.data();
                if (userData && userData.likedPosts) {
                    setLiked(userData.likedPosts.includes(post.id));
                }
            });
        return () => unsubscribe();
    }, [userInfo.email, post.id]);
    

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('community')
            .doc(post.id)
            .onSnapshot(doc => {
                const updatedPost = doc.data();
                setCurrentPost(updatedPost); // This updates the entire post
                setLikes(updatedPost.likes); // Syncs the like count
                setComments(updatedPost.comments || []); // Syncs the comments
                setCount(updatedPost.commentcount || 0); // Syncs the comment count
            });
    
        return () => unsubscribe();
    }, [post.id]);
    


    const toggleLike = async () => {
        const userDocRef = firestore().collection('game').doc(userInfo.email);
        const likedPosts = (await userDocRef.get()).data()?.likedPosts || [];
        
        const updatedLikedPosts = liked ? likedPosts.filter(id => id !== post.id) : [...likedPosts, post.id];
        setLiked(!liked);
    
        await userDocRef.set({ likedPosts: updatedLikedPosts }, { merge: true });
    
        const updatedLikes = liked ? likes - 1 : likes + 1;
        setLikes(updatedLikes);
    
        // 게시물의 좋아요 수 업데이트
        await firestore()
            .collection('community')
            .doc(post.id)
            .update({ likes: updatedLikes });
    };
    
    


    const addComment = () => {
        if (newComment.trim()) {
            const updatedComments = [...comments, newComment];
            setComments(updatedComments);
            setNewComment("");
            setCount(commentcount + 1);
    
            // Save the comment to Firestore
            firestore()
              .collection('community')
              .doc(post.id)
              .update({
                  comments: updatedComments,
                  commentcount: commentcount + 1
              });
        }
    };
    

    return (
        <View style={styles.container}>
            <View style={styles.heaaderContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../img/communityback.png')} 
                    style={styles.Back} />
                </TouchableOpacity>
                <Image source={require('../img/community.png')} 
                        style={styles.header} />
            </View> 
            <ScrollView style={styles.contentContainer}>
                {/* 사용자 프로필 */}
                <View style={styles.profileContainer}>
                    {post.user.profileImage ? (
                      <Image
                        source={{ uri: post.user.profileImage }} 
                        style={styles.profile}
                      />
                    ) : (
                      <View style={styles.nullprofile} /> 
                    )}
                    <Text style={styles.profileName}>{post.user.name || "user"}</Text>
                </View>

                {/* 게시글 내용 */}
                <Text style={styles.description}>{post.content}</Text>

                {/* 이미지 그리드 */}
                <View style={styles.imageGrid}>
                    {post.images.map((image, index) => (
                        <Image 
                            key={index}
                            source={{ uri: image }} 
                            style={styles.postImage} 
                            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
                            numColumns={3}  // 2열로 설정
                            initialNumToRender={6}  // 초기에 렌더링할 항목 수
                        />
                        
                    ))}
                </View>

                {/* 태그 */}
                <View style={styles.tagsContainer}>
                    {post.tags.map((tag, index) => (
                        <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>

                {/* 좋아요 및 댓글 수 */}
                <View style={styles.interactionContainer}>
                    <TouchableOpacity onPress={toggleLike} style={styles.interactionButton}>
                        <Image
                            source={liked ? require('../image/gangneungmap/like.png') : require('../image/gangneungmap/unlike.png')}
                            style={styles.likeIcon}
                        />
                        <Text style={styles.interactionText}>{likes}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.interactionButton}>
                        <Image
                            source={require('../img/Coment.png')}
                            style={styles.interactionIcon}
                        />
                        <Text style={styles.interactionText}>{commentcount}</Text>
                    </TouchableOpacity>
                </View>

               {/* 댓글 목록 */}
                <View style={styles.commentsContainer}>
                    {Array.isArray(comments) && comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <View key={index} style={styles.commentContainer}>
                                <View style={styles.profileContainer}>
                                    {post.user.profileImage ? (
                                        <Image
                                            source={{ uri: post.user.profileImage }} 
                                            style={styles.profile}
                                        />
                                    ) : (
                                        <View style={styles.nullprofile} /> 
                                    )}
                                    <Text style={styles.profileName}>{post.user.name || "user"}</Text>
                                </View>
                                <Text style={styles.commentText}>{comment}</Text>
                            </View>
                        ))
                    ) : (
                        <Text>작성된 댓글이 없습니다.</Text> 
                    )}
                </View>

            </ScrollView>

            {/* 댓글 입력 */}
            <View style={styles.commentInputContainer}>
                <TextInput
                    style={styles.commentInput}
                    placeholder="댓글 입력하기"
                    value={newComment}
                    onChangeText={setNewComment}
                />
                <TouchableOpacity onPress={addComment} >
                            <Image source={require('../img/commentinput.png')}  style={styles.enterIcon}/>
                    </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        padding: 16,
        marginTop: '-10%',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    postImage: {
        width: 100, 
        height: 100,
        resizeMode: 'cover', 
        marginRight: 10, 
        marginTop: 10, 
        borderRadius: 10,
      },
      tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
        marginBottom: 10,
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
    tagText: {
        fontFamily: 'Pretendard',
        fontSize: 12,
        color: '#646C79',
    },
    interactionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    interactionButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    interactionIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    likeIcon: {
        width: 20,
        height: 17,
        marginRight: 8,
    },
    enterIcon: {
        width: 20,
        height: 20,
        marginRight: 2,
        resizeMode: 'contain',
    },
    interactionText: {
        fontSize: 14,
        color: '#333',
    },
    commentsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 8,
    },
    commentContainer: {
        flexDirection: 'cloumn',
        alignItems: 'left',
        marginBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 20,
    },
    comment: {
        marginBottom: 16,
    },
    commentText: {
        fontFamily: 'Pretendard',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: -0.025,
        color: '#646C79',
        textAlign: 'left',
        marginBottom: 10,
        marginTop: '-2%',
        marginLeft: '2%',

    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderColor: 'rgba(100, 149, 237, 0.2)',
        backgroundColor: '#fff',
    },
    commentInput: {
        flex: 1,
        padding: 8,
        // borderRadius: 5,
        // borderWidth: 1,
        // borderColor: '#ddd',
        marginRight: 8,
    },
    header: {
        width: '86%',
        resizeMode: 'contain',
        marginTop: '-7%',
        marginLeft: '7%',
    },
    Back: {
        width: 50, // Back 이미지 크기
        height: 50, // 높이 설정
        resizeMode: 'contain',
        position: 'absolute', // 위치 고정
        top: '25%',
    },
    heaaderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
      nullprofile: {
        width: 40,
        height: 40,
        backgroundColor: '#D9D9D9',
        borderRadius: 12,
        marginBottom: 10,
        marginRight: 10,
      },
      profile: {
        width: 40,
        height: 40,
        borderRadius: 12,
        marginBottom: 10,
        marginRight: 10,
      },
      profileName: {
        fontFamily: 'Pretendard',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 14,
        lineHeight: 22,
        color: '#111111',
        marginBottom: 8,
        marginLeft: 5,
      },
      description: {
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
      
});

export default PostDetail;