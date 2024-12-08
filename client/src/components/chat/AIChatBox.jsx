import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMinimize2, FiMaximize2, FiX } from 'react-icons/fi';
import { RiRobot2Line } from 'react-icons/ri';
import geminiService from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const AIChatBox = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const { user } = useAuth();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = {
            type: 'user',
            content: inputMessage,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            const response = await geminiService.getResponse(inputMessage);
            const aiMessage = {
                type: 'ai',
                content: response.message,
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = {
                type: 'error',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date().toISOString()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setIsMinimized(false);
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Chat Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleChat}
                    className="bg-primary-light text-white rounded-full p-4 shadow-lg flex items-center space-x-2"
                >
                    <RiRobot2Line className="w-6 h-6" />
                    <span>Ask AI Assistant</span>
                </motion.button>
            )}

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ 
                            opacity: 1, 
                            y: 0,
                            height: isMinimized ? 'auto' : '500px'
                        }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-background-dark rounded-lg shadow-xl w-96"
                    >
                        {/* Chat Header */}
                        <div className="bg-primary-light text-white p-4 rounded-t-lg flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <RiRobot2Line className="w-6 h-6" />
                                <span className="font-semibold">AI Assistant</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={toggleMinimize} className="p-1 hover:bg-primary-dark rounded">
                                    {isMinimized ? <FiMaximize2 /> : <FiMinimize2 />}
                                </button>
                                <button onClick={toggleChat} className="p-1 hover:bg-primary-dark rounded">
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        {/* Chat Messages */}
                        {!isMinimized && (
                            <>
                                <div className="h-96 overflow-y-auto p-4 space-y-4">
                                    {messages.map((message, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[80%] p-3 rounded-lg ${
                                                    message.type === 'user'
                                                        ? 'bg-primary-light text-white'
                                                        : message.type === 'error'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-background-light text-text-primary'
                                                }`}
                                            >
                                                <ReactMarkdown className="prose prose-invert">
                                                    {message.content}
                                                </ReactMarkdown>
                                                <div className="text-xs opacity-70 mt-1">
                                                    {new Date(message.timestamp).toLocaleTimeString()}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-background-light text-text-primary p-3 rounded-lg">
                                                <div className="flex space-x-2">
                                                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                                    <div className="w-2 h-2 bg-primary-light rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Chat Input */}
                                <form onSubmit={handleSendMessage} className="p-4 border-t border-background-light">
                                    <div className="flex space-x-2">
                                        <input
                                            type="text"
                                            value={inputMessage}
                                            onChange={(e) => setInputMessage(e.target.value)}
                                            placeholder="Type your message..."
                                            className="flex-grow p-2 rounded-lg bg-background-light text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-light"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="submit"
                                            disabled={isLoading || !inputMessage.trim()}
                                            className="bg-primary-light text-white p-2 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <FiSend className="w-5 h-5" />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AIChatBox; 