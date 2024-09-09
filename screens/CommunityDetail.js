import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const PostDetail = ({route}) => {

    const navigation = useNavigation();
    const { post } = route.params;

    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    
    const [likes, setLikes] = useState(0);
    const [commentcount, setCount] = useState(0);
    const [liked, setLiked] = useState(false); // 좋아요 상태

    const toggleLike = () => {
        if (liked) {
            setLikes(likes - 1);
        } else {
            setLikes(likes + 1);
        }
        setLiked(!liked);
    };

    const addComment = () => {
        if (newComment.trim()) {
            setComments([...comments, newComment]);
            setNewComment("");
        }
        setCount(commentcount + 1);
    };

    return (
        <View style={styles.container}>
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
                    <Text style={styles.profileName}>{post.user.name || "닉네임 없음"}</Text>
                </View>

                {/* 게시글 내용 */}
                <Text style={styles.content}>{post.content}</Text>

                {/* 이미지 그리드 */}
                <View style={styles.imageGrid}>
                    {post.images.map((image, index) => (
                        <Image 
                            key={index}
                            source={{ uri: image }} 
                            style={styles.postImage} 
                            onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
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
                            source={liked ? require('../img/SelectLike.png') : require('../img/Like.png')}
                            style={styles.interactionIcon}
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
                            <View key={index} style={styles.comment}>
                                <Text>{comment}</Text>
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
                <Button title="작성" onPress={addComment} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
    },
    contentContainer: {
        flex: 1,
        padding: 16,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,  // 이미지와 텍스트 사이에 공간 추가
    },
    content: {
        fontSize: 16,
        marginBottom: 16,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    postImage: {
        width: '30%',         
        height: 120,         
        margin: '1.5%',     
        borderRadius: 8,      
        backgroundColor: '#ccc',
        resizeMode: 'cover',  
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 16,
    },
    tag: {
        backgroundColor: '#f0f0f0',
        padding: 6,
        borderRadius: 12,
        marginRight: 8,
        marginBottom: 8,
    },
    tagText: {
        fontSize: 12,
        color: '#333',
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
    interactionText: {
        fontSize: 14,
        color: '#333',
    },
    commentsContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 8,
    },
    comment: {
        marginBottom: 16,
    },
    commentInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fff',
    },
    commentInput: {
        flex: 1,
        padding: 8,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ddd',
        marginRight: 8,
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
});

export default PostDetail;
