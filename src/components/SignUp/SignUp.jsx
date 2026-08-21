import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';


const formSchema = z.object({
    name: z.string().min(3, "Name must be at leatest 3 characters").max(20, "Name must be less than 20 characters").regex(/^[A-Za-z\s]+$/i, "Name must be only letters"),
    username: z.string().trim().min(3, "Username must be at leatest 3 characters").max(20, "Username must be less than 20 characters").regex(/^[A-Za-z]+$/i, "Username must be only letters"),
    email: z.string().trim().email("Invalid email address"),
    dateOfBirth: z.string().min(1, "Date of Birth is required"),
    gender: z.string().min(1, "Gender is required"),
    password: z.string().trim().refine((value) => value === "" || value.length >= 6, {
        message: "Password must be at least 6 characters"
    }).refine((value) => value === "" || value.length <= 20, {
        message: "Password must be less than 20 characters"
    }),
    rePassword: z.string().trim().refine((value) => value === "" || value.length >= 6, {
        message: "Password must be at least 6 characters"
    }).refine((value) => value === "" || value.length <= 20, {
        message: "Password must be less than 20 characters"
    }),
})
    .refine((data) => data.password === data.rePassword, {
        path: ["rePassword"],
        message: "Passwords don't match"
    });

export default function SignUp() {

    let navigate= useNavigate();
    let {SetUser} =useContext(UserContext);
    let { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            name: "",
            username: "",
            email: "",
            dateOfBirth: "",
            gender: "",
            password: "",
            rePassword: ""
        },
        mode: "onBlur",
        reValidateMode: "onChange",
        resolver: zodResolver(formSchema)
    })

    let [apiError, setApiError] = useState('');
    let [isLoading, setIsLoading] = useState(false);

    async function CreateAccount(User) {
        setIsLoading(true);
        axios.post('https://route-posts.routemisr.com/users/signup', User)
            .then((ApiResponse) => {
                localStorage.setItem('UserData', JSON.stringify(ApiResponse.data.data));
                SetUser(ApiResponse.data.data);
                setIsLoading(false);
                navigate('/home')
            }).catch((ApiResponse) => {
                setIsLoading(false);
                setApiError(ApiResponse.response.data.message);
            })
    }

    return (

        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <form className="w-full max-w-xl p-6 bg-white border border-gray-200 rounded-xl shadow sm:p-8 md:p-10 dark:bg-gray-800 dark:border-gray-700" onSubmit={handleSubmit(CreateAccount)}>
                {apiError && <div className='bg-amber-950 my-2 text-center border-2 rounded-md text-3xl text-white'>
                    {apiError.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                </div>}
                <div className="relative z-0 w-full mb-6 group">
                    <input {...register("name")} type="text" id="floating_name" className="block py-3 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="floating_name" className="absolute text-base text-body duration-300 transform -translate-y-7 scale-75 top-4 -z-10 origin-left peer-focus:inset-s-0-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Name</label>
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input {...register("username")} type="text" id="floating_username" className="block py-3 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="floating_username" className="absolute text-base text-body duration-300 transform -translate-y-7 scale-75 top-4 -z-10 origin-left peer-focus:inset-s-0-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Username</label>
                    {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input {...register("email")} type="email" id="floating_email" className="block py-3 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="floating_email" className="absolute text-base text-body duration-300 transform -translate-y-7 scale-75 top-4 -z-10 origin-left peer-focus:inset-s-0-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Email address</label>
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input {...register("password")} type="password" id="floating_password" className="block py-3 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="floating_password" className="absolute text-base text-body duration-300 transform -translate-y-7 scale-75 top-4 -z-10 origin-left peer-focus:inset-s-0-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Password</label>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input {...register("rePassword")} type="password" id="floating_repeat_password" className="block py-3 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="floating_repeat_password" className="absolute text-base text-body duration-300 transform -translate-y-7 scale-75 top-4 -z-10 origin-left peer-focus:inset-s-0-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Confirm password</label>
                    {errors.rePassword && <p className="text-red-500 text-sm">{errors.rePassword.message}</p>}
                </div>
                <div className="relative z-0 w-full mb-6 group">
                    <input {...register("dateOfBirth")} type="date" id="floating_dateOfBirth" className="block py-3 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer" placeholder=" " />
                    <label htmlFor="floating_dateOfBirth" className="absolute text-base text-body duration-300 transform -translate-y-7 scale-75 top-4 -z-10 origin-left peer-focus:inset-s-0-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Date of Birth</label>
                    {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message}</p>}
                </div>

                <div className="relative z-0 w-full mb-6 group">
                    <select {...register("gender")} id="floating_gender" className="block py-3 px-0 w-full text-base text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <label htmlFor="floating_gender" className="absolute text-base text-body duration-300 transform -translate-y-7 scale-75 top-4 -z-10 origin-left peer-focus:inset-s-0-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-7 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto">Gender</label>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                </div>

                <button type="submit" disabled={isLoading} className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50">{isLoading ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Sign Up")}</button>
            </form>

        </div>

    )
}
