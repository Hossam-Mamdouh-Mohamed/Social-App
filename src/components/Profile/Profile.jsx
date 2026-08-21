import React, { useContext, useEffect, useState } from 'react'
import Styles from './Profile.module.css'
import { UserContext } from '../../Context/UserContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import axios from 'axios'
import { set } from 'zod/v4'
import { Link } from 'react-router-dom'

const passwordSchema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/, "Password must contain uppercase, lowercase, number, and special character"),
    confirmPassword: z.string().min(1, "Confirm password is required")
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
})

export default function Profile() {

    let { User, SetUser } = useContext(UserContext);
    let [isEditingPassword, setIsEditingPassword] = useState(false);
    let [apiMessage, setApiMessage] = useState('');
    let [apiError, setApiError] = useState('');
    let [isLoading, setIsLoading] = useState(false);

    let { register, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        },
        mode: "onBlur",
        resolver: zodResolver(passwordSchema)
    })

    async function handleChangePassword(data) {
        setIsLoading(true);
        setApiError('');
        setApiMessage('');

        try {
            const response = await axios.patch(
                'https://route-posts.routemisr.com/users/change-password',
                {
                    password: data.currentPassword,
                    newPassword: data.newPassword
                },
                {
                    headers: {
                        Authorization: `Bearer ${User?.token}`
                    }
                }
            );

            setIsLoading(false);
            setApiMessage('Password changed successfully!');
            reset();
            setIsEditingPassword(false);
            SetUser(null);

        } catch (error) {
            setIsLoading(false);
            setApiError(error.response?.data?.message || 'Failed to change password');
        }
    }

    if (!User) {
        return <div className="flex items-center justify-center min-h-screen">
            <p className="text-xl text-gray-500">Please login to view your profile</p>
        </div>
    }

    return (
        <div className="flex items-center justify-center min-h-screen  dark:bg-gray-900 py-12 px-4">
            <div className="w-full max-w-2xl">
                <Link to="/home"  className={Styles.backButton}>
                    Back
                </Link>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
                    <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Profile</h2>

                    <div className="flex items-center gap-6 mb-8">
                        <img
                            src={User?.user?.photo}
                            alt="Profile"
                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                        />
                        <div className="flex-1">
                            <p className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                {User?.user?.name}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 mb-1">
                                <span className="font-medium">Email:</span> {User?.user?.email}
                            </p>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Account Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Full Name</p>
                                <p className="text-lg font-medium text-gray-800 dark:text-white">{User?.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Email Address</p>
                                <p className="text-lg font-medium text-gray-800 dark:text-white">{User?.user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Change Password</h2>
                        <button
                            onClick={() => setIsEditingPassword(!isEditingPassword)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            {isEditingPassword ? 'Cancel' : 'Edit'}
                        </button>
                    </div>

                    {apiMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
                            {apiMessage}
                        </div>
                    )}

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {apiError}
                        </div>
                    )}

                    {isEditingPassword && (
                        <form onSubmit={handleSubmit(handleChangePassword)}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Current Password
                                </label>
                                <input
                                    {...register("currentPassword")}
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter your current password"
                                />
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword.message}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    {...register("newPassword")}
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Enter new password"
                                />
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                                )}
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    {...register("confirmPassword")}
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                    placeholder="Confirm new password"
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium"
                            >
                                {isLoading ? (
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                ) : (
                                    'Save New Password'
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
