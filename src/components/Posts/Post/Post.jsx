import React, { useContext, useEffect, useState } from 'react'
import Styles from './Post.module.css'
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../../Context/UserContext';

export default function Post() {

    let { User } = useContext(UserContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [commentError, setCommentError] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        async function getPostDetails() {
            try {
                setIsLoading(true);
                
                const response = await axios.get(
                    `https://route-posts.routemisr.com/posts/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${User.token}`
                        }
                    }
                );

                setPost(response.data.data.post);
                console.log(response.data.data.post);
            } catch (err) {
                setError('Post not found');
            } finally {
                setIsLoading(false);
            }
        }

        if (id) {
            getPostDetails();
        }
    }, [id])

    function handleCommentChange(e) {
        setComment(e.target.value);
    }

    async function handleAddComment() {
        const content = comment.trim();
        if (!content || isSubmittingComment) return;

        try {
            setCommentError('');
            setIsSubmittingComment(true);
            const response = await axios.post(
                `https://route-posts.routemisr.com/posts/${id}/comments`,
                { content },
                {
                    headers: {
                        Authorization: `Bearer ${User.token}`
                    }
                }
            );
            const newComment = response.data.data.comment || response.data.data;
            setComments((currentComments) => [...currentComments, {
                ...newComment,
                content: newComment.content || content,
                commentCreator: newComment.commentCreator || { name: User.user?.name || 'You' },
                createdAt: newComment.createdAt || new Date().toISOString()
            }]);
            setPost((currentPost) => ({
                ...currentPost,
                commentsCount: (currentPost.commentsCount || 0) + 1
            }));
            setComment('');
        } catch (err) {
            console.error(err);
            setCommentError('Could not add comment. Please try again.');
        } finally {
            setIsSubmittingComment(false);
        }
    }

    async function handleDeleteComment(commentId) {
        if (!commentId) return;

        try {
            setCommentError('');
            await axios.delete(
                `https://route-posts.routemisr.com/posts/${id}/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${User.token}`
                    }
                }
            );
            setComments((currentComments) => currentComments.filter((currentComment) => (
                (currentComment._id || currentComment.id) !== commentId
            )));
            setPost((currentPost) => ({
                ...currentPost,
                commentsCount: Math.max((currentPost.commentsCount || 1) - 1, 0)
            }));
        } catch (err) {
            console.error(err);
            setCommentError('Could not delete comment. Please try again.');
        }
    }

    if (isLoading) return <div className={Styles.center}>Loading post...</div>;
    if (error) return <div className={Styles.center}><p className={Styles.error}>{error}</p><button onClick={() => navigate('/index')}>Back</button></div>;
    if (!post) return <div className={Styles.center}>Post not found</div>;

    return (
        <div className={Styles.page}>
            <button onClick={() => navigate('/home')} className={Styles.backBtn}>← Back</button>

            <div className={Styles.postContainer}>
                <Link
                    to={`/UserProfile/${post.user?._id || post.user?.id}`}
                    state={{ user: post.user }}
                    className={Styles.authorLink}
                >
                    <div className={Styles.postHeader}>
                        <img src={post.user?.photo || 'https://via.placeholder.com/60'} alt={post.user?.name} className={Styles.authorAvatar} />
                        <div>
                            <h3>{post.user?.name || 'Unknown'}</h3>
                            <p className={Styles.username}>@{post.user?.username || 'unknown'}</p>
                            <p className={Styles.date}>{new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                </Link>

                {post.image && <img src={post.image} alt="Post" className={Styles.postImage} />}

                <div className={Styles.postContent}>
                    <p>{post.body}</p>
                </div>

                <div className={Styles.stats}>
                    <span>❤️ {post.likesCount || 0} Likes</span>
                    <span>💬 {post.commentsCount || 0} Comments</span>
                    <span>🔁 {post.sharesCount || 0} Shares</span>
                </div>

                <div className={Styles.actionButtons}>
                    <button className={Styles.actionBtn}>❤️ Like</button>
                    <button className={Styles.actionBtn}>💬 Comment</button>
                    <button className={Styles.actionBtn}>🔁 Share</button>
                </div>

                <div className={Styles.commentsSection}>
                    <h3>Comments</h3>

                    <div className={Styles.addComment}>
                        <textarea
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Write a comment..."
                            className={Styles.commentInput}
                        />
                        <button onClick={handleAddComment} className={Styles.submitBtn} disabled={isSubmittingComment}>
                            {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                        </button>
                    </div>
                    {commentError && <p className={Styles.error}>{commentError}</p>}

                    <div className={Styles.commentsList}>
                        {(comments.length > 0 || post.topComment) && (
                            <>
                                {post.topComment && (
                                    <div className={Styles.comment}>
                                        <strong>{post.topComment.commentCreator?.name}</strong>
                                        <p>{post.topComment.content}</p>
                                        <p className={Styles.commentDate}>{new Date(post.topComment.createdAt).toLocaleDateString()}</p>
                                    </div>
                                )}
                                {comments.map((cmt, idx) => (
                                    <div key={cmt._id || cmt.id || idx} className={Styles.comment}>
                                        <strong>{cmt.commentCreator.name}</strong>
                                        <p>{cmt.content}</p>
                                        <p className={Styles.commentDate}>{new Date(cmt.createdAt).toLocaleDateString()}</p>
                                        {(cmt._id || cmt.id) && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteComment(cmt._id || cmt.id)}
                                                className={Styles.deleteCommentBtn}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
