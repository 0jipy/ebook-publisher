import { useState, useEffect } from "react";

const PLATFORMS = {
  kyobo: {
    name: "교보문고",
    color: "#E8321A",
    accent: "#FF6B4A",
    formats: ["EPUB", "PDF"],
    hasISBN: true,
    reviewDays: "7~14일",
    commission: "30%",
    tip: "원고 검수 기간이 있어 여유있게 제출. 국내 최대 브랜드 파워.",
    url: "https://digital.kyobobook.co.kr"
  },
  ridi: {
    name: "리디북스",
    color: "#1A6EE8",
    accent: "#4A9BFF",
    formats: ["EPUB"],
    hasISBN: false,
    reviewDays: "3~7일",
    commission: "30~35%",
    tip: "장르소설·독립출판 강세. 이벤트/프로모션 참여 기회 많음.",
    url: "https://ridibooks.com/publisher"
  },
  yes24: {
    name: "예스24",
    color: "#E87B1A",
    accent: "#FFB04A",
    formats: ["EPUB", "PDF"],
    hasISBN: true,
    reviewDays: "5~10일",
    commission: "30%",
    tip: "서평단·이벤트 시스템 활발. 독자와 소통하기 좋음.",
    url: "https://www.yes24.com"
  },
  aladin: {
    name: "알라딘",
    color: "#1AAA6E",
    accent: "#4AFFB0",
    formats: ["EPUB", "PDF"],
    hasISBN: true,
    reviewDays: "5~10일",
    commission: "30%",
    tip: "인문·소설·에세이 독자층 탄탄. 서평 문화가 발달.",
    url: "https://www.aladin.co.kr"
  }
};

const STEPS = [
  { id: "planning", label: "기획", icon: "💡", desc: "주제·타겟·경쟁도서 분석" },
  { id: "manuscript", label: "원고", icon: "✍️", desc: "교정·구조·가독성 체크" },
  { id: "design", label: "편집·표지", icon: "🎨", desc: "메타데이터·포맷 준비" },
  { id: "upload", label: "플랫폼 등록", icon: "📤", desc: "플랫폼별 체크리스트" },
  { id: "marketing", label: "마케팅", icon: "📣", desc: "홍보 문구·일정 생성" },
  { id: "monitor", label: "관리", icon: "📊", desc: "피드백·업데이트 관리" },
];

const CHECKLIST = {
  kyobo: [
    { id: "c1", text: "EPUB 또는 PDF 파일 준비 완료" },
    { id: "c2", text: "ISBN 발급 완료 (선택 아님, 필수)" },
    { id: "c3", text: "표지 이미지 JPG (500×700px 이상)" },
    { id: "c4", text: "저자 정보 및 약력 작성" },
    { id: "c5", text: "책 소개글 (200자 이내 요약 + 본문)" },
    { id: "c6", text: "카테고리 3단계 분류 선택" },
    { id: "c7", text: "정가 책정 (1,000원 단위)" },
    { id: "c8", text: "교보 eBook 작가 회원 가입" },
  ],
  ridi: [
    { id: "r1", text: "EPUB 3.0 형식 파일 준비" },
    { id: "r2", text: "ISBN 없이 등록 가능 (선택)" },
    { id: "r3", text: "표지 이미지 JPG (600×850px 이상)" },
    { id: "r4", text: "책 소개글 작성 (장르 키워드 포함)" },
    { id: "r5", text: "카테고리 선택 (장르 세분화)" },
    { id: "r6", text: "정가 책정 (500원 단위 가능)" },
    { id: "r7", text: "리디 셀렉트 등록 여부 결정" },
    { id: "r8", text: "리디북스 파트너스 회원 가입" },
  ],
  yes24: [
    { id: "y1", text: "EPUB 또는 PDF 파일 준비" },
    { id: "y2", text: "ISBN 발급 (권장)" },
    { id: "y3", text: "표지 이미지 준비 (600×800px 이상)" },
    { id: "y4", text: "책 소개 및 저자 소개 작성" },
    { id: "y5", text: "독자 연령 등급 선택" },
    { id: "y6", text: "카테고리·태그 설정" },
    { id: "y7", text: "정가 및 할인 정책 설정" },
    { id: "y8", text: "YES24 작가 회원 등록" },
  ],
  aladin: [
    { id: "a1", text: "EPUB 또는 PDF 파일 준비" },
    { id: "a2", text: "ISBN 발급 (필수 권장)" },
    { id: "a3", text: "표지 이미지 준비 (고해상도)" },
    { id: "a4", text: "책 소개글 작성 (키워드 최적화)" },
    { id: "a5", text: "저자 페이지 프로필 작성" },
    { id: "a6", text: "카테고리 분류 (인문·소설·에세이 등)" },
    { id: "a7", text: "정가 책정" },
    { id: "a8", text: "알라딘 eBook 파트너 신청" },
  ]
};

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  return data.content?.[0]?.text || "응답을 생성하지 못했습니다.";
}

