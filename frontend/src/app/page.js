'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import chat from './chat/page';


export default function Home() {

const router = useRouter()
  useEffect(() => {
    // Check user authentication
    fetch('http://localhost:8000/api/auth/verify', {
      method: "GET",
      credentials: 'include', // Include cookies in the request,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data:', data);
        if (data.isAuth !== true) {
          router.push('/login');
        } else {
          // router.refresh()
          router.forward('/chat')
          // router.push('/chat');
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        router.push('/login');
      });

  }, []);


 return(
  <chat></chat>
  );
}
