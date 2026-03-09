"use client";

import { useState } from "react";

const PLATFORMS = {
  kyobo: {
    name: "교보문고",
    color: "#E8321A",
    accent: "#FF6B4A",
    formats: "EPUB, PDF",
    isbn: "필수",
    days: "7~14일",
    fee: "30%",
    tip: "국내 최대 브랜드 파워. 원고 검수 기간이 있으니 여유 있게 제출하세요.",
    items: [
      "ePub3 형식 파일",
      "표지 이미지 (600×900px)",
      "ISBN 등록",
      "저자 정보 등록",
      "카테고리 설정",
      "책 소개 문구 (2000자 이내)",
      "목차 등록",
      "가격 설정",
    ],
  },
  ridi: {
    name: "리디북스",
    color: "#1A6EE8",
    accent: "#4A9BFF",
    formats: "EPUB 3.0",
    isbn: "선택",
    days: "3~7일",
    fee: "30~35%",
    tip: "장르소설·독립출판 강세. 이벤트·프로모션 참여 기회가 많아요.",
    items: [
      "ePub2/ePub3 형식 파일",
      "표지 이미지 (720×1080px)",
      "리디 파트너스 계정",
      "저자 프로필 사진",
      "책 소개 (HTML 가능)",
      "장르/카테고리 선택",
      "DRM 설정 여부",
      "연재/완결 설정",
    ],
  },
  yes24: {
    name: "예스24",
    color: "#E87B1A",
    accent: "#FFB04A",
    formats: "EPUB, PDF",
    isbn: "권장",
    days: "5~10일",
    fee: "30%",
    tip: "서평단·이벤트 시스템이 활발해 독자 소통에 유리해요.",
    items: [
      "ePub 형식 파일",
      "표지 이미지 (600×900px)",
      "출판사 등록 (1인 출판 가능)",
      "저자 서명 동의",
      "책 소개 등록",
      "독자 대상 설정",
      "출간일 설정",
      "정가 등록",
    ],
  },
  aladin: {
    name: "알라딘",
    color: "#1AAA6E",
    accent: "#4AFFB0",
    formats: "EPUB, PDF",
    isbn: "권장",
    days: "5~10일",
    fee: "30%",
    tip: "인문·소설·에세이 독자층이 탄탄하고 서평 문화가 발달해 있어요.",
    items: [
      "ePub 형식 파일",
      "표지 이미지 (600×900px)",
      "알라딘 출판사 계정",
      "TTB(Thanks To Blogger) 설정",
      "책 소개 문구",
      "키워드 태그 설정",
      "유통 범위 설정",
      "할인율 설정",
    ],
  },
};

