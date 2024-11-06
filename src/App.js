import React, { useState, useEffect } from 'react';
import { Card, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Clock } from 'lucide-react';

// 펭귄 캐릭터 컴포넌트
const PenguinCharacter = ({ level }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -100 100 170" className="w-48 h-48">
    {/* 그림자 */}
    <ellipse cx="0" cy="70" rx="50" ry="10" fill="rgba(0,0,0,0.1)"/>
    
    {/* 몸통 */}
    <g>
      <ellipse cx="0" cy="10" rx="35" ry="45" fill="white" />
      <path d="M-35,-30 A40,50 0 0,0 -35,40 L35,40 A40,50 0 0,0 35,-30 Z" fill="#2F4F4F"/>
    </g>

    {/* 날개 */}
    <path d="M-38,-10 Q-45,20 -38,40" stroke="#2F4F4F" stroke-width="12" stroke-linecap="round"/>
    <path d="M38,-10 Q45,20 38,40" stroke="#2F4F4F" stroke-width="12" stroke-linecap="round"/>
    
    {/* 학사모 (레벨 10+) */}
    {level >= 10 && (
      <g>
        <path d="M-40,-60 L40,-60 L0,-90 Z" fill="#2F4F4F"/>
        <rect x="-45" y="-65" width="90" height="10" fill="#2F4F4F"/>
        <path d="M35,-65 Q45,-55 50,-45" stroke="#FFD700" stroke-width="2"/>
        <circle cx="50" cy="-45" r="3" fill="#FFD700"/>
      </g>
    )}
    
    {/* 머리 */}
    <circle cx="0" cy="-35" r="28" fill="#2F4F4F"/>
    
    {/* 안경 (레벨 5+) */}
    {level >= 5 && (
      <g transform="translate(0, -40)">
        <circle cx="-12" cy="0" r="10" fill="none" stroke="#FFD700" stroke-width="2"/>
        <circle cx="12" cy="0" r="10" fill="none" stroke="#FFD700" stroke-width="2"/>
        <line x1="-2" y1="0" x2="2" y2="0" stroke="#FFD700" stroke-width="2"/>
      </g>
    )}
    
    {/* 눈 */}
    <circle cx="-12" cy="-40" r="8" fill="white"/>
    <circle cx="12" cy="-40" r="8" fill="white"/>
    <circle cx="-12" cy="-40" r="4" fill="black"/>
    <circle cx="12" cy="-40" r="4" fill="black"/>
    <circle cx="-10" cy="-42" r="2" fill="white"/>
    <circle cx="14" cy="-42" r="2" fill="white"/>
    
    {/* 부리 */}
    <path d="M-8,-30 L8,-30 L0,-20 Z" fill="#FFA500"/>
    
    {/* 책 (레벨에 따라 다름) */}
    {level < 5 ? (
      <g transform="translate(0, 15)">
        <rect x="-20" y="-10" width="40" height="30" fill="#4169E1" rx="2"/>
        <rect x="-18" y="-8" width="36" height="26" fill="#F0F8FF" rx="2"/>
        <line x1="-15" y1="0" x2="15" y2="0" stroke="#4169E1" stroke-width="2"/>
        <line x1="-15" y1="5" x2="10" y2="5" stroke="#4169E1" stroke-width="2"/>
      </g>
    ) : level < 10 ? (
      <g transform="translate(0, 15)">
        <rect x="-25" y="-20" width="50" height="10" fill="#4169E1" rx="2"/>
        <rect x="-25" y="-10" width="50" height="10" fill="#6A5ACD" rx="2"/>
        <rect x="-25" y="0" width="50" height="10" fill="#483D8B" rx="2"/>
      </g>
    ) : (
      <g transform="translate(0, 15)">
        <rect x="-30" y="-25" width="60" height="35" fill="#4169E1" rx="2"/>
        <rect x="-28" y="-23" width="56" height="31" fill="#F0F8FF" rx="2"/>
        <circle cx="0" cy="-7" r="10" fill="#FFD700" opacity="0.5"/>
        <path d="M-15,0 L15,0 M-15,5 L15,5" stroke="#4169E1" stroke-width="2"/>
      </g>
    )}
    
    {/* 레벨 5+ 별 */}
    {level >= 5 && level < 10 && (
      <path d="M0,-75 L4,-63 17,-63 6,-55 10,-43 0,-50 -10,-43 -6,-55 -17,-63 -4,-63 Z" 
            fill="#FFD700" stroke="#FFA500"/>
    )}
  </svg>
);

