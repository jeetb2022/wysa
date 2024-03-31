'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
// import { io } from 'socket.io-client';
import { useSocket } from '../SocketContext';

// const socket = io.connect("http://localhost:8000/");
export default function chat() {
  const router = useRouter();
  const socket = useSocket();
  const [isLoading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isChat, setChat] = useState(true);
  
  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on(socket.id, (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Clean up socket event listeners
    return () => {
      socket.off("receive_message");
      socket.off(socket.id);
    };
  }, [socket]);
  


  // Function to handle sending a message
  const handleMessageSend = (e) => {
    e.preventDefault();
    send_message(inputValue);
    setInputValue('');
  };

  // Function to handle logout
  const handleLogout = () => {
    fetch('http://localhost:8000/api/auth/logout', {
      method: "DELETE",
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        router.push('/login');
      })
      .catch((error) => {
        console.error('Logout error:', error);
        router.push('/login');
      });
  };

  // Function to send a message via socket
  const send_message = (message) => {
    socket.emit(socket.id, message);
  };

  return (
    isLoading ?
      <span>Verifying user...</span> :
      <>
        <div style={{ "scrollbarWidth": "none" }} className="overflow-y-scroll flex flex-col h-screen p-4 absolute left-[30%] w-full">
          <div className="flex-grow flex flex-col">
            {messages.map((msg, index) => (
              <div className='bg-[#FFF] m-3 p-5 max-w-[250px] w-fit rounded-lg' key={index}>{msg}</div>
            ))}
          </div>
        </div>
        <input
          value={inputValue}
          className='bg-[#FFF] m-3 p-5 w-[50%] fixed bottom-0 rounded-lg'
          placeholder='Type here'
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          className="w-[100px] fixed bottom-0 m-3 p-5 text-black font-bold rounded bg-indigo-500 hover:bg-indigo-700 right-[17%]"
          onClick={handleMessageSend}
        >
          Chat
        </button>
        <button
          className="fixed top-4 right-4 px-4 py-2 bg-red-500 text-white rounded"
          onClick={handleLogout}
        >
          Logout
        </button>
       { isChat ? <button
        className="fixed top-[50%] right-[50%] px-4 py-2 bg-red-500 text-white rounded"
        onClick={()=>{
          router.refresh();
          setMessages([]);
          setChat(false);
        }}
      >
        Tap to chat
      </button> : 
      <></>}
        
      </>
  );
}
