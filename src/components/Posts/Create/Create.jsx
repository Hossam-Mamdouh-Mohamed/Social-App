import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../../Context/UserContext'
import Styles from './Create.module.css'

const postSchema = z.object({
    body: z.string().trim().min(1, 'Write something before publishing.').max(5000, 'Post is too long.'),
    image: z.any().optional()
})

export default function Create() {
    const { User } = useContext(UserContext)
    const navigate = useNavigate()
    const [apiError, setApiError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: { body: '', image: '' },
        mode: 'onBlur',
        resolver: zodResolver(postSchema)
    })

    async function createPost(data) {
        setIsLoading(true)
        setApiError('')

        try {
            const formData = new FormData()
            formData.append('body', data.body)

            if (data.image?.[0]) {
                formData.append('image', data.image[0])
            }

            await axios.post(
                'https://route-posts.routemisr.com/posts',
                formData,
                { headers: { Authorization: `Bearer ${User.token}` } }
            )
            navigate('/home')
        } catch (error) {
            setApiError(error.response?.data?.message || 'Failed to create post.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className={Styles.page}>
            <div className={Styles.formCard}>
                <div className={Styles.heading}>
                    <div>
                        <p className={Styles.eyebrow}>Share with the community</p>
                        <h1>Create Post</h1>
                    </div>
                    <Link to="/home" className={Styles.cancelButton}>Cancel</Link>
                </div>

                {apiError && <div className={Styles.error}>{apiError}</div>}

                <form onSubmit={handleSubmit(createPost)}>
                    <label htmlFor="body">What is on your mind?</label>
                    <textarea
                        id="body"
                        {...register('body')}
                        placeholder="Share an update, idea, or moment..."
                        className={Styles.textarea}
                    />
                    {errors.body && <p className={Styles.fieldError}>{errors.body.message}</p>}

                    <label htmlFor="image">Image URL <span>(optional)</span></label>
                    <input
                        id="image"
                        type="file"
                        accept="image/*"
                        {...register('image')}
                        className={Styles.input}
                    />
                    {errors.image && <p className={Styles.fieldError}>{errors.image.message}</p>}

                    <button type="submit" disabled={isLoading} className={Styles.submitButton}>
                        {isLoading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </form>
            </div>
        </section>
    )
}