// 메인 게임 컴포넌트 
const ReadingGame = () => {
  const [level, setLevel] = useState(1);
  const [exp, setExp] = useState(0);
  const [dailyReadings, setDailyReadings] = useState([]);
  const [readingTimer, setReadingTimer] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);

  // 레벨업에 필요한 경험치를 50으로 고정 (약 30초 읽기)
  const expToNextLevel = 50;

  // 경험치 계산 (초당 1.67 경험치)
  const calculateExp = (seconds) => Math.floor(seconds * 1.67);

  // 타이머 관리
  useEffect(() => {
    let interval;
    
    if (isReading) {
      interval = setInterval(() => {
        setReadingTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isReading]);

  // 시간 포맷팅
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // 독서 시작/종료
  const toggleReading = () => {
    if (isReading) {
      const earnedExp = calculateExp(readingTimer);
      const readingSession = {
        date: new Date(),
        duration: readingTimer,
        exp: earnedExp
      };
      
      setDailyReadings([...dailyReadings, readingSession]);
      
      // 경험치 추가 및 레벨업 처리
      const newExp = exp + earnedExp;
      const levelsGained = Math.floor(newExp / expToNextLevel);
      
      if (levelsGained > 0) {
        setLevel(prev => prev + levelsGained);
        setExp(newExp % expToNextLevel);
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      } else {
        setExp(newExp);
      }
      
      setReadingTimer(0);
    }
    setIsReading(!isReading);
  };

  // 오늘의 총 독서 시간
  const getTodaysTotalReading = () => {
    const today = new Date().toDateString();
    return dailyReadings
      .filter(reading => new Date(reading.date).toDateString() === today)
      .reduce((total, reading) => total + reading.duration, 0);
  };

  // 다음 레벨까지 남은 시간 계산 (초 단위)
  const timeToNextLevel = Math.ceil((expToNextLevel - exp) / 1.67);

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        독서 타이머
      </h1>
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-6">
            {/* 캐릭터 섹션 */}
            <div className={`relative transition-transform duration-500 ${showLevelUp ? 'scale-110' : ''}`}>
              <div className="relative">
                <PenguinCharacter level={level} />
                {/* 레벨 뱃지 */}
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold border-2 border-white">
                  {level}
                </div>
                {/* 레벨업 이펙트 */}
                {showLevelUp && (
                  <div className="absolute inset-0 animate-ping">
                    <div className="w-full h-full rounded-full border-4 border-yellow-400 opacity-75"/>
                  </div>
                )}
              </div>
            </div>

            {/* 레벨과 경험치 바 */}
            <div className="w-full">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg">Level {level}</span>
                <span className="text-sm text-gray-600">
                  EXP: {exp}/{expToNextLevel}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${(exp/expToNextLevel) * 100}%` }}
                />
              </div>
              <div className="text-sm text-gray-500 text-center mt-1">
                다음 레벨까지 약 {formatTime(timeToNextLevel)} 남음
              </div>
            </div>

            {/* 타이머 섹션 */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-2xl font-bold flex items-center gap-2">
                <Clock className="w-6 h-6" />
                {formatTime(readingTimer)}
              </div>
              <Button 
                onClick={toggleReading}
                className={`w-48 ${isReading ? 'bg-orange-300 hover:bg-orange-400' : ''}`}
              >
                {isReading ? '독서 종료' : '독서 시작'}
              </Button>
              {isReading && (
                <div className="text-sm text-gray-500">
                  현재 초당 1.67 경험치 획득 중
                </div>
              )}
            </div>

            {/* 통계 */}
            <div className="w-full grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">오늘 독서횟수</div>
                <div className="text-xl font-bold text-blue-600">
                  {dailyReadings.filter(r => 
                    new Date(r.date).toDateString() === new Date().toDateString()
                  ).length}회
                </div>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg text-center">
                <div className="text-sm text-gray-600">총 독서시간</div>
                <div className="text-xl font-bold text-pink-600">
                  {formatTime(getTodaysTotalReading())}
                </div>
              </div>
            </div>

            {/* 오늘의 기록 */}
            <div className="w-full">
              <h3 className="font-bold mb-2">오늘의 독서 기록</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {dailyReadings
                  .filter(reading => 
                    new Date(reading.date).toDateString() === new Date().toDateString()
                  )
                  .map((reading, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span>{new Date(reading.date).toLocaleTimeString()}</span>
                      <span>{formatTime(reading.duration)}</span>
                      <span className="text-blue-500">+{reading.exp} EXP</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 여기에 새로운 레벨 프리뷰 카드 추가 */}
      <Card className="w-full max-w-md mt-4">
        <CardContent className="pt-6">
          <h2 className="text-lg font-bold mb-4 text-center">레벨별 펭귄 모습</h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="transform scale-50">
                <PenguinCharacter level={1} />
              </div>
              <p className="text-sm text-gray-600">Level 1-4<br/>기본 펭귄</p>
            </div>
            <div className="text-center">
              <div className="transform scale-50">
                <PenguinCharacter level={5} />
              </div>
              <p className="text-sm text-gray-600">Level 5-9<br/>안경 쓴 펭귄</p>
            </div>
            <div className="text-center">
              <div className="transform scale-50">
                <PenguinCharacter level={10} />
              </div>
              <p className="text-sm text-gray-600">Level 10+<br/>학사모 쓴 펭귄</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadingGame;