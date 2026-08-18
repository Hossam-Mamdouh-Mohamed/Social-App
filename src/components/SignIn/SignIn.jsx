import React, { useContext, useEffect, useState } from 'react'
import Styles from './SignIn.module.css'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../Context/UserContext';

const formSchema = z.object({
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(1, "Enter Password").regex(
    /^(?=.*?[A-Z])(?=.*?[A-Z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    "Password must contain 8+ characters, uppercase, lowercase, number, and special character"
  ),
});


export default function SignIn() {

    let navigate = useNavigate();
    let {SetUser} = useContext(UserContext);

    let { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        mode: "onBlur",
        reValidateMode: "onChange",
        resolver: zodResolver(formSchema)
    })

    let [apiError, setApiError] = useState('');
    let [isLoading, setIsLoading] = useState(false);

    async function handleLogin(User) {
        setIsLoading(true);
        axios.post('https://route-posts.routemisr.com/users/signin', User)
            .then((ApiResponse) => {
                setIsLoading(false);
                // Store both token and user data
                localStorage.setItem('UserToken', ApiResponse.data.data.token);
                localStorage.setItem('UserData', JSON.stringify(ApiResponse.data.data));
                SetUser(ApiResponse.data.data);
                navigate('/index');
                
            }).catch((ApiResponse) => {
                setIsLoading(false);
                setApiError(ApiResponse.response.data.message);
            })
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <form className="w-full max-w-xl p-6 bg-white border border-gray-200 rounded-xl shadow sm:p-8 md:p-10 dark:bg-gray-800 dark:border-gray-700" onSubmit={handleSubmit(handleLogin)}>
                {apiError && <div className='bg-amber-950 my-2 text-center border-2 rounded-md text-3xl text-white'>
                    {apiError.toLowerCase().replace(/\b\w/g, char => char.toUpperCase())}
                </div>}

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
                <button type="submit" disabled={isLoading} className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50">{isLoading ? (<i className="fa-solid fa-spinner fa-spin"></i>) : ("Sign In")}</button>
            </form>

        </div>
    )
}
