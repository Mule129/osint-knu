import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

// 간단한 카드/카드콘텐츠/버튼 컴포넌트
function Card({ className = "", children }) {
  return (
    <div className={`rounded-2xl shadow-md bg-white ${className}`}>
      {children}
    </div>
  );
}

function CardContent({ className = "", children }) {
  return (
    <div className={`p-4 ${className}`}>
      {children}
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center px-3 py-2 border rounded-md hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

// 메인 JSON 파일(도메인 whois/dns 등)
import osintData from "./osint_results.json";
// 이메일 검사 결과용 JSON 파일(셸록 결과)
import emailOsintData from "./osint_email_result.json";

// JSON 데이터를 트리 형태의 문자열로 변환하는 재귀 함수
function jsonToTreeString(obj, depth = 0) {
  const indent = "  ".repeat(depth);

  if (Array.isArray(obj)) {
    return obj
      .map((item, index) => {
        if (item && typeof item === "object") {
          return `${indent}- [${index}]:\n${jsonToTreeString(item, depth + 1)}`;
        } else {
          return `${indent}- [${index}]: ${String(item)}`;
        }
      })
      .join("\n");
  } else if (obj && typeof obj === "object") {
    return Object.entries(obj)
      .map(([key, value]) => {
        if (value && typeof value === "object") {
          return `${indent}- ${key}:\n${jsonToTreeString(value, depth + 1)}`;
        } else {
          return `${indent}- ${key}: ${String(value)}`;
        }
      })
      .join("\n");
  } else {
    // 기본형
    return `${indent}${String(obj)}`;
  }
}

export default function TestResultPage() {
  const navigate = useNavigate();

  // 홈으로 돌아가기
  const handleGoHome = () => {
    window.location.href = "/";
  };

  // TXT 파일 다운로드 (트리 형태)
  const handleDownloadText = () => {
    // 트리 형태 문자열 변환
    const treeString = jsonToTreeString(osintData);
    const blob = new Blob([treeString], { type: "text/plain" });
    const _url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = _url;
    link.download = "osint_results.txt";
    link.click();
    URL.revokeObjectURL(_url);
  };

  // osint_results.json에서 가져오는 항목
  const { whois, dns, related_domains } = osintData;

  // 이메일 검사 로직
  const [url, setUrl] = useState(""); // 사용자가 입력하는 email
  const [emailResult, setEmailResult] = useState(null); // 검사 결과 저장

  // 이메일 검사
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      alert("이메일을 입력하세요");
      return;
    }

    // 간단한 이메일 유효성 검사(정규식 예시)
    const re = /^[\w\-.]+@[\w\-.]+\.[A-Za-z]{2,}$/;
    const isValid = re.test(url);

    // 검사 결과를 state에 저장 (실제로는 이메일 기반으로 API 호출 또는 다른 로직 수행 가능)
    setEmailResult({
      email: url,
      isValid,
      // 이메일 OSINT 데이터(샘플) 가져오기
      // 여기서는 import 한 JSON을 단순히 포함하지만, 실제 환경에서는 요청에 따라 다른 결과를 가져올 수 있습니다.
      sherlockResult: emailOsintData.result,
    });
  };

  // url input 비어있으면 버튼 비활성화
  const isDisabled = url.trim() === "";

  return (
    <motion.main
      className="relative flex flex-col items-center p-6 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 상단 좌측에 고정된 버튼 */}
      <div className="absolute top-6 left-6">
        <Button onClick={handleGoHome}>
          <ArrowLeft className="mr-2" /> 홈으로 돌아가기
        </Button>
      </div>

      <h1 className="text-2xl font-bold mb-4 mt-16">검사 결과</h1>

      {/* 카드들을 감싸는 컨테이너 */}
      <div className="max-w-1/2 w-full flex flex-col items-center">
        {/* WHOIS 정보 카드 */}
        {whois && (
          <Card className="w-full mb-6">
            <CardContent>
              <h2 className="font-bold text-lg mb-2">WHOIS</h2>
              <p className="mb-2">도메인: {whois.domain}</p>
              <p className="mb-2">등록기관: {whois.registrar}</p>
              <p className="mb-2">등록일: {whois.creation_date}</p>
              <p className="mb-2">만료일: {whois.expiration_date}</p>
              <p className="mb-2">네임서버: {whois.name_servers?.join(", ")}</p>
              <p className="mb-2">이메일: {whois.emails}</p>
            </CardContent>
          </Card>
        )}

        {/* DNS 정보 카드 */}
        {dns && (
          <Card className="w-full mb-6">
            <CardContent>
              <h2 className="font-bold text-lg mb-2">DNS</h2>
              <p className="mb-2">A: {dns.A?.join(", ")}</p>
              <p className="mb-2">MX: {dns.MX?.join(", ")}</p>
              <p className="mb-2">NS: {dns.NS?.join(", ")}</p>
              <p className="mb-2">TXT: {dns.TXT?.join(", ")}</p>
              <p className="mb-2">CNAME: {dns.CNAME?.join(", ")}</p>
            </CardContent>
          </Card>
        )}

        {/* Related Domains 카드 */}
        {related_domains && (
          <Card className="w-full mb-6">
            <CardContent>
              <h2 className="font-bold text-lg mb-2">연관 도메인</h2>
              <p className="mb-2">{related_domains.join(", ")}</p>
            </CardContent>
          </Card>
        )}

        {/* 다운로드 버튼 */}
        <Button onClick={handleDownloadText}>
          데이터 다운로드(TXT)
        </Button>

        {/* 추가검사 */}
        <div className="text-2xl font-bold mt-12 mb-4 text-gray-800">이메일 추가 검사</div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center w-full max-w-3/8 rounded-4xl bg-white/70 shadow px-4 py-2"
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="example@gmail.com"
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

        {/* 이메일 검사결과 카드 */}
        {emailResult && (
          <Card className="w-full mt-6">
            <CardContent>
              <h2 className="font-bold text-lg mb-2">이메일 검사 결과</h2>
              <p className="mb-2">입력 이메일: {emailResult.email}</p>
              {emailResult.isValid ? (
                <p className="text-green-600">유효한 이메일 형식입니다.</p>
              ) : (
                <p className="text-red-600">유효하지 않은 이메일 형식입니다.</p>
              )}
              {/* Sherlock 결과 출력 */}
              <div className="mt-4">
                <h3 className="font-bold">Sherlock OSINT Result</h3>
                <pre className="whitespace-pre-wrap text-sm mt-2 bg-gray-50 p-2 rounded">
                  {emailResult.sherlockResult}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.main>
  );
}
