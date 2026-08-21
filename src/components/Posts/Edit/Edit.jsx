import React, { useContext, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserContext } from '../../../Context/UserContext'
import Styles from '../Create/Create.module.css'

const postSchema = z.object({
    body: z.string().trim().min(1, 'Write something before saving.').max(5000, 'Post is too long.'),
    image: z.any().optional()
})

export default function Edit() {
    const { User } = useContext(UserContext)
    const { id } = useParams()
    const navigate = useNavigate()
    const [post, setPost] = useState( null)
    const [apiError, setApiError] = useState('')
    const [isLoading, setIsLoading] = useState(!location.state?.post)
    const [isSaving, setIsSaving] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: { body: '', image: '' },
        mode: 'onBlur',
        resolver: zodResolver(postSchema)
    })

    useEffect(() => {
        if (post) {
            reset({ body: post.body || '', image: '' })
            return
        }

        async function getPost() {
            try {
                const response = await axios.get(
                    `https://route-posts.routemisr.com/posts/${id}`,
                    { headers: { Authorization: `Bearer ${User.token}` } }
                )
                const loadedPost = response.data.data.post
                setPost(loadedPost)
                reset({ body: loadedPost.body || '', image: '' })
            } catch (error) {
                setApiError(error.response?.data?.message || 'Failed to load post.')
            } finally {
                setIsLoading(false)
            }
        }

        getPost()
    }, [])

    async function updatePost(data) {
        setIsSaving(true)
        setApiError('')

        try {
            const formData = new FormData()
            formData.append('body', data.body)
            if (data.image?.[0]) formData.append('image', data.image[0])

            await axios.put(
                `https://route-posts.routemisr.com/posts/${id}`,
                formData,
                { headers: { Authorization: `Bearer ${User.token}` } }
            )
            navigate('/home')
        } catch (error) {
            setApiError(error.response?.data?.message || 'Failed to update post.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) return <section className={Styles.page}><div className={Styles.formCard}>Loading post...</div></section>

    return (
        <section className={Styles.page}>
            <div className={Styles.formCard}>
                <div className={Styles.heading}>
                    <div>
                        <p className={Styles.eyebrow}>Update your post</p>
                        <h1>Edit Post</h1>
                    </div>
                    <Link to="/home" className={Styles.cancelButton}>Cancel</Link>
                </div>

                {apiError && <div className={Styles.error}>{apiError}</div>}

                <form onSubmit={handleSubmit(updatePost)}>
                    <label htmlFor="body">Post content</label>
                    <textarea id="body" {...register('body')} className={Styles.textarea} />
                    {errors.body && <p className={Styles.fieldError}>{errors.body.message}</p>}

                    <label htmlFor="image">Replace image <span>(optional)</span></label>
                    <input id="image" type="file" accept="image/*" {...register('image')} className={Styles.input} />
                    <p className={Styles.hint}>Leave empty to keep the current image.</p>

                    <button type="submit" disabled={isSaving} className={Styles.submitButton}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </section>
    )
}
