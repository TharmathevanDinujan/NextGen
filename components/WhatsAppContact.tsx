"use client";

import { useState, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoSend, IoClose } from "react-icons/io5";
import { BsCheck2All } from "react-icons/bs";

export default function WhatsAppContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [message, setMessage] = useState("");
  const [showTyping, setShowTyping] = useState(false);
  const [showFirstMsg, setShowFirstMsg] = useState(false);

  const phoneNumber = "94761909286"; 
  const defaultMessage = "Hey, student! Ask your questions about our Institute.";

  useEffect(() => {
    if (isOpen) {
      setShowTyping(true);
      setShowFirstMsg(false);

      const typingTimer = setTimeout(() => {
        setShowTyping(false);
        setShowFirstMsg(true);
      }, 2000);

      return () => clearTimeout(typingTimer);
    }
  }, [isOpen]);

  const handleSend = () => {
    const encodedMessage = encodeURIComponent(message || defaultMessage);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(url, "_blank");
    setMessage(""); 
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setClosing(false);
    }, 300); 
  };

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      {/* Floating WhatsApp Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-xl hover:bg-[#1DA955] transition-all duration-300 z-[9999]"
      >
        <FaWhatsapp size={28} />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 w-80 rounded-xl shadow-2xl border border-gray-300 overflow-hidden z-[9999] bg-[#ece5dd] ${
            closing ? "animate-popupClose" : "animate-popupOpen"
          } desktop-popup whatsapp-font`}
        >
          {/* Header */}
          <div className="flex justify-between items-center bg-[#075E54] text-white p-3">
            <div className="flex items-center gap-3">
              <div className="bg-white p-[2px] rounded-full">
                <img
                  src="/images/logo.png"
                  alt="NextGen"
                  className="w-10.5 h-10 rounded-full"
                />
              </div>
              <div>
                <p className="font-semibold text-sm">NextGen</p>
                <p className="text-xs opacity-90">Replies within 1 hour</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="hover:bg-[#094C44] rounded-full p-1 transition"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 h-64 overflow-y-auto text-sm space-y-3 whatsapp-bg">
            {showTyping && (
              <div className="flex flex-col items-start">
                <div className="bg-white rounded-lg px-3 py-2 shadow-sm max-w-[60%] flex items-center gap-1 message-bubble">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot delay-300"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce-dot delay-450"></span>
                  </div>
                </div>
              </div>
            )}

            {showFirstMsg && (
              <div className="flex flex-col items-start">
                <div className="relative bg-white rounded-lg px-3 py-2 shadow-sm max-w-[80%] message-bubble">
                  <p className="text-[11px] text-gray-500 font-medium mb-1">
                    NextGen
                  </p>
                  <span className="text-gray-800 text-[14px] leading-[20px] tracking-tight">
                    {defaultMessage}
                  </span>
                  <div className="flex items-center justify-end gap-1 text-[10px] text-gray-500 mt-1">
                    <span>{currentTime}</span>
                    <BsCheck2All className="text-blue-500" size={12} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="bg-gray-200 border-t border-gray-300 p-3 flex items-center gap-2 rounded-t-lg">
            <div className="flex flex-1 bg-white rounded-full px-4 py-2 items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 bg-transparent border-none text-[14px] leading-[20px] tracking-tight focus:outline-none placeholder-gray-500"
              />
              <button
                onClick={handleSend}
                className="bg-[#075E54] hover:bg-[#1DA955] p-2 rounded-full transition flex items-center justify-center"
              >
                <IoSend size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .whatsapp-font {
          font-family: "Segoe UI", Roboto, sans-serif !important;
        }

        @keyframes popupOpen {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes popupClose {
          from { opacity: 1; transform: translateY(0) scale(1); }
          to { opacity: 0; transform: translateY(40px) scale(0.9); }
        }
        .animate-popupOpen { animation: popupOpen 0.3s ease-out forwards; }
        .animate-popupClose { animation: popupClose 0.3s ease-in forwards; }

        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-dot { animation: bounce-dot 1.2s infinite ease-in-out; }
        .delay-150 { animation-delay: 0.15s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-450 { animation-delay: 0.45s; }

        .message-bubble::before {
          content: "";
          position: absolute;
          top: 0.7rem;
          left: -6px;
          width: 0;
          height: 0;
          border-top: 6px solid transparent;
          border-bottom: 6px solid transparent;
          border-right: 6px solid white;
        }

        .whatsapp-bg {
          background-image: url("/images/whatsapp_bg2.webp");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        @media (max-width: 768px) {
          .desktop-popup {
            width: 90% !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            right: auto !important;
          }
        }
      `}</style>
    </>
  );
}
