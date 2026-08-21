import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { UserContext } from '../../Context/UserContext'
import Styles from './UserProfile.module.css'

export default function UserProfile() {
    const { User } = useContext(UserContext)
    const { id } = useParams()
    const location = useLocation()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(location.state?.user || null)
    const [isLoading, setIsLoading] = useState(!location.state?.user)
    const [error, setError] = useState('')

    useEffect(() => {
        if (profile || !id || !User?.token) return

        async function getProfile() {
            try {
                const response = await axios.get(
                    `https://route-posts.routemisr.com/users/${id}`,
                    { headers: { Authorization: `Bearer ${User.token}` } }
                )
                setProfile(response.data.data.user || response.data.user)
            } catch {
                setError('Could not load this user profile.')
            } finally {
                setIsLoading(false)
            }
        }

        getProfile()
    }, [id, User?.token, profile])

    if (isLoading) return <div className={Styles.state}>Loading profile...</div>
    if (error) return <div className={Styles.stateError}>{error}</div>
    if (!profile) return <div className={Styles.stateError}>User profile not found.</div>

    return (
        <section className={Styles.page}>
            <button type="button" onClick={() => navigate(-1)} className={Styles.backButton}>
                Back
            </button>

            <div className={Styles.profileCard}>
                <div className={Styles.cover} />
                <div className={Styles.profileBody}>
                    <img
                        src={profile.photo || 'https://via.placeholder.com/120'}
                        alt={profile.name || 'User'}
                        className={Styles.avatar}
                    />
                    <h1>{profile.name || 'Unknown user'}</h1>
                    <p className={Styles.username}>@{profile.username || 'unknown'}</p>
                    {profile.email && <p className={Styles.email}>{profile.email}</p>}

                    <div className={Styles.infoGrid}>
                        <div>
                            <span>Username</span>
                            <strong>@{profile.username || 'unknown'}</strong>
                        </div>
                        <div>
                            <span>Member since</span>
                            <strong>{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Community member'}</strong>
                        </div>
                    </div>

                    <Link to="/home" className={Styles.postsButton}>Back to posts</Link>
                </div>
            </div>
        </section>
    )
}
