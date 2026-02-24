'use client';

import { useState } from 'react';

const PLATFORMS = {
  kyobo: {
    name: '교보문고', color: '#E8321A', accent: '#FF6B4A',
    formats: 'EPUB, PDF', isbn: '필수', days: '7~14일', fee: '30%',
    tip: '국내 최대 브랜드 파워. 원고 검수 기간이 있으니 여유 있게 제출하세요.',
    items: ['ePub3 형식 파일', '표지 이미지 (600×900px)', 'ISBN 등록', '저자 정보 등록', '카테고리 설정', '책 소개 문구 (2000자 이내)', '목차 등록', '가격 설정'],
  },
  ridi: {
    name: '리디북스', color: '#1A6EE8', accent: '#4A9BFF',
    formats: 'EPUB 3.0', isbn: '선택', days: '3~7일', fee: '30~35%',
    tip: '장르소설·독립출판 강세. 이벤트·프로모션 참여 기회가 많아요.',
    items: ['ePub2/ePub3 형식 파일', '표지 이미지 (720×1080px)', '리디 파트너스 계정', '저자 프로필 사진', '책 소개 (HTML 가능)', '장르/카테고리 선택', 'DRM 설정 여부', '연재/완결 설정'],
  },
  yes24: {
    name: '예스24', color: '#E87B1A', accent: '#FFB04A',
    formats: 'EPUB, PDF', isbn: '권장', days: '5~10일', fee: '30%',
    tip: '서평단·이벤트 시스템이 활발해 독자 소통에 유리해요.',
    items: ['ePub 형식 파일', '표지 이미지 (600×900px)', '출판사 등록 (1인 출판 가능)', '저자 서명 동의', '책 소개 등록', '독자 대상 설정', '출간일 설정', '정가 등록'],
  },
  aladin: {
    name: '알라딘', color: '#1AAA6E', accent: '#4AFFB0',
    formats: 'EPUB, PDF', isbn: '권장', days: '5~10일', fee: '30%',
    tip: '인문·소설·에세이 독자층이 탄탄하고 서평 문화가 발달해 있어요.',
    items: ['ePub 형식 파일', '표지 이미지 (600×900px)', '알라딘 출판사 계정', 'TTB(Thanks To Blogger) 설정', '책 소개 문구', '키워드 태그 설정', '유통 범위 설정', '할인율 설정'],
  },
};

const STEPS = [
  { id: 'planning', label: '기획', icon: '💡', desc: '주제·타겟·시장분석',
    tasks: ['주제 및 타겟 독자 설정', '경쟁 도서 리서치', '목차 초안 작성', '출판 일정 수립', '수익 모델 결정'] },
  { id: 'manuscript', label: '원고', icon: '✍️', desc: '교정·구조·가독성',
    tasks: ['챕터별 초안 작성', '참고 자료 정리', '이미지/도표 준비', '원고 분량 확인', '초안 완성'] },
  { id: 'design', label: '편집·표지', icon: '🎨', desc: '메타데이터·포맷',
    tasks: ['문법/맞춤법 교정', '내용 구성 재검토', '이미지 최적화', 'ePub/PDF 변환', '표지 디자인 완성'] },
  { id: 'upload', label: '플랫폼 등록', icon: '📤', desc: '체크리스트',
    tasks: ['교보문고 등록', '리디북스 등록', '예스24 등록', '알라딘 등록', '가격 책정 완료'] },
  { id: 'marketing', label: '마케팅', icon: '📣', desc: '홍보·SNS·일정',
    tasks: ['SNS 홍보 콘텐츠 제작', '블로그 리뷰 요청', '이메일 뉴스레터 발송', '유튜브/팟캐스트 홍보', '할인 이벤트 기획'] },
  { id: 'monitor', label: '관리', icon: '📊', desc: '피드백·업데이트',
    tasks: ['판매 현황 모니터링', '독자 리뷰 관리', '수익 정산 확인', '개정판 계획 수립', '시리즈 기획 검토'] },
];

