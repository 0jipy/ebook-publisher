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
  {
    id: 'planning', label: '기획', icon: '💡', desc: '주제·타겟·시장분석',
    hint: '책의 주제와 타겟 독자를 명확히 하고 시장을 분석하세요.',
    tasks: ['주제 및 타겟 독자 설정', '경쟁 도서 리서치', '목차 초안 작성', '출판 일정 수립', '수익 모델 결정'],
    aiPlaceholder: "예: '30대 직장인을 위한 재테크 입문서'",
    aiPrompt: (v) => `전자책 기획을 도와주세요. 주제: "${v}"\n국내 독자(교보문고, 리디북스, 예스24, 알라딘)에 맞게:\n1) 타겟 독자층 분석\n2) 유사 경쟁 도서 카테고리 3가지\n3) 차별화 포인트 제안\n4) 추천 검색 태그 5개\n간결하고 실용적으로 답해주세요.`,
  },
  {
    id: 'manuscript', label: '원고', icon: '✍️', desc: '교정·구조·가독성',
    hint: '원고 일부를 붙여넣으면 문체, 구조, 가독성을 분석해드립니다.',
    tasks: ['챕터별 초안 작성', '참고 자료 정리', '이미지/도표 준비', '원고 분량 확인', '초안 완성'],
    aiPlaceholder: '원고 일부를 붙여넣으세요 (첫 단락 또는 챕터 도입부 권장)',
    aiPrompt: (v) => `아래 원고를 분석해주세요:\n"${v}"\n1) 문체 일관성 평가\n2) 가독성 개선 제안 3가지\n3) 챕터 구조 추천\n4) 전자책 적정 분량 가이드`,
  },
  {
    id: 'design', label: '편집·표지', icon: '🎨', desc: '메타데이터·포맷',
    hint: '책 정보를 입력하면 제목 후보, 소개글, 키워드를 자동 생성합니다.',
    tasks: ['문법/맞춤법 교정', '내용 구성 재검토', '이미지 최적화', 'ePub/PDF 변환', '표지 디자인 완성'],
    aiPlaceholder: "예: '제목: 나의 첫 부업 / 장르: 자기계발 / 내용 요약'",
    aiPrompt: (v) => `전자책 메타데이터를 생성해주세요.\n책 정보: "${v}"\n1) 제목 후보 3개\n2) 부제 2개\n3) 책 소개글 200자\n4) 검색 키워드 7개\n5) 표지 분위기 제안`,
  },
  {
    id: 'upload', label: '플랫폼 등록', icon: '📤', desc: '플랫폼별 체크리스트',
    hint: '헤더에서 플랫폼을 선택하면 해당 플랫폼의 등록 체크리스트가 표시됩니다.',
    tasks: ['교보문고 등록 완료', '리디북스 등록 완료', '예스24 등록 완료', '알라딘 등록 완료', '가격 책정 완료'],
    aiPlaceholder: "예: '교보문고' — 등록 시 주의사항을 알려드립니다.",
    aiPrompt: (v) => `"${v}" 전자책 플랫폼 등록 시 자주 하는 실수와 주의사항 5가지를 알려주세요.`,
  },
  {
    id: 'marketing', label: '마케팅', icon: '📣', desc: '홍보·SNS·일정',
    hint: '책 정보를 입력하면 SNS 문구, 블로그 제목, 2주 홍보 일정을 생성합니다.',
    tasks: ['SNS 홍보 콘텐츠 제작', '블로그 리뷰 요청', '이메일 뉴스레터 발송', '유튜브/팟캐스트 홍보', '할인 이벤트 기획'],
    aiPlaceholder: "예: '책 제목: 나의 첫 부업 / 타겟: 20~30대 직장인 / 출간일: 3월 1일'",
    aiPrompt: (v) => `전자책 마케팅 플랜을 만들어주세요.\n책 정보: "${v}"\n1) 인스타그램 홍보 문구 (해시태그 포함)\n2) 블로그 포스팅 제목 3개\n3) 출간 전·후 2주 SNS 일정표\n4) 독자 리뷰 요청 메시지 템플릿`,
  },
  {
    id: 'monitor', label: '관리', icon: '📊', desc: '피드백·업데이트',
    hint: '출간 후 현황을 입력하면 판매 전략과 업데이트 방향을 제안합니다.',
    tasks: ['판매 현황 모니터링', '독자 리뷰 관리', '수익 정산 확인', '개정판 계획 수립', '시리즈 기획 검토'],
    aiPlaceholder: "예: '출간 1개월, 교보 30권, 리디 20권, 리뷰 5개, 평점 4.2'",
    aiPrompt: (v) => `전자책 출간 후 관리 전략을 알려주세요.\n현황: "${v || '출간 1개월 차'}"\n1) 판매 데이터 핵심 지표\n2) 독자 피드백 수집 방법\n3) 업데이트 주기 및 방법\n4) 시리즈/후속작 전략`,
  },
];

