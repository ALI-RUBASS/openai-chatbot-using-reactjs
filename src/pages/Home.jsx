import React, { useState, useRef, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import '../custom_css/all_styles.css'
import { useLocation } from 'react-router-dom';
import openai from 'openai';

const ChatBot = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const searchValue = searchParams.get('search');
    const [messages, setMessages] = useState([]);
    const [botTyping, setBotTyping] = useState(false);
    const inputRef = useRef(null);
    const apiKey = 'API'; // Replace with your OpenAI API key

    useEffect(() => {
        if (searchValue) {
            sendMessage(searchValue);
        }
    }, []);

    const sendMessage = async (input) => {
        setMessages(prevMessages => [...prevMessages, { from: 'user', text: input }]);
        scrollChat();

        try {
            setBotTyping(true);
            const openaiClient = new openai({ apiKey, dangerouslyAllowBrowser: true }); // Pass API key here
            const response = await openaiClient.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'user', content: input }
                ]
            });
            const botResponse = response.choices[0].message.content.trim();
            setMessages(prevMessages => [...prevMessages, { from: 'bot', text: botResponse }]);
        } catch (error) {
            console.error('Error fetching response from OpenAI:', error);
            setMessages(prevMessages => [...prevMessages, { from: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
        } finally {
            setBotTyping(false);
            scrollChat();
        }
    };

    const scrollChat = () => {
        const messagesContainer = document.getElementById("messages");
        messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
        setTimeout(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight - messagesContainer.clientHeight;
        }, 100);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage(inputRef.current.value.trim());
            inputRef.current.value = '';
        }
    };

    return (
        <div className="bg-gray-950 antialiase text-gray-200 tracking-tight">
            <div className="flex-1 pb-2 sm:px-6 sm:pb-6 justify-between flex flex-col h-screen">
                <div id="messages" className="mb-16 flex flex-col space-y-4 p-3 md:px-16 mt-8 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch" style={{ maxHeight: 'calc(100% - 4.8rem)' }}>
                    

                    
                <div className="w-full px-4 md:w-8/12 lg:mt-4 lg:w-6/12 mb-16">
                        <div className="w-full max-w-full sm:my-auto md:w-5/6 md:flex-none lg:w-1/2">
                            <div className="overflow-hidden block mb-6">
                                <nav>
                                    <ul role="tablist" className="flex relative bg-opacity-60 p-1 flex-row h-10 w-auto rounded-full border border-white/80 bg-white/80 shadow-2xl shadow-blue-gray-500/40 backdrop-blur-2xl backdrop-saturate-200">
                                        <li role="tab" className="flex items-center justify-center text-center w-full h-full relative bg-transparent antialiased font-sans text-base leading-relaxed select-none cursor-pointer p-0 font-normal text-[#1A237E]" data-value="react">
                                            <div className="z-20 text-inherit"><i className="fab fa-react" aria-hidden="true"></i>&nbsp;AI</div>
                                            <div className="absolute inset-0 z-10 h-full bg-white shadow rounded-full" style={{ opacity: 1 }}></div>
                                        </li>
                                        <li role="tab" className="flex items-center justify-center text-center w-full h-full relative bg-transparent antialiased font-sans text-base leading-relaxed select-none cursor-pointer p-0 font-normal text-[#1A237E]" data-value="html">
                                            <div className="z-20 text-inherit"><i className="fab fa-html5" aria-hidden="true"></i>&nbsp;Beta</div>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                        <h1 className="block antialiased font-poppins text-3xl md:text-5xl leading-tight mb-2 font-black tracking-normal text-gray-200">AI ChatBot</h1>
                        <p className="block antialiased font-sans mb-6 text-md md:text-md font-light text-gray-400 lg:pr-12">
                            Looking to find what you need? Ask
                            <b className="text-white text-2xl font-poppins">
                                <b className="text-red-600"> .</b>
                                den</b>
                            , our AI-powered chatbot, for assistance!
                        </p>
                        <div className="flex flex-col-reverse gap-2 lg:flex-row">
                            <a>
                                <button className="align-middle select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 px-6 rounded-lg bg-gradient-to-tr from-blue-600 to-blue-400 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/40 active:opacity-[0.85] h-full w-full" type="button">Get Started</button>
                            </a>
                            {/* <div className="flex rounded-lg border border-white/80 bg-white/80 py-2.5 px-5 text-[#1A237E] shadow-2xl shadow-blue-gray-500/20 backdrop-blur-2xl backdrop-saturate-200">
      <p className="mb-0 flex w-full items-center justify-between font-normal">npm i @material-tailwind/react<i className="far fa-copy ml-4 cursor-pointer text-sm" aria-hidden="true"></i></p>
    </div> */}
                        </div>
                    </div>

                    
                    {messages.map((message, key) => (
                        <div key={key} className={`flex items-end ${message.from === 'bot' ? '' : 'justify-end'}`}>
                            <div className={`flex flex-col space-y-2 text-md leading-tight max-w-lg mx-2 ${message.from === 'bot' ? 'order-2 items-start' : 'order-1 items-end'}`}>
                                <div>
                                    <span className={`px-4 py-3 rounded-xl inline-block ${message.from === 'bot' ? 'rounded-bl-none bg-gray-100 text-gray-600' : 'rounded-br-none bg-blue-500 text-white'}`} dangerouslySetInnerHTML={{ __html: message.text }}></span>
                                </div>
                            </div>
                            <img
                                src={message.from === 'bot' ? 'https://raw.githubusercontent.com/bhavik-dodia/chatbot/master/assets/bot_icon.jpg' : 'https://th.bing.com/th/id/R.ec167da5c1e0450d06d1f8eb84f4b1e2?rik=lZSin1UlkaglyA&pid=ImgRaw&r=0'}
                                alt=""
                                className={`${message.from === 'bot' ? 'order-1 w-12 h-12 rounded-full ' : 'order-2 w-6 h-6'}`}
                            />
                        </div>
                    ))}
                    <div style={{ display: botTyping ? 'block' : 'none' }} className="flex items-end">
                        <div className="flex flex-col space-y-2 text-md leading-tight mx-2 order-2 items-start">
                            <div>
                                <img src="https://gigadevden.com/typing-animation-3x.gif" alt="..." className="w-16 ml-6" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 pt-4 mb-2 sm:mb-0">
                    <div className="relative flex">
                        <input
                            type="text"
                            placeholder="Say something..."
                            autoComplete="off"
                            onKeyDown={handleKeyDown}
                            className="text-md w-full focus:outline-none focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 pl-5 pr-16 bg-gray-100 border-2 border-gray-200 focus:border-blue-500 rounded-full py-2"
                            ref={inputRef}
                        />
                        <div className="absolute right-2 items-center inset-y-0 hidden sm:flex">
                            <button
                                type="button"
                                className="inline-flex items-center justify-center rounded-full h-8 w-8 transition duration-200 ease-in-out text-white bg-blue-500 hover:bg-blue-600 focus:outline-none"
                                onClick={() => sendMessage(inputRef.current.value.trim())}
                            >
                                <FaArrowRight />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatBot;