const AI_PROMPTS = {
  planning: (input) => `전자책 기획을 도와주세요. 주제: "${input}"\n국내 독자(교보문고, 리디북스, 예스24, 알라딘 기준)에게 어필할 수 있도록:\n1) 타겟 독자층 분석\n2) 유사 경쟁 도서 카테고리 3가지\n3) 차별화 포인트 제안\n4) 추천 장르/검색 태그 5개\n간결하고 실용적으로 답해주세요.`,
  manuscript: (input) => `아래 원고를 분석해주세요:\n"${input}"\n1) 문체 일관성 평가\n2) 가독성 개선 제안 3가지\n3) 챕터 구조 추천\n4) 전자책 분량 가이드 (국내 독자 기준)`,
  design: (input) => `전자책 메타데이터를 생성해주세요.\n책 정보: "${input}"\n1) 제목 후보 3개\n2) 부제 2개\n3) 책 소개글 (200자 내외)\n4) 검색 키워드 7개\n5) 표지 색상/분위기 제안`,
  upload: (input) => `"${input}" 전자책 플랫폼 등록 시 자주 하는 실수와 주의사항 5가지를 알려주세요.`,
  marketing: (input) => `전자책 마케팅 플랜을 만들어주세요.\n책 정보: "${input}"\n1) 인스타그램 홍보 문구 (해시태그 포함)\n2) 블로그 포스팅 제목 3개\n3) 출간 전·후 2주 SNS 일정표\n4) 독자 리뷰 요청 메시지 템플릿`,
  monitor: (input) => `전자책 출간 후 관리 전략을 알려주세요.\n현황: "${input || '출간 1개월 차'}"\n1) 판매 데이터 핵심 지표\n2) 독자 피드백 수집 방법\n3) 업데이트 주기 및 방법\n4) 시리즈/후속작 전략`,
};

const QUICK_PROMPTS = [
  '이 전자책의 타겟 독자층과 마케팅 전략을 분석해주세요.',
  '목차를 검토하고 개선점을 제안해주세요.',
  '경쟁 도서 대비 차별화 포인트를 찾아주세요.',
  '책 소개 문구를 더 매력적으로 개선해주세요.',
  '가격 책정 전략을 조언해주세요.',
];

