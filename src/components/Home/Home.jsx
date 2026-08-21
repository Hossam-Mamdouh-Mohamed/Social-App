import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Styles from './Home.module.css'
import { Link } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'
export default function Home() {

    let { User } = useContext(UserContext);
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')


    async function deletePost(id) {
        try {
            setIsLoading(true)
            setError('')
            setSuccessMessage('')
            await axios.delete(`https://route-posts.routemisr.com/posts/${id}`, {
                headers: {
                    Authorization: `Bearer ${User.token}`
                }
            })
            setPosts((currentPosts) => currentPosts.filter((post) => post._id !== id))
            setSuccessMessage('Post deleted successfully.')
        } catch (err) {
            setError(err.response?.data?.message || 'You can only delete your own posts.')
        } finally {
            setIsLoading(false)
        }
    }

    function isPostOwner(post) {
        const currentUserId = User?.user?._id || User?.user?.id
        const postOwnerId = post.user?._id || post.user?.id
        return currentUserId && postOwnerId && currentUserId === postOwnerId
    }

    useEffect(() => {

        async function getPosts() {
            try {
                setIsLoading(true)
                const response = await axios.get('https://route-posts.routemisr.com/posts', {
                    headers: {
                        Authorization: `Bearer ${User.token}`
                    }
                })
                setPosts(Array.isArray(response.data.data.posts) ? response.data.data.posts : [])
            } catch (err) {
                setError('Failed to load posts')
            } finally {
                setIsLoading(false)
            }
        }

        getPosts()
    }, [])

    return (
        <div className={Styles.page}>

            <div className={Styles.header}>
                <div>
                    <h2>Latest Posts</h2>
                    <p>Explore the latest posts from the community.</p>
                </div>
                <Link to="/post/create" className={Styles.createPostButton}>
                    <span aria-hidden="true">+</span>
                    Create Post
                </Link>
            </div>

            {isLoading && <div className={Styles.state}>Loading posts...</div>}
            {error && <div className={Styles.stateError}>{error}</div>}
            {successMessage && <div className={Styles.stateSuccess}>{successMessage}</div>}
            {!isLoading && !error && posts.length === 0 && (
                <div className={Styles.state}>No posts available right now.</div>
            )}

            <div className={Styles.grid}>
                {posts.map((post, index) => (
                    <article key={post._id || post.id || index} className={Styles.card}>
                        <div>
                            <Link
                                to={`/UserProfile/${post.user?._id || post.user?.id}`}
                                state={{ user: post.user }}
                                className={Styles.authorLink}
                            >
                                <div className={Styles.userRow}>
                                    <img
                                        src={post.user?.photo || 'https://via.placeholder.com/48'}
                                        alt={post.user?.name || 'User'}
                                        className={Styles.avatar}
                                    />
                                    <div>
                                        <h3>{post.user?.name || 'Unknown user'}</h3>
                                        <p className={Styles.meta}>@{post.user?.username || 'unknown'}</p>
                                    </div>
                                </div>
                            </Link>
                            {post.image && (
                                <Link to={`/post/${post._id}`}>
                                    <img src={post.image} alt="Post" className={Styles.postImage} />
                                </Link>
                            )}
                            <Link to={`/post/${post._id}`} className={Styles.bodyLink}>
                                {!post.image && <p className={Styles.body}>{post.body}</p>}
                            </Link>
                        </div>

                        {isPostOwner(post) && (
                            <div className={Styles.actionsRow}>
                                <Link
                                    to={`/post/edit/${post._id}`}
                                    state={{ post }}
                                    className={Styles.editBtn}
                                >
                                    Edit
                                </Link>
                                <button onClick={() => deletePost(post._id)} disabled={isLoading} className={Styles.deleteBtn}>Delete</button>
                            </div>
                        )}

                        <div className={Styles.statsRow}>
                            <span>❤️ {post.likesCount || 0}</span>
                            <span>💬 {post.commentsCount || 0}</span>
                            <span>🔁 {post.sharesCount || 0}</span>
                        </div>

                        {post.topComment && (
                            <div className={Styles.commentBox}>
                                <strong>{post.topComment.commentCreator?.name || 'Commenter'}</strong>
                                <p>{post.topComment.content}</p>
                            </div>
                        )}
                    </article>
                ))}
            </div>
        </div>
    )
}
