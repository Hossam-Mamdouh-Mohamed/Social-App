import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Styles from './Index.module.css'
import { Link } from 'react-router-dom'

const token = localStorage.getItem('UserToken')

export default function Index() {
    const [posts, setPosts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [editingId, setEditingId] = useState(null)
    const [editValue, setEditValue] = useState('')

    useEffect(() => {
        async function fetchPosts() {
            try {
                setIsLoading(true)
                const response = await axios.get('https://route-posts.routemisr.com/posts', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                setPosts(Array.isArray(response.data.data.posts) ? response.data.data.posts : [])
            } catch (err) {
                setError('Failed to load posts')
            } finally {
                setIsLoading(false)
            }
        }

        fetchPosts()
    }, [])

    function startEdit(post) {
        setEditingId(post._id || post.id)
        setEditValue(post.body || '')
    }

    function saveEdit(postId) {
        setPosts(prev =>
            prev.map(post =>
                (post._id || post.id) === postId
                    ? { ...post, body: editValue }
                    : post
            )
        )
        setEditingId(null)
        setEditValue('')
    }

    return (
        <div className={Styles.page}>
            <div className={Styles.header}>
                <h2>Latest Posts</h2>
                <p>Explore the latest posts from the community.</p>
            </div>

            {isLoading && <div className={Styles.state}>Loading posts...</div>}
            {error && <div className={Styles.stateError}>{error}</div>}
            {!isLoading && !error && posts.length === 0 && (
                <div className={Styles.state}>No posts available right now.</div>
            )}

            <div className={Styles.grid}>
                {posts.map((post, index) => (
                    <article key={post._id || post.id || index} className={Styles.card}>
                        <Link to={`/post/${post._id}`}>
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
                            {post.image && (
                                <img src={post.image} alt="Post" className={Styles.postImage} />
                            )}
                        </Link>

                        {editingId === (post._id || post.id) ? (
                            <div className={Styles.editBox}>
                                <textarea
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    className={Styles.textarea}
                                />
                                <div className={Styles.actionsRow}>
                                    <button onClick={() => saveEdit(post._id || post.id)} className={Styles.saveBtn}>Save</button>
                                    <button onClick={() => setEditingId(null)} className={Styles.cancelBtn}>Cancel</button>
                                </div>
                            </div>
                        ) : (
                            <p className={Styles.body}>{post.body || 'No content available.'}</p>
                        )}

                        <div className={Styles.actionsRow}>
                            <button onClick={() => startEdit(post)} className={Styles.editBtn}>Edit</button>
                        </div>

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
