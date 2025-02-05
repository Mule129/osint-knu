import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MainPage() {
  const [url, setUrl] = useState('');
  const navigate = useNavigate();

  // 경로 이동
  const handleSubmit = () => {
    navigate('/result');
    // e.preventDefault();
    // alert(`URL Submitted: ${url}`);
  };

  const isDisabled = url.trim() === '';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-r from-purple-100 via-pink-50 to-blue-100 gap-4">
      <img src="/vite.svg" alt="Vite Logo" className="w-32 h-32" />

      <div className="text-6xl font-bold mt-0 mb-4 text-gray-800 drop-shadow-lg">KNU OSINT</div>
      <div className="mt-0 mb-4 text-gray-700 w-full max-w-3/8">KNU OSINT는 입력한 URL을 스캔하여 이 사이트 내에서 얻어낼 수 있는 공개정보를 조회하는 서비스 입니다</div>
      {/* 전체를 감싸는 div -> form 태그로 변경하여 Enter 키로 submit */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center w-full max-w-3/8 rounded-4xl bg-white/70 shadow px-4 py-2"
      >
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={isDisabled}
          className={`flex items-center justify-center w-10 h-10 rounded-full transition ${
            isDisabled
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
          }`}
        >
          {/* 화살표 아이콘 (오른쪽 방향) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5l6 6m0 0l-6 6m6-6H4.5"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
