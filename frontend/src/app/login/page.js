'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

function Login() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    return (
        <div className=" min-h-screen flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md max-w-xs w-[450px]">
                <h2 className="text-2xl mb-4">Login</h2>
                <div className='text-red'>{errorMessage}</div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-center">
                    Don't have an account?{' '}
                    <a
                        href="/signup"
                        className="text-indigo-600 hover:text-indigo-900"
                    >
                        Sign up here
                    </a>
                </div>
            </div>
        </div>
    );

    function handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get('email');
        const password = formData.get('password');
        fetch(`http://localhost:8000/api/auth/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json", 
            },
            credentials: 'include', 
            body: JSON.stringify({
              email: email,
              password: password
            })
          })
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              console.log(data);
              if(data.token){
                router.push('/chat');
              } else {
                setErrorMessage(data.error);
                router.push('/login');
            }
        })
        .catch((error) => {
                console.log(error);
                setErrorMessage(error);
              console.error(error);
              router.push('/login');
            });
    }
}

export default Login;