const STEPS = [
  {
    id: "planning",
    label: "기획",
    icon: "💡",
    desc: "주제·타겟·시장분석",
    hint: "책의 주제와 타겟 독자를 명확히 하고 시장을 분석하세요.",
    tasks: [
      "주제 및 타겟 독자 설정",
      "경쟁 도서 리서치",
      "목차 초안 작성",
      "출판 일정 수립",
      "수익 모델 결정",
    ],
    aiPlaceholder:
      "예: '매일 밤 유튜브를 끊지 못하는 30대를 위한 집중력 회복 가이드'",
    aiPrompt: (
      v,
    ) => `당신은 뇌과학과 행동설계에 기반한 출판 전략 컨설턴트입니다.

책 주제: "${v}"

독자의 뇌는 정보 과부하를 싫어합니다. 도파민 보상 루프와 '작게 시작하기(tiny habits)' 원칙을 바탕으로 분석해주세요.

출력 형식을 반드시 아래 구조로만 작성하세요. 마크다운 기호(###, **, -)를 사용하지 마세요:

[기획의 씨앗 한 줄]
→ 이 책이 존재해야 하는 이유를 창작자의 언어로 한 문장으로

[타겟 독자]
→ 구체적인 상황 묘사 2줄

[경쟁 도서 실패 이유]
① 카테고리명: 실패 이유
② 카테고리명: 실패 이유
③ 카테고리명: 실패 이유

[차별화 핵심]
→ 이 책만의 접근법 2줄

[수익 모델]
① 수익 방식: 구체적인 운영 방법과 수익 창출 방식
② 수익 방식: 구체적인 운영 방법과 수익 창출 방식

[검색 태그]
태그1 / 태그2 / 태그3 / 태그4 / 태그5`,
  },

  {
    id: "manuscript",
    label: "원고",
    icon: "✍️",
    desc: "교정·구조·가독성",
    hint: "원고 일부를 붙여넣으면 문체, 구조, 가독성을 분석해드립니다.",
    tasks: [
      "챕터별 초안 작성",
      "참고 자료 정리",
      "이미지/도표 준비",
      "원고 분량 확인",
      "초안 완성",
    ],
    aiPlaceholder: "원고 일부를 붙여넣으세요 (첫 단락 또는 챕터 도입부 권장)",
    aiPrompt: (v) => `당신은 인지과학과 독서 심리학을 전공한 편집자입니다.

원고 일부:
"""
${v}
"""

현대 독자의 평균 집중 지속 시간은 8초입니다. 스마트폰 중독으로 인해 딥리딩 능력이 저하된 독자를 위해 분석해주세요.

출력 형식을 반드시 아래 구조로만 작성하세요. 마크다운 기호(###, **, -)를 사용하지 마세요:

[문체 일관성]
① 개선점: 구체적 수정 방향 / 근거: 독자 뇌에 효과적인 이유
② 개선점: 구체적 수정 방향 / 근거: 독자 뇌에 효과적인 이유
③ 개선점: 구체적 수정 방향 / 근거: 독자 뇌에 효과적인 이유

[챕터 구조 추천]
→ 이 원고에 맞는 챕터 흐름을 3단계로 제안 (도입 → 전개 → 완결)
→ 각 단계에서 독자가 얻어야 할 하나의 인사이트 명시
→ 15분 완독 원칙 기준으로 각 파트 권장 분량 제시

[분량 가이드]
→ 이 원고의 현재 밀도 평가 (너무 빽빽함 / 적정 / 너무 얇음)
→ 전자책 집중력 보존 기준 권장 총 분량과 근거
→ 지금 당장 줄이거나 늘려야 할 부분 1곳 지목`,
  },

  {
    id: "design",
    label: "편집·표지",
    icon: "🎨",
    desc: "메타데이터·포맷",
    hint: "책 정보를 입력하면 제목 후보, 소개글, 키워드를 자동 생성합니다.",
    tasks: [
      "문법/맞춤법 교정",
      "내용 구성 재검토",
      "이미지 최적화",
      "ePub/PDF 변환",
      "표지 디자인 완성",
    ],
    aiPlaceholder:
      "예: '제목 미정 / 장르: 자기계발 / 저자 경험: 번아웃 후 1인 출판사 차린 직장인 / 핵심 메시지: 작게 써도 된다'",
    aiPrompt: (v) => `당신은 북 마케팅과 메타데이터 최적화 전문가입니다.

책 정보: "${v}"

AI 생성 콘텐츠가 넘쳐나는 시대, 독자는 '인간의 관점'에 반응합니다. 저자의 고유한 경험과 목소리가 살아있는 방향으로 분석해주세요.

출력 형식을 반드시 아래 구조로만 작성하세요. 마크다운 기호(###, **, -)를 사용하지 마세요:

[제목 후보]
① 제목: 선택 이유 한 줄
② 제목: 선택 이유 한 줄
③ 제목: 선택 이유 한 줄

[부제]
① 부제: 선택 이유 한 줄
② 부제: 선택 이유 한 줄

[책 소개글]
→ 200자 이내, 첫 문장에 독자의 현재 상황 묘사

[검색 키워드]
키워드1 / 키워드2 / 키워드3 / 키워드4 / 키워드5 / 키워드6 / 키워드7

[표지 분위기]
→ 색상 방향: 구체적 제안
→ 분위기 키워드: 3개
→ 피해야 할 것: 1줄`,
  },

  {
    id: "upload",
    label: "플랫폼 등록",
    icon: "📤",
    desc: "플랫폼별 체크리스트",
    hint: "헤더에서 플랫폼을 선택하면 해당 플랫폼의 등록 체크리스트가 표시됩니다.",
    tasks: [
      "교보문고 등록 완료",
      "리디북스 등록 완료",
      "예스24 등록 완료",
      "알라딘 등록 완료",
      "가격 책정 완료",
    ],
    aiPlaceholder:
      "예: '교보문고, EPUB 파일은 있는데 ISBN 발급 전이고 표지 해상도가 낮음'",
    aiPrompt: (
      v,
    ) => `당신은 국내 전자책 플랫폼 등록 경험이 풍부한 1인 출판사 운영자입니다.

상황: "${v}"

한 번에 완벽하게 하려다 포기하는 것을 막기 위해, 가장 많이 막히는 지점과 최소 실행 가능한 해결책을 알려주세요.

출력 형식을 반드시 아래 구조로만 작성하세요. 마크다운 기호(###, **, -)를 사용하지 마세요:

[가장 많이 하는 실수]
① 실수 내용: 이유
② 실수 내용: 이유
③ 실수 내용: 이유

[최소 등록 조건]
→ 일단 이것만 하면 된다는 필수 항목 3가지

[수정 가능 여부]
→ 나중에 수정 가능: 항목 나열
→ 처음부터 잘해야 함: 항목 나열

[반려 사유 TOP 3]
① 사유: 예방법
② 사유: 예방법
③ 사유: 예방법

[등록 후 24시간 체크]
→ 반드시 확인해야 할 것 3가지`,
  },

  {
    id: "marketing",
    label: "마케팅",
    icon: "📣",
    desc: "홍보·SNS·일정",
    hint: "책 정보를 입력하면 SNS 문구, 블로그 제목, 2주 홍보 일정을 생성합니다.",
    tasks: [
      "SNS 홍보 콘텐츠 제작",
      "블로그 리뷰 요청",
      "이메일 뉴스레터 발송",
      "유튜브/팟캐스트 홍보",
      "할인 이벤트 기획",
    ],
    aiPlaceholder:
      "예: '책 제목: 8초 집중력 / 타겟: 스마트폰 중독이 의심되는 20~40대 / 출간일: 이번 주 금요일'",
    aiPrompt: (
      v,
    ) => `당신은 행동경제학과 SNS 심리학을 활용하는 도서 마케터입니다.

책 정보: "${v}"

SNS는 중독 설계된 플랫폼입니다. 독자의 스크롤을 멈추게 하려면 뇌의 패턴 인식과 감정 반응을 활용해야 합니다.

출력 형식을 반드시 아래 구조로만 작성하세요. 마크다운 기호(###, **, -)를 사용하지 마세요:

[인스타그램 문구]
→ 본문: 첫 1.5초에 멈추게 하는 고통/질문 훅으로 시작
→ 해시태그: #태그1 #태그2 #태그3 #태그4 #태그5 #태그6 #태그7 #태그8 #태그9 #태그10
→ 활용 심리: 이 문구가 독자의 어떤 심리를 건드리는가

[블로그 제목]
① 정보형: 제목
② 비교형: 제목
③ 해결형: 제목

[2주 SNS 일정]
D-7: 할 것 (기대감 형성)
D-5: 할 것
D-3: 할 것
D-1: 할 것
D-Day: 할 것 (공개)
D+2: 할 것
D+5: 할 것 (사회적 증거 수집)
D+7: 할 것
D+14: 할 것

[리뷰 요청 메시지]
→ 독자가 기여한다는 느낌을 주는 3줄 메시지`,
  },

  {
    id: "monitor",
    label: "관리",
    icon: "📊",
    desc: "피드백·업데이트",
    hint: "출간 후 현황을 입력하면 판매 전략과 업데이트 방향을 제안합니다.",
    tasks: [
      "판매 현황 모니터링",
      "독자 리뷰 관리",
      "수익 정산 확인",
      "개정판 계획 수립",
      "시리즈 기획 검토",
    ],
    aiPlaceholder:
      "예: '출간 3주차, 리디 12권·교보 8권, 리뷰 2개(둘 다 \"어렵지 않아서 좋았다\"), SNS 반응 거의 없음'",
    aiPrompt: (v) => `당신은 데이터 기반 출판 전략가이자 작가 코치입니다.

현황: "${v || "출간 1개월 차, 데이터 없음"}"

AI가 할 수 있는 것(데이터 분석, 패턴 인식)과 인간 저자만 할 수 있는 것(독자와의 관계, 진정성)을 구분하여 분석해주세요.

출력 형식을 반드시 아래 구조로만 작성하세요. 마크다운 기호(###, **, -)를 사용하지 마세요:

[핵심 지표]
① 지표명: 지금 이 수치가 의미하는 것
② 지표명: 지금 이 수치가 의미하는 것
③ 지표명: 지금 이 수치가 의미하는 것

[독자 피드백 해석]
→ 데이터에서 읽히는 신호: 1줄
→ AI가 놓치는 감정적 신호: 1줄
→ 저자가 직접 확인해야 할 것: 1줄

[업데이트 전략]
→ 권장 방식: "작게 자주" 또는 "크게 한 번" + 이유
→ 구체적 실행 방법: 2줄

[후속작 시그널]
→ 독자 반응에서 읽히는 다음 책의 힌트 2가지

[이번 주 액션 아이템]
→ 저자로서 이번 주 단 하나만 한다면: 구체적 행동 1가지`,
  },
];