export default function App() {
  const [activeStep, setActiveStep] = useState("planning");
  const [selectedPlatforms, setSelectedPlatforms] = useState(["kyobo", "ridi", "yes24", "aladin"]);
  const [checks, setChecks] = useState({});
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState({ title: "", genre: "", target: "", summary: "" });
  const [activePlatformTab, setActivePlatformTab] = useState("kyobo");

  const togglePlatform = (key) => {
    setSelectedPlatforms(prev =>
      prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]
    );
  };

  const toggleCheck = (id) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getProgress = (platformKey) => {
    const items = CHECKLIST[platformKey] || [];
    const done = items.filter(i => checks[i.id]).length;
    return Math.round((done / items.length) * 100);
  };

  const AI_PROMPTS = {
    planning: (info) => `전자책 기획을 도와주세요. 주제: "${info || '미입력'}"
국내 독자(교보문고, 리디북스, 예스24, 알라딘 기준)에게 어필할 수 있는:
1) 타겟 독자층 분석
2) 비슷한 경쟁 도서 카테고리 3가지
3) 차별화 포인트 제안
4) 추천 장르 태그 5개
간결하게 답해주세요.`,
    manuscript: (text) => `아래 원고 일부를 분석해주세요:
"${text}"
1) 문체 일관성 평가
2) 가독성 개선 제안 3가지
3) 챕터 구조 추천
4) 전자책에 적합한 분량 가이드
한국 독자 기준으로 답해주세요.`,
    design: (info) => `전자책 메타데이터를 생성해주세요.
책 정보: "${info}"
아래를 생성해주세요:
1) 제목 후보 3개 (임팩트 있는 것으로)
2) 부제 2개
3) 책 소개글 (200자 내외)
4) 검색 키워드 7개
5) 적합한 표지 색상/분위기 제안`,
    upload: (platform) => `${platform} 전자책 등록 시 자주 하는 실수와 주의사항을 알려주세요. 실제 등록 경험자 관점으로 5가지만.`,
    marketing: (info) => `전자책 마케팅 문구를 만들어주세요.
책 정보: "${info}"
1) 인스타그램 홍보 문구 (해시태그 포함)
2) 블로그 포스팅 제목 3개
3) 출간 전·후 2주 SNS 일정표
4) 독자 리뷰 요청 이메일 템플릿 (3줄)`,
    monitor: (info) => `전자책 출간 후 관리 전략을 알려주세요.
상황: "${info || '첫 출간 후 1개월'}"
1) 판매 데이터에서 체크할 지표
2) 독자 피드백 수집 방법
3) 업데이트 주기 및 방법
4) 시리즈/후속작 전략`,
  };

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    setLoading(true);
    setAiResult("");
    try {
      const prompt = AI_PROMPTS[activeStep]?.(aiInput) || aiInput;
      const result = await callClaude(prompt);
      setAiResult(result);
    } catch (e) {
      setAiResult("오류가 발생했습니다. 다시 시도해주세요.");
    }
    setLoading(false);
  };

  const stepConfig = {
    planning: {
      title: "📚 기획 & 시장 분석",
      placeholder: "책의 주제나 아이디어를 입력하세요. 예: '30대 직장인을 위한 부업 전략'",
      hint: "AI가 타겟 독자, 경쟁 카테고리, 차별화 포인트를 분석해드립니다."
    },
    manuscript: {
      title: "✍️ 원고 교정 & 구조 분석",
      placeholder: "원고 일부를 붙여넣으세요 (첫 단락이나 챕터 도입부 권장)",
      hint: "문체 일관성, 가독성, 챕터 구조를 분석합니다."
    },
    design: {
      title: "🎨 메타데이터 & 편집 준비",
      placeholder: "책 제목(예정), 장르, 핵심 내용을 입력하세요",
      hint: "제목 후보, 책 소개글, 키워드, 표지 방향을 생성합니다."
    },
    upload: {
      title: "📤 플랫폼 등록 체크리스트",
      placeholder: "등록하려는 플랫폼 이름을 입력하세요 (예: 교보문고)",
      hint: "플랫폼별 주의사항과 자주 하는 실수를 알려드립니다."
    },
    marketing: {
      title: "📣 마케팅 & 홍보 플랜",
      placeholder: "책 제목, 장르, 타겟 독자를 입력하세요",
      hint: "SNS 문구, 블로그 제목, 2주 홍보 일정을 생성합니다."
    },
    monitor: {
      title: "📊 출간 후 관리 전략",
      placeholder: "현재 상황을 입력하세요. 예: '출간 1개월, 리뷰 3개, 판매 50권'",
      hint: "지표 분석, 피드백 수집, 업데이트 전략을 제안합니다."
    }
  };

  const current = stepConfig[activeStep];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0F0F13",
      fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif",
      color: "#E8E8F0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F0F13 100%)",
        borderBottom: "1px solid #2A2A3E",
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#6B6B8A", textTransform: "uppercase", marginBottom: 6 }}>
            전자책 출판 서포트 시스템
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#FFFFFF", letterSpacing: -0.5 }}>
            📖 eBook Publisher
          </h1>
        </div>
        {/* Platform toggles */}
        <div style={{ display: "flex", gap: 8 }}>
          {Object.entries(PLATFORMS).map(([key, p]) => (
            <button
              key={key}
              onClick={() => togglePlatform(key)}
              style={{
                padding: "6px 14px",
                borderRadius: 20,
                border: `2px solid ${selectedPlatforms.includes(key) ? p.color : "#2A2A3E"}`,
                background: selectedPlatforms.includes(key) ? p.color + "22" : "transparent",
                color: selectedPlatforms.includes(key) ? p.accent : "#555",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 89px)" }}>
        {/* Sidebar Steps */}
        <div style={{
          width: 200,
          background: "#141420",
          borderRight: "1px solid #1E1E30",
          padding: "24px 12px",
          flexShrink: 0,
        }}>
          {STEPS.map((step, i) => (
            <button
              key={step.id}
              onClick={() => { setActiveStep(step.id); setAiResult(""); setAiInput(""); }}
              style={{
                width: "100%",
                padding: "14px 12px",
                marginBottom: 4,
                borderRadius: 10,
                border: "none",
                background: activeStep === step.id
                  ? "linear-gradient(135deg, #1E2A4A, #1A3A6E)"
                  : "transparent",
                color: activeStep === step.id ? "#7BAAFF" : "#666",
                cursor: "pointer",
                textAlign: "left",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontSize: 18 }}>{step.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{i + 1}. {step.label}</div>
                <div style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{step.desc}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>

          {/* Step Header */}
          <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 700 }}>{current.title}</h2>
          <p style={{ margin: "0 0 24px", fontSize: 13, color: "#6B6B8A" }}>{current.hint}</p>

          {/* AI Input */}
          <div style={{
            background: "#141420",
            border: "1px solid #2A2A3E",
            borderRadius: 14,
            padding: 20,
            marginBottom: 20,
          }}>
            <textarea
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              placeholder={current.placeholder}
              rows={4}
              style={{
                width: "100%",
                background: "#0F0F18",
                border: "1px solid #2A2A3E",
                borderRadius: 8,
                color: "#E8E8F0",
                fontSize: 14,
                padding: "12px 14px",
                resize: "vertical",
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={handleAI}
              disabled={loading}
              style={{
                marginTop: 12,
                padding: "10px 24px",
                borderRadius: 8,
                border: "none",
                background: loading ? "#2A2A3E" : "linear-gradient(135deg, #1A6EE8, #4A9BFF)",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? "⏳ AI 분석 중..." : "✨ AI 분석 시작"}
            </button>
          </div>

          {/* AI Result */}
          {aiResult && (
            <div style={{
              background: "#0D1A2E",
              border: "1px solid #1A3A6E",
              borderRadius: 14,
              padding: 20,
              marginBottom: 28,
              whiteSpace: "pre-wrap",
              fontSize: 14,
              lineHeight: 1.8,
              color: "#C8D8F0",
            }}>
              <div style={{ fontSize: 11, letterSpacing: 2, color: "#4A7AFF", marginBottom: 12, fontWeight: 600 }}>
                AI 분석 결과
              </div>
              {aiResult}
            </div>
          )}

          {/* Platform Checklist (upload step) */}
          {activeStep === "upload" && (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                {selectedPlatforms.map(key => (
                  <button
                    key={key}
                    onClick={() => setActivePlatformTab(key)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: 8,
                      border: `2px solid ${activePlatformTab === key ? PLATFORMS[key].color : "#2A2A3E"}`,
                      background: activePlatformTab === key ? PLATFORMS[key].color + "22" : "transparent",
                      color: activePlatformTab === key ? PLATFORMS[key].accent : "#555",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {PLATFORMS[key].name}
                  </button>
                ))}
              </div>

              {selectedPlatforms.includes(activePlatformTab) && (
                <div style={{
                  background: "#141420",
                  border: `1px solid ${PLATFORMS[activePlatformTab].color}44`,
                  borderRadius: 14,
                  padding: 20,
                }}>
                  {/* Platform Info */}
                  <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
                    {[
                      { label: "지원 포맷", value: PLATFORMS[activePlatformTab].formats.join(", ") },
                      { label: "ISBN 필요", value: PLATFORMS[activePlatformTab].hasISBN ? "필수" : "선택" },
                      { label: "검토 기간", value: PLATFORMS[activePlatformTab].reviewDays },
                      { label: "수수료", value: PLATFORMS[activePlatformTab].commission },
                    ].map(item => (
                      <div key={item.label} style={{
                        background: "#0F0F18",
                        borderRadius: 8,
                        padding: "10px 16px",
                        flex: "1",
                        minWidth: 100,
                      }}>
                        <div style={{ fontSize: 10, color: "#555", marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: PLATFORMS[activePlatformTab].accent }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{
                    background: PLATFORMS[activePlatformTab].color + "15",
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    color: "#AAA",
                    marginBottom: 16,
                  }}>
                    💡 {PLATFORMS[activePlatformTab].tip}
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 6 }}>
                      <span>등록 준비 완료도</span>
                      <span style={{ color: PLATFORMS[activePlatformTab].accent }}>{getProgress(activePlatformTab)}%</span>
                    </div>
                    <div style={{ height: 6, background: "#1E1E30", borderRadius: 3 }}>
                      <div style={{
                        height: "100%",
                        width: `${getProgress(activePlatformTab)}%`,
                        background: `linear-gradient(90deg, ${PLATFORMS[activePlatformTab].color}, ${PLATFORMS[activePlatformTab].accent})`,
                        borderRadius: 3,
                        transition: "width 0.4s",
                      }} />
                    </div>
                  </div>

                  {/* Checklist */}
                  {(CHECKLIST[activePlatformTab] || []).map(item => (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 14px",
                        marginBottom: 6,
                        borderRadius: 8,
                        background: checks[item.id] ? PLATFORMS[activePlatformTab].color + "18" : "#0F0F18",
                        border: `1px solid ${checks[item.id] ? PLATFORMS[activePlatformTab].color + "44" : "#1E1E30"}`,
                        cursor: "pointer",
                        transition: "all 0.2s",
                      }}
                    >
                      <div style={{
                        width: 20,
                        height: 20,
                        borderRadius: 4,
                        border: `2px solid ${checks[item.id] ? PLATFORMS[activePlatformTab].color : "#333"}`,
                        background: checks[item.id] ? PLATFORMS[activePlatformTab].color : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        flexShrink: 0,
                        transition: "all 0.2s",
                      }}>
                        {checks[item.id] && "✓"}
                      </div>
                      <span style={{
                        fontSize: 13,
                        color: checks[item.id] ? "#888" : "#CCC",
                        textDecoration: checks[item.id] ? "line-through" : "none",
                      }}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Platform Overview cards (non-upload steps) */}
          {activeStep !== "upload" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {selectedPlatforms.map(key => {
                const p = PLATFORMS[key];
                const prog = getProgress(key);
                return (
                  <div key={key} style={{
                    background: "#141420",
                    border: `1px solid ${p.color}33`,
                    borderRadius: 12,
                    padding: 16,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: p.accent }}>{p.name}</span>
                      <span style={{ fontSize: 11, color: "#555" }}>{p.commission} 수수료</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>{p.formats.join(" · ")} | 검토 {p.reviewDays}</div>
                    <div style={{ fontSize: 11, color: "#888", lineHeight: 1.6, marginBottom: 12 }}>{p.tip}</div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#555", marginBottom: 4 }}>
                        <span>체크리스트</span>
                        <span style={{ color: p.accent }}>{prog}%</span>
                      </div>
                      <div style={{ height: 4, background: "#1E1E30", borderRadius: 2 }}>
                        <div style={{
                          height: "100%", width: `${prog}%`,
                          background: `linear-gradient(90deg, ${p.color}, ${p.accent})`,
                          borderRadius: 2, transition: "width 0.4s",
                        }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