export default function EbookPublisher() {
  const [activeStep, setActiveStep] = useState('planning');
  const [checks, setChecks] = useState({});
  const [platformChecks, setPlatformChecks] = useState({});
  const [activePlatformTab, setActivePlatformTab] = useState('kyobo');
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [bookInfo, setBookInfo] = useState({ title: '', author: '', genre: '', price: '' });

  const toggleCheck = (key) => setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  const togglePlatformCheck = (key) => setPlatformChecks(prev => ({ ...prev, [key]: !prev[key] }));

  const getStepProgress = (stepId) => {
    const step = STEPS.find(s => s.id === stepId);
    if (!step) return 0;
    const done = step.tasks.filter((_, i) => checks[`${stepId}-${i}`]).length;
    return Math.round((done / step.tasks.length) * 100);
  };

  const getPlatformProgress = (key) => {
    const items = PLATFORMS[key]?.items || [];
    const done = items.filter((_, i) => platformChecks[`${key}-${i}`]).length;
    return Math.round((done / items.length) * 100);
  };

  const overallProgress = Math.round(
    STEPS.reduce((sum, s) => sum + getStepProgress(s.id), 0) / STEPS.length
  );

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const promptFn = AI_PROMPTS[activeStep];
      const prompt = promptFn ? promptFn(aiInput) : aiInput;
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || '응답을 생성하지 못했습니다.');
    } catch {
      setAiResult('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    setAiLoading(false);
  };

  const currentStep = STEPS.find(s => s.id === activeStep);
  const p = PLATFORMS[activePlatformTab];

  const S = {
    page: { minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F2', fontFamily: "'Noto Sans KR', 'Apple SD Gothic Neo', sans-serif" },
    header: { background: '#0D0D16', borderBottom: '1px solid #252535', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, position: 'sticky', top: 0, zIndex: 100 },
    logoSub: { fontSize: 10, letterSpacing: 4, color: '#6B6B8A', textTransform: 'uppercase', marginBottom: 4 },
    logoTitle: { fontSize: 22, fontWeight: 700, color: '#fff', margin: 0 },
    progressWrap: { display: 'flex', alignItems: 'center', gap: 10 },
    progressLabel: { fontSize: 13, color: '#6B6B8A' },
    progressBar: { width: 120, height: 6, background: '#252535', borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', background: 'linear-gradient(90deg,#1A5EE8,#4A8AFF)', borderRadius: 3, transition: 'width 0.5s' },
    progressPct: { fontSize: 13, fontWeight: 700, color: '#4A8AFF' },
    layout: { display: 'flex', minHeight: 'calc(100vh - 65px)' },
    sidebar: { width: 185, flexShrink: 0, background: '#0D0D14', borderRight: '1px solid #1E1E2E', padding: '20px 10px', position: 'sticky', top: 65, height: 'calc(100vh - 65px)', overflowY: 'auto' },
    sideLabel: { fontSize: 10, letterSpacing: 3, color: '#444', textTransform: 'uppercase', padding: '0 12px', marginBottom: 14 },
    main: { flex: 1, padding: '28px 28px', overflowY: 'auto' },
    card: { background: '#12121A', border: '1px solid #252535', borderRadius: 14, padding: 20, marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: 700, marginBottom: 6 },
    sectionHint: { fontSize: 13, color: '#6B6B8A', marginBottom: 20, lineHeight: 1.6 },
    input: { width: '100%', background: '#0A0A10', border: '1px solid #252535', borderRadius: 8, color: '#E8E8F2', fontSize: 14, padding: '10px 14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' },
    textarea: { width: '100%', background: '#0A0A10', border: '1px solid #252535', borderRadius: 8, color: '#E8E8F2', fontSize: 14, padding: '12px 14px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', minHeight: 90, lineHeight: 1.7 },
    btnAI: { marginTop: 12, padding: '10px 22px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#1A5EE8,#4A8AFF)', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
    btnAIDisabled: { marginTop: 12, padding: '10px 22px', borderRadius: 8, border: 'none', background: '#222', color: '#555', fontSize: 14, fontWeight: 600, cursor: 'not-allowed', fontFamily: 'inherit' },
    aiResult: { background: '#0A1428', border: '1px solid #1A3A6E', borderRadius: 14, padding: 20, marginBottom: 20 },
    aiResultLabel: { fontSize: 10, letterSpacing: 3, color: '#4A8AFF', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' },
    aiResultText: { fontSize: 14, lineHeight: 1.9, color: '#C0D0F0', whiteSpace: 'pre-wrap' },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 },
    infoItem: { background: '#0A0A10', borderRadius: 8, padding: '10px 14px' },
    infoLabel: { fontSize: 10, color: '#555', marginBottom: 4 },
    tabRow: { display: 'flex', gap: 8, marginBottom: 18, flexWrap: 'wrap' },
    quickRow: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 },
    bookGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 },
  };

  return (
    <div style={S.page}>
      {/* Header */}
      <header style={S.header}>
        <div>
          <div style={S.logoSub}>전자책 출판 서포트 시스템</div>
          <h1 style={S.logoTitle}>📖 eBook Publisher</h1>
        </div>
        <div style={S.progressWrap}>
          <span style={S.progressLabel}>전체 진행률</span>
          <div style={S.progressBar}>
            <div style={{ ...S.progressFill, width: `${overallProgress}%` }} />
          </div>
          <span style={S.progressPct}>{overallProgress}%</span>
        </div>
      </header>

      <div style={S.layout}>
        {/* Sidebar */}
        <aside style={S.sidebar}>
          <div style={S.sideLabel}>출판 단계</div>
          {STEPS.map((step, i) => {
            const prog = getStepProgress(step.id);
            const isActive = activeStep === step.id;
            return (
              <button key={step.id} onClick={() => { setActiveStep(step.id); setAiResult(''); setAiInput(''); }}
                style={{ width: '100%', padding: '12px 12px', marginBottom: 3, borderRadius: 10, border: 'none',
                  background: isActive ? 'linear-gradient(135deg,#1A2040,#1A3060)' : 'transparent',
                  color: isActive ? '#7BAAFF' : '#555', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit' }}>
                <span style={{ fontSize: 18 }}>{step.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{i + 1}. {step.label}</div>
                  <div style={{ fontSize: 10, color: isActive ? '#4A6AAA' : '#3A3A4A', marginTop: 2 }}>{step.desc}</div>
                </div>
                {prog > 0 && (
                  <span style={{ fontSize: 10, color: isActive ? '#4A8AFF' : '#3A3A5A', fontWeight: 600 }}>{prog}%</span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main */}
        <main style={S.main}>

          {/* 책 기본 정보 */}
          <div style={S.card}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#AAB' }}>📖 책 기본 정보</div>
            <div style={S.bookGrid}>
              {[
                { key: 'title', label: '책 제목', placeholder: '전자책 제목' },
                { key: 'author', label: '저자명', placeholder: '저자명' },
                { key: 'genre', label: '장르/카테고리', placeholder: '예: 자기계발' },
                { key: 'price', label: '판매 가격', placeholder: '예: 9,900원' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <div style={{ fontSize: 11, color: '#555', marginBottom: 6 }}>{label}</div>
                  <input style={S.input} type="text" value={bookInfo[key]} placeholder={placeholder}
                    onChange={e => setBookInfo(prev => ({ ...prev, [key]: e.target.value }))} />
                </div>
              ))}
            </div>
          </div>

          {/* 단계 제목 */}
          <div style={S.sectionTitle}>{currentStep?.icon} {currentStep?.label} 단계</div>
          <div style={S.sectionHint}>{currentStep?.desc} — 체크리스트를 완료하고 AI 분석을 활용하세요.</div>

          {/* 워크플로우 체크리스트 */}
          <div style={S.card}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#AAB', marginBottom: 12 }}>
              {currentStep?.label} 체크리스트
              <span style={{ marginLeft: 10, fontSize: 12, color: '#4A8AFF' }}>{getStepProgress(activeStep)}%</span>
            </div>
            <div style={{ height: 4, background: '#1E1E2E', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${getStepProgress(activeStep)}%`, background: 'linear-gradient(90deg,#1A5EE8,#4AFFAA)', borderRadius: 2, transition: 'width 0.4s' }} />
            </div>
            {currentStep?.tasks.map((task, i) => {
              const key = `${activeStep}-${i}`;
              const done = checks[key];
              return (
                <div key={i} onClick={() => toggleCheck(key)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 6,
                    borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                    background: done ? '#1A3A1A' : '#0A0A10',
                    border: `1px solid ${done ? '#1A5A1A' : '#1E1E2E'}` }}>
                  <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${done ? '#4AFF88' : '#333'}`,
                    background: done ? '#4AFF88' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: '#000', flexShrink: 0, transition: 'all 0.2s' }}>
                    {done && '✓'}
                  </div>
                  <span style={{ fontSize: 13, color: done ? '#555' : '#CCC', textDecoration: done ? 'line-through' : 'none' }}>
                    {task}
                  </span>
                </div>
              );
            })}
          </div>

          {/* 플랫폼 등록 체크리스트 */}
          <div style={S.card}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, color: '#AAB' }}>🏪 플랫폼 등록 체크리스트</div>
            <div style={S.tabRow}>
              {Object.entries(PLATFORMS).map(([key, plat]) => (
                <button key={key} onClick={() => setActivePlatformTab(key)}
                  style={{ padding: '7px 16px', borderRadius: 8, border: `2px solid ${activePlatformTab === key ? plat.color : '#252535'}`,
                    background: activePlatformTab === key ? plat.color + '22' : 'transparent',
                    color: activePlatformTab === key ? plat.accent : '#555',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {plat.name}
                </button>
              ))}
            </div>
            {p && (
              <>
                <div style={S.infoGrid}>
                  {[['지원 포맷', p.formats], ['ISBN', p.isbn], ['검토 기간', p.days], ['수수료', p.fee]].map(([label, value]) => (
                    <div key={label} style={S.infoItem}>
                      <div style={S.infoLabel}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: p.accent }}>{value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: p.color + '14', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#999', marginBottom: 14, lineHeight: 1.6 }}>
                  💡 {p.tip}
                </div>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555', marginBottom: 6 }}>
                    <span>등록 준비 완료도</span>
                    <span style={{ color: p.accent }}>{getPlatformProgress(activePlatformTab)}%</span>
                  </div>
                  <div style={{ height: 5, background: '#1E1E2E', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${getPlatformProgress(activePlatformTab)}%`, background: `linear-gradient(90deg,${p.color},${p.accent})`, borderRadius: 3, transition: 'width 0.4s' }} />
                  </div>
                </div>
                {p.items.map((item, i) => {
                  const key = `${activePlatformTab}-${i}`;
                  const done = platformChecks[key];
                  return (
                    <div key={i} onClick={() => togglePlatformCheck(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 6,
                        borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                        background: done ? p.color + '14' : '#0A0A10',
                        border: `1px solid ${done ? p.color + '44' : '#1E1E2E'}` }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${done ? p.color : '#333'}`,
                        background: done ? p.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0, transition: 'all 0.2s' }}>
                        {done && '✓'}
                      </div>
                      <span style={{ fontSize: 13, color: done ? '#555' : '#CCC', textDecoration: done ? 'line-through' : 'none' }}>
                        {item}
                      </span>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* AI 분석 */}
          <div style={S.card}>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, color: '#AAB' }}>🤖 AI 분석</div>
            <div style={{ fontSize: 13, color: '#6B6B8A', marginBottom: 14, lineHeight: 1.6 }}>
              현재 단계({currentStep?.label})에 맞는 분석을 제공합니다. 빠른 프롬프트를 선택하거나 직접 입력하세요.
            </div>
            <div style={S.quickRow}>
              {QUICK_PROMPTS.map((prompt, i) => (
                <button key={i} onClick={() => setAiInput(prompt)}
                  style={{ fontSize: 12, background: '#0D1A3A', color: '#4A8AFF', border: '1px solid #1A3A6E',
                    padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit' }}>
                  {prompt}
                </button>
              ))}
            </div>
            <textarea style={S.textarea} value={aiInput} rows={3}
              placeholder={`현재 단계(${currentStep?.label})에서 분석할 내용을 입력하세요...`}
              onChange={e => setAiInput(e.target.value)} />
            <button onClick={handleAI} disabled={aiLoading}
              style={aiLoading ? S.btnAIDisabled : S.btnAI}>
              {aiLoading ? '⏳ AI 분석 중...' : '✨ AI 분석 시작'}
            </button>
          </div>

          {aiResult && (
            <div style={S.aiResult}>
              <div style={S.aiResultLabel}>✦ AI 분석 결과</div>
              <div style={S.aiResultText}>{aiResult}</div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