export default function EbookPublisher() {
  const [activeStep, setActiveStep] = useState("planning");
  const [activePlatform, setActivePlatform] = useState("kyobo");
  const [stepChecks, setStepChecks] = useState({});
  const [platformChecks, setPlatformChecks] = useState({});
  const [aiInput, setAiInput] = useState({});
  const [aiResult, setAiResult] = useState({});
  const [aiLoading, setAiLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(aiResult[activeStep] || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleStepCheck = (key) =>
    setStepChecks((p) => ({ ...p, [key]: !p[key] }));
  const togglePlatformCheck = (key) =>
    setPlatformChecks((p) => ({ ...p, [key]: !p[key] }));

  const getStepProgress = (id) => {
    const s = STEPS.find((s) => s.id === id);
    if (!s) return 0;
    const done = s.tasks.filter((_, i) => stepChecks[`${id}-${i}`]).length;
    return Math.round((done / s.tasks.length) * 100);
  };

  const getPlatformProgress = (key) => {
    const items = PLATFORMS[key]?.items || [];
    const done = items.filter((_, i) => platformChecks[`${key}-${i}`]).length;
    return Math.round((done / items.length) * 100);
  };

  const overallProgress = Math.round(
    STEPS.reduce((sum, s) => sum + getStepProgress(s.id), 0) / STEPS.length,
  );

  const handleAI = async () => {
    const currentInput = aiInput[activeStep] || "";
    if (!currentInput.trim()) return;
    setAiLoading(true);
    setAiResult((prev) => ({ ...prev, [activeStep]: "" }));
    try {
      const step = STEPS.find((s) => s.id === activeStep);
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: step.aiPrompt(currentInput) }],
        }),
      });
      const data = await res.json();
      setAiResult((prev) => ({
        ...prev,
        [activeStep]: data.content?.[0]?.text || "응답을 생성하지 못했습니다.",
      }));
    } catch {
      setAiResult((prev) => ({
        ...prev,
        [activeStep]: "오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      }));
    }
    setAiLoading(false);
  };

  const cur = STEPS.find((s) => s.id === activeStep);
  const p = PLATFORMS[activePlatform];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0F",
        color: "#E8E8F2",
        fontFamily: "'Noto Sans KR','Apple SD Gothic Neo',sans-serif",
      }}
    >
      {/* ── 헤더: 로고 | 플랫폼 버튼들 | 전체 진행률 ── */}
      <header
        style={{
          background: "#0D0D16",
          borderBottom: "1px solid #252535",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        {/* 로고 */}
        <div>
          <div
            style={{
              fontSize: 10,
              letterSpacing: 4,
              color: "#6B6B8A",
              textTransform: "uppercase",
              marginBottom: 3,
            }}
          >
            전자책 출판 서포트 시스템
          </div>
          <h1
            style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff" }}
          >
            📖 eBook Publisher
          </h1>
        </div>

        {/* 플랫폼 버튼 + 전체 진행률 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {/* 플랫폼 선택 버튼 */}
          <div style={{ display: "flex", gap: 7 }}>
            {Object.entries(PLATFORMS).map(([key, plat]) => {
              const isActive = activePlatform === key;
              return (
                <button
                  key={key}
                  onClick={() => setActivePlatform(key)}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 20,
                    border: `2px solid ${isActive ? plat.color : "#252535"}`,
                    background: isActive ? plat.color + "22" : "transparent",
                    color: isActive ? plat.accent : "#555",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {plat.name}
                </button>
              );
            })}
          </div>

          {/* 전체 진행률 — 맨 우측 */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, color: "#6B6B8A" }}>전체 진행률</span>
            <div
              style={{
                width: 100,
                height: 5,
                background: "#252535",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${overallProgress}%`,
                  background: "linear-gradient(90deg,#1A5EE8,#4A8AFF)",
                  borderRadius: 3,
                  transition: "width 0.5s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#4A8AFF",
                minWidth: 32,
              }}
            >
              {overallProgress}%
            </span>
          </div>
        </div>
      </header>

      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        {/* ── 사이드바 ── */}
        <aside
          style={{
            width: 180,
            flexShrink: 0,
            background: "#0D0D14",
            borderRight: "1px solid #1E1E2E",
            padding: "20px 10px",
            position: "sticky",
            top: 65,
            height: "calc(100vh - 65px)",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              fontSize: 10,
              letterSpacing: 3,
              color: "#3A3A4A",
              textTransform: "uppercase",
              padding: "0 12px",
              marginBottom: 14,
            }}
          >
            출판 단계
          </div>
          {STEPS.map((step, i) => {
            const prog = getStepProgress(step.id);
            const isActive = activeStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => {
                  setActiveStep(step.id);
                }}
                style={{
                  width: "100%",
                  padding: "12px 12px",
                  marginBottom: 3,
                  borderRadius: 10,
                  border: "none",
                  background: isActive
                    ? "linear-gradient(135deg,#1A2040,#1A3060)"
                    : "transparent",
                  color: isActive ? "#7BAAFF" : "#555",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  fontFamily: "inherit",
                }}
              >
                <span style={{ fontSize: 17 }}>{step.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>
                    {i + 1}. {step.label}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: isActive ? "#4A6AAA" : "#3A3A4A",
                      marginTop: 2,
                    }}
                  >
                    {step.desc}
                  </div>
                </div>
                {prog > 0 && (
                  <span
                    style={{ fontSize: 10, color: "#4A8AFF", fontWeight: 700 }}
                  >
                    {prog}%
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* ── 메인: 탭별 내용만 표시 ── */}
        <main style={{ flex: 1, padding: "28px 32px", overflowY: "auto" }}>
          {/* 단계 제목 */}
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 5 }}>
            {cur?.icon} {cur?.label} 단계
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#6B6B8A",
              marginBottom: 22,
              lineHeight: 1.6,
            }}
          >
            {cur?.hint}
          </div>

          {/* ── 기획 / 원고 / 편집 / 마케팅 / 관리 탭: AI 입력 + 체크리스트 ── */}
          {activeStep !== "upload" && (
            <>
              {/* AI 분석 박스 */}
              <div
                style={{
                  background: "#12121A",
                  border: "1px solid #252535",
                  borderRadius: 14,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#7A7A9A",
                    marginBottom: 12,
                  }}
                >
                  🤖 AI 분석 — {cur?.label} 단계
                </div>
                <textarea
                  value={aiInput[activeStep] || ""}
                  rows={4}
                  placeholder={cur?.aiPlaceholder}
                  onChange={(e) =>
                    setAiInput((prev) => ({
                      ...prev,
                      [activeStep]: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    background: "#0A0A10",
                    border: "1px solid #252535",
                    borderRadius: 8,
                    color: "#E8E8F2",
                    fontSize: 13,
                    padding: "11px 13px",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    lineHeight: 1.7,
                    minHeight: 90,
                  }}
                />
                <button
                  onClick={handleAI}
                  disabled={aiLoading}
                  style={{
                    marginTop: 10,
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: aiLoading
                      ? "#222"
                      : "linear-gradient(135deg,#1A5EE8,#4A8AFF)",
                    color: aiLoading ? "#555" : "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {aiLoading ? "⏳ 분석 중..." : "✨ AI 분석 시작"}
                </button>
              </div>

              {/* AI 결과 */}
              {aiResult[activeStep] && (
                <div
                  style={{
                    background: "#0A1428",
                    border: "1px solid #1A3A6E",
                    borderRadius: 14,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        letterSpacing: 3,
                        color: "#4A8AFF",
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      ✦ AI 분석 결과
                    </div>
                    <button
                      onClick={handleCopy}
                      style={{
                        padding: "4px 12px",
                        borderRadius: 6,
                        border: "1px solid #1A3A6E",
                        background: "transparent",
                        color: "#4A8AFF",
                        fontSize: 11,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      복사
                    </button>
                  </div>
                  <div
                    style={{ fontSize: 14, lineHeight: 1.9, color: "#C0D0F0" }}
                    dangerouslySetInnerHTML={{
                      __html: (aiResult[activeStep] || "")
                        .replace(
                          /### (.*)/g,
                          '<h3 style="color:#7BAAFF;font-size:14px;margin:16px 0 6px">$1</h3>',
                        )
                        .replace(
                          /## (.*)/g,
                          '<h2 style="color:#A0C0FF;font-size:16px;margin:20px 0 8px">$1</h2>',
                        )
                        .replace(
                          /\*\*(.*?)\*\*/g,
                          '<strong style="color:#E0E8FF">$1</strong>',
                        )
                        .replace(
                          /^- (.*)/gm,
                          '<div style="padding:3px 0 3px 12px;border-left:2px solid #1A3A6E">$1</div>',
                        )
                        .replace(/\n/g, "<br/>"),
                    }}
                  />
                </div>
              )}

              {/* 단계별 체크리스트 */}
              <div
                style={{
                  background: "#12121A",
                  border: "1px solid #252535",
                  borderRadius: 14,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: "#7A7A9A" }}
                  >
                    {cur?.label} 체크리스트
                  </span>
                  <span
                    style={{ fontSize: 12, color: "#4A8AFF", fontWeight: 700 }}
                  >
                    {getStepProgress(activeStep)}%
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    background: "#1E1E2E",
                    borderRadius: 2,
                    marginBottom: 16,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${getStepProgress(activeStep)}%`,
                      background: "linear-gradient(90deg,#1A5EE8,#4AFFAA)",
                      borderRadius: 2,
                      transition: "width 0.4s",
                    }}
                  />
                </div>
                {cur?.tasks.map((task, i) => {
                  const key = `${activeStep}-${i}`;
                  const done = stepChecks[key];
                  return (
                    <div
                      key={i}
                      onClick={() => toggleStepCheck(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        marginBottom: 6,
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: done ? "#0F2A0F" : "#0A0A10",
                        border: `1px solid ${done ? "#1A5A1A" : "#1E1E2E"}`,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          border: `2px solid ${done ? "#4AFF88" : "#333"}`,
                          background: done ? "#4AFF88" : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#000",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        {done && "✓"}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: done ? "#555" : "#CCC",
                          textDecoration: done ? "line-through" : "none",
                        }}
                      >
                        {task}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── 플랫폼 등록 탭: 선택한 플랫폼 체크리스트 ── */}
          {activeStep === "upload" && (
            <>
              {/* 플랫폼 탭 버튼 */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                {Object.entries(PLATFORMS).map(([key, plat]) => {
                  const isActive = activePlatform === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActivePlatform(key)}
                      style={{
                        padding: "8px 20px",
                        borderRadius: 8,
                        border: `2px solid ${isActive ? plat.color : "#252535"}`,
                        background: isActive
                          ? plat.color + "22"
                          : "transparent",
                        color: isActive ? plat.accent : "#555",
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.2s",
                      }}
                    >
                      {plat.name}
                    </button>
                  );
                })}
              </div>

              {/* 선택 플랫폼 정보 카드 */}
              <div
                style={{
                  background: "#12121A",
                  border: `1px solid ${p.color}44`,
                  borderRadius: 14,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: p.accent,
                    marginBottom: 16,
                  }}
                >
                  🏪 {p.name} 등록 체크리스트
                </div>

                {/* 4칸 정보 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4,1fr)",
                    gap: 10,
                    marginBottom: 14,
                  }}
                >
                  {[
                    ["지원 포맷", p.formats],
                    ["ISBN", p.isbn],
                    ["검토 기간", p.days],
                    ["수수료", p.fee],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      style={{
                        background: "#0A0A10",
                        borderRadius: 8,
                        padding: "9px 13px",
                      }}
                    >
                      <div
                        style={{ fontSize: 10, color: "#555", marginBottom: 4 }}
                      >
                        {label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: p.accent,
                        }}
                      >
                        {value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 팁 */}
                <div
                  style={{
                    background: p.color + "12",
                    borderRadius: 8,
                    padding: "9px 13px",
                    fontSize: 12,
                    color: "#999",
                    marginBottom: 14,
                    lineHeight: 1.6,
                  }}
                >
                  💡 {p.tip}
                </div>

                {/* 진행률 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#555",
                    marginBottom: 6,
                  }}
                >
                  <span>등록 준비 완료도</span>
                  <span style={{ color: p.accent }}>
                    {getPlatformProgress(activePlatform)}%
                  </span>
                </div>
                <div
                  style={{
                    height: 5,
                    background: "#1E1E2E",
                    borderRadius: 3,
                    marginBottom: 14,
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${getPlatformProgress(activePlatform)}%`,
                      background: `linear-gradient(90deg,${p.color},${p.accent})`,
                      borderRadius: 3,
                      transition: "width 0.4s",
                    }}
                  />
                </div>

                {/* 체크리스트 항목 */}
                {p.items.map((item, i) => {
                  const key = `${activePlatform}-${i}`;
                  const done = platformChecks[key];
                  return (
                    <div
                      key={i}
                      onClick={() => togglePlatformCheck(key)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "11px 14px",
                        marginBottom: 6,
                        borderRadius: 8,
                        cursor: "pointer",
                        transition: "all 0.2s",
                        background: done ? p.color + "14" : "#0A0A10",
                        border: `1px solid ${done ? p.color + "55" : "#1E1E2E"}`,
                      }}
                    >
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 4,
                          border: `2px solid ${done ? p.color : "#333"}`,
                          background: done ? p.color : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "#fff",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        {done && "✓"}
                      </div>
                      <span
                        style={{
                          fontSize: 13,
                          color: done ? "#555" : "#CCC",
                          textDecoration: done ? "line-through" : "none",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* AI 주의사항 */}
              <div
                style={{
                  background: "#12121A",
                  border: "1px solid #252535",
                  borderRadius: 14,
                  padding: 20,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#7A7A9A",
                    marginBottom: 12,
                  }}
                >
                  🤖 플랫폼 등록 주의사항 AI 조회
                </div>
                <textarea
                  value={aiInput[activeStep] || ""}
                  rows={2}
                  placeholder={cur?.aiPlaceholder}
                  onChange={(e) =>
                    setAiInput((prev) => ({
                      ...prev,
                      [activeStep]: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    background: "#0A0A10",
                    border: "1px solid #252535",
                    borderRadius: 8,
                    color: "#E8E8F2",
                    fontSize: 13,
                    padding: "11px 13px",
                    resize: "vertical",
                    outline: "none",
                    fontFamily: "inherit",
                    boxSizing: "border-box",
                    lineHeight: 1.7,
                  }}
                />
                <button
                  onClick={handleAI}
                  disabled={aiLoading}
                  style={{
                    marginTop: 10,
                    padding: "10px 22px",
                    borderRadius: 8,
                    border: "none",
                    background: aiLoading
                      ? "#222"
                      : "linear-gradient(135deg,#1A5EE8,#4A8AFF)",
                    color: aiLoading ? "#555" : "#fff",
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: aiLoading ? "not-allowed" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {aiLoading ? "⏳ 조회 중..." : "✨ 주의사항 확인"}
                </button>
                {aiResult[activeStep] && (
                  <div
                    style={{
                      marginTop: 16,
                      background: "#0A1428",
                      border: "1px solid #1A3A6E",
                      borderRadius: 10,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          letterSpacing: 3,
                          color: "#4A8AFF",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        ✦ AI 안내
                      </div>
                      <button
                        onClick={handleCopy}
                        style={{
                          padding: "4px 12px",
                          borderRadius: 6,
                          border: `1px solid ${copied ? "#1A6E3A" : "#1A3A6E"}`,
                          background: copied ? "#0A2A1A" : "transparent",
                          color: copied ? "#4AFF88" : "#4A8AFF",
                          fontSize: 11,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "all 0.2s",
                        }}
                      >
                        {copied ? "✓ 복사됨" : "복사"}
                      </button>
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.9,
                        color: "#C0D0F0",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: (aiResult[activeStep] || "")
                          .replace(
                            /### (.*)/g,
                            '<h3 style="color:#7BAAFF;font-size:14px;margin:16px 0 6px">$1</h3>',
                          )
                          .replace(
                            /## (.*)/g,
                            '<h2 style="color:#A0C0FF;font-size:16px;margin:20px 0 8px">$1</h2>',
                          )
                          .replace(
                            /\*\*(.*?)\*\*/g,
                            '<strong style="color:#E0E8FF">$1</strong>',
                          )
                          .replace(
                            /^- (.*)/gm,
                            '<div style="padding:3px 0 3px 12px;border-left:2px solid #1A3A6E">$1</div>',
                          )
                          .replace(/\n/g, "<br/>"),
                      }}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