export default function EbookPublisher() {
  const [activeStep, setActiveStep] = useState('planning');
  const [activePlatform, setActivePlatform] = useState('kyobo');
  const [stepChecks, setStepChecks] = useState({});
  const [platformChecks, setPlatformChecks] = useState({});
  const [aiInput, setAiInput] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const toggleStepCheck = (key) => setStepChecks(p => ({ ...p, [key]: !p[key] }));
  const togglePlatformCheck = (key) => setPlatformChecks(p => ({ ...p, [key]: !p[key] }));

  const getStepProgress = (id) => {
    const s = STEPS.find(s => s.id === id);
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
    STEPS.reduce((sum, s) => sum + getStepProgress(s.id), 0) / STEPS.length
  );

  const handleAI = async () => {
    if (!aiInput.trim()) return;
    setAiLoading(true);
    setAiResult('');
    try {
      const step = STEPS.find(s => s.id === activeStep);
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: step.aiPrompt(aiInput) }]
        })
      });
      const data = await res.json();
      setAiResult(data.content?.[0]?.text || '응답을 생성하지 못했습니다.');
    } catch {
      setAiResult('오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
    setAiLoading(false);
  };

  const cur = STEPS.find(s => s.id === activeStep);
  const p = PLATFORMS[activePlatform];

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F', color: '#E8E8F2', fontFamily: "'Noto Sans KR','Apple SD Gothic Neo',sans-serif" }}>

      {/* ── 헤더: 로고 | 플랫폼 버튼들 | 전체 진행률 ── */}
      <header style={{ background: '#0D0D16', borderBottom: '1px solid #252535', padding: '14px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>

        {/* 로고 */}
        <div>
          <div style={{ fontSize: 10, letterSpacing: 4, color: '#6B6B8A', textTransform: 'uppercase', marginBottom: 3 }}>전자책 출판 서포트 시스템</div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff' }}>📖 eBook Publisher</h1>
        </div>

        {/* 플랫폼 버튼 + 전체 진행률 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>

          {/* 플랫폼 선택 버튼 */}
          <div style={{ display: 'flex', gap: 7 }}>
            {Object.entries(PLATFORMS).map(([key, plat]) => {
              const isActive = activePlatform === key;
              return (
                <button key={key} onClick={() => setActivePlatform(key)}
                  style={{
                    padding: '5px 14px', borderRadius: 20,
                    border: `2px solid ${isActive ? plat.color : '#252535'}`,
                    background: isActive ? plat.color + '22' : 'transparent',
                    color: isActive ? plat.accent : '#555',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                  }}>
                  {plat.name}
                </button>
              );
            })}
          </div>

          {/* 전체 진행률 — 맨 우측 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#6B6B8A' }}>전체 진행률</span>
            <div style={{ width: 100, height: 5, background: '#252535', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overallProgress}%`, background: 'linear-gradient(90deg,#1A5EE8,#4A8AFF)', borderRadius: 3, transition: 'width 0.5s' }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#4A8AFF', minWidth: 32 }}>{overallProgress}%</span>
          </div>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 65px)' }}>

        {/* ── 사이드바 ── */}
        <aside style={{ width: 180, flexShrink: 0, background: '#0D0D14', borderRight: '1px solid #1E1E2E', padding: '20px 10px', position: 'sticky', top: 65, height: 'calc(100vh - 65px)', overflowY: 'auto' }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: '#3A3A4A', textTransform: 'uppercase', padding: '0 12px', marginBottom: 14 }}>출판 단계</div>
          {STEPS.map((step, i) => {
            const prog = getStepProgress(step.id);
            const isActive = activeStep === step.id;
            return (
              <button key={step.id}
                onClick={() => { setActiveStep(step.id); setAiResult(''); setAiInput(''); }}
                style={{
                  width: '100%', padding: '12px 12px', marginBottom: 3, borderRadius: 10, border: 'none',
                  background: isActive ? 'linear-gradient(135deg,#1A2040,#1A3060)' : 'transparent',
                  color: isActive ? '#7BAAFF' : '#555', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: 9, fontFamily: 'inherit'
                }}>
                <span style={{ fontSize: 17 }}>{step.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{i + 1}. {step.label}</div>
                  <div style={{ fontSize: 10, color: isActive ? '#4A6AAA' : '#3A3A4A', marginTop: 2 }}>{step.desc}</div>
                </div>
                {prog > 0 && <span style={{ fontSize: 10, color: '#4A8AFF', fontWeight: 700 }}>{prog}%</span>}
              </button>
            );
          })}
        </aside>

        {/* ── 메인: 탭별 내용만 표시 ── */}
        <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>

          {/* 단계 제목 */}
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 5 }}>{cur?.icon} {cur?.label} 단계</div>
          <div style={{ fontSize: 13, color: '#6B6B8A', marginBottom: 22, lineHeight: 1.6 }}>{cur?.hint}</div>

          {/* ── 기획 / 원고 / 편집 / 마케팅 / 관리 탭: AI 입력 + 체크리스트 ── */}
          {activeStep !== 'upload' && (
            <>
              {/* AI 분석 박스 */}
              <div style={{ background: '#12121A', border: '1px solid #252535', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#7A7A9A', marginBottom: 12 }}>🤖 AI 분석 — {cur?.label} 단계</div>
                <textarea value={aiInput} rows={4}
                  placeholder={cur?.aiPlaceholder}
                  onChange={e => setAiInput(e.target.value)}
                  style={{ width: '100%', background: '#0A0A10', border: '1px solid #252535', borderRadius: 8, color: '#E8E8F2', fontSize: 13, padding: '11px 13px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.7, minHeight: 90 }} />
                <button onClick={handleAI} disabled={aiLoading}
                  style={{ marginTop: 10, padding: '10px 22px', borderRadius: 8, border: 'none', background: aiLoading ? '#222' : 'linear-gradient(135deg,#1A5EE8,#4A8AFF)', color: aiLoading ? '#555' : '#fff', fontSize: 13, fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {aiLoading ? '⏳ 분석 중...' : '✨ AI 분석 시작'}
                </button>
              </div>

              {/* AI 결과 */}
              {aiResult && (
                <div style={{ background: '#0A1428', border: '1px solid #1A3A6E', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                  <div style={{ fontSize: 10, letterSpacing: 3, color: '#4A8AFF', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase' }}>✦ AI 분석 결과</div>
                  <div style={{ fontSize: 14, lineHeight: 1.9, color: '#C0D0F0', whiteSpace: 'pre-wrap' }}>{aiResult}</div>
                </div>
              )}

              {/* 단계별 체크리스트 */}
              <div style={{ background: '#12121A', border: '1px solid #252535', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#7A7A9A' }}>{cur?.label} 체크리스트</span>
                  <span style={{ fontSize: 12, color: '#4A8AFF', fontWeight: 700 }}>{getStepProgress(activeStep)}%</span>
                </div>
                <div style={{ height: 4, background: '#1E1E2E', borderRadius: 2, marginBottom: 16, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${getStepProgress(activeStep)}%`, background: 'linear-gradient(90deg,#1A5EE8,#4AFFAA)', borderRadius: 2, transition: 'width 0.4s' }} />
                </div>
                {cur?.tasks.map((task, i) => {
                  const key = `${activeStep}-${i}`;
                  const done = stepChecks[key];
                  return (
                    <div key={i} onClick={() => toggleStepCheck(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 6, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', background: done ? '#0F2A0F' : '#0A0A10', border: `1px solid ${done ? '#1A5A1A' : '#1E1E2E'}` }}>
                      <div style={{ width: 20, height: 20, borderRadius: 10, border: `2px solid ${done ? '#4AFF88' : '#333'}`, background: done ? '#4AFF88' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#000', flexShrink: 0, transition: 'all 0.2s' }}>
                        {done && '✓'}
                      </div>
                      <span style={{ fontSize: 13, color: done ? '#555' : '#CCC', textDecoration: done ? 'line-through' : 'none' }}>{task}</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* ── 플랫폼 등록 탭: 선택한 플랫폼 체크리스트 ── */}
          {activeStep === 'upload' && (
            <>
              {/* 플랫폼 탭 버튼 */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {Object.entries(PLATFORMS).map(([key, plat]) => {
                  const isActive = activePlatform === key;
                  return (
                    <button key={key} onClick={() => setActivePlatform(key)}
                      style={{ padding: '8px 20px', borderRadius: 8, border: `2px solid ${isActive ? plat.color : '#252535'}`, background: isActive ? plat.color + '22' : 'transparent', color: isActive ? plat.accent : '#555', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                      {plat.name}
                    </button>
                  );
                })}
              </div>

              {/* 선택 플랫폼 정보 카드 */}
              <div style={{ background: '#12121A', border: `1px solid ${p.color}44`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: p.accent, marginBottom: 16 }}>🏪 {p.name} 등록 체크리스트</div>

                {/* 4칸 정보 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 14 }}>
                  {[['지원 포맷', p.formats], ['ISBN', p.isbn], ['검토 기간', p.days], ['수수료', p.fee]].map(([label, value]) => (
                    <div key={label} style={{ background: '#0A0A10', borderRadius: 8, padding: '9px 13px' }}>
                      <div style={{ fontSize: 10, color: '#555', marginBottom: 4 }}>{label}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: p.accent }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* 팁 */}
                <div style={{ background: p.color + '12', borderRadius: 8, padding: '9px 13px', fontSize: 12, color: '#999', marginBottom: 14, lineHeight: 1.6 }}>
                  💡 {p.tip}
                </div>

                {/* 진행률 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555', marginBottom: 6 }}>
                  <span>등록 준비 완료도</span>
                  <span style={{ color: p.accent }}>{getPlatformProgress(activePlatform)}%</span>
                </div>
                <div style={{ height: 5, background: '#1E1E2E', borderRadius: 3, marginBottom: 14, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${getPlatformProgress(activePlatform)}%`, background: `linear-gradient(90deg,${p.color},${p.accent})`, borderRadius: 3, transition: 'width 0.4s' }} />
                </div>

                {/* 체크리스트 항목 */}
                {p.items.map((item, i) => {
                  const key = `${activePlatform}-${i}`;
                  const done = platformChecks[key];
                  return (
                    <div key={i} onClick={() => togglePlatformCheck(key)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', marginBottom: 6, borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s', background: done ? p.color + '14' : '#0A0A10', border: `1px solid ${done ? p.color + '55' : '#1E1E2E'}` }}>
                      <div style={{ width: 20, height: 20, borderRadius: 4, border: `2px solid ${done ? p.color : '#333'}`, background: done ? p.color : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0, transition: 'all 0.2s' }}>
                        {done && '✓'}
                      </div>
                      <span style={{ fontSize: 13, color: done ? '#555' : '#CCC', textDecoration: done ? 'line-through' : 'none' }}>{item}</span>
                    </div>
                  );
                })}
              </div>

              {/* AI 주의사항 */}
              <div style={{ background: '#12121A', border: '1px solid #252535', borderRadius: 14, padding: 20, marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#7A7A9A', marginBottom: 12 }}>🤖 플랫폼 등록 주의사항 AI 조회</div>
                <textarea value={aiInput} rows={2}
                  placeholder={cur?.aiPlaceholder}
                  onChange={e => setAiInput(e.target.value)}
                  style={{ width: '100%', background: '#0A0A10', border: '1px solid #252535', borderRadius: 8, color: '#E8E8F2', fontSize: 13, padding: '11px 13px', resize: 'vertical', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', lineHeight: 1.7 }} />
                <button onClick={handleAI} disabled={aiLoading}
                  style={{ marginTop: 10, padding: '10px 22px', borderRadius: 8, border: 'none', background: aiLoading ? '#222' : 'linear-gradient(135deg,#1A5EE8,#4A8AFF)', color: aiLoading ? '#555' : '#fff', fontSize: 13, fontWeight: 600, cursor: aiLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                  {aiLoading ? '⏳ 조회 중...' : '✨ 주의사항 확인'}
                </button>
                {aiResult && (
                  <div style={{ marginTop: 16, background: '#0A1428', border: '1px solid #1A3A6E', borderRadius: 10, padding: 16 }}>
                    <div style={{ fontSize: 10, letterSpacing: 3, color: '#4A8AFF', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase' }}>✦ AI 안내</div>
                    <div style={{ fontSize: 14, lineHeight: 1.9, color: '#C0D0F0', whiteSpace: 'pre-wrap' }}>{aiResult}</div>
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
