import React from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

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

// osint_results.json 파일에서 데이터 임포트
import osintData from "./osint_results.json";

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
  const handleGoHome = () => {
    window.location.href = "/";
  };

  // txt 파일로 다운로드 (트리 형태)
  const handleDownloadText = () => {
    // 트리 형태 문자열 변환
    const treeString = jsonToTreeString(osintData);
    const blob = new Blob([treeString], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "osint_results.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  // osint_results.json 내부 구조에서 필요한 항목을 구조 분해
  const { whois, dns, related_domains } = osintData;

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
          TXT 파일로 전체 데이터 다운로드 (트리형)
        </Button>
      </div>
    </motion.main>
  );
}
