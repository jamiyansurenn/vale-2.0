const { useEffect, useMemo, useRef, useState } = React;
const { motion, AnimatePresence, useInView } = window.framerMotion || {};

const MotionSection = motion ? motion.section : "section";
const MotionDiv = motion ? motion.div : "div";
const SafeAnimatePresence =
  AnimatePresence || (({ children }) => <>{children}</>);

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const createFloatingHearts = (count = 14) =>
  Array.from({ length: count }, (_, index) => ({
    id: `heart-${index}`,
    left: Math.floor(Math.random() * 92) + 4,
    delay: Math.random() * 6,
    size: Math.floor(Math.random() * 18) + 16,
    opacity: Math.random() * 0.35 + 0.45,
  }));

const createConfetti = (count = 36) =>
  Array.from({ length: count }, (_, index) => ({
    id: `confetti-${index}`,
    left: Math.random() * 100,
    delay: Math.random() * 0.8,
    rotation: Math.random() * 180 - 90,
    hue: Math.floor(Math.random() * 360),
  }));

const useReveal = useInView
  ? (ref) => useInView(ref, { margin: "-10% 0px", once: true })
  : (ref) => {
      const [visible, setVisible] = useState(false);

      useEffect(() => {
        if (!ref.current) return undefined;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) setVisible(true);
          },
          { threshold: 0.3 }
        );
        observer.observe(ref.current);
        return () => observer.disconnect();
      }, [ref]);

      return visible;
    };

const SoftMusic = () => {
  const [showPlayer, setShowPlayer] = useState(false);

  const youtubeId = "NXmRAQ-9Eis";
  const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&controls=0&modestbranding=1&rel=0&playsinline=1`;

  const toggleMusic = () => {
    setShowPlayer((prev) => !prev);
  };

  return (
    <div className="music-toggle">
      <button className="ghost-btn" type="button" onClick={toggleMusic}>
        {showPlayer ? "🎵 Player: On" : "🎧 Tap for YouTube music"}
      </button>
      {showPlayer && (
        <div className="music-panel">
          <p className="music-hint">Play дээр дарж хөгжмөө асаагаарай.</p>
          <iframe
            className="music-iframe"
            title="Valentine background music"
            src={embedUrl}
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
          <a
            className="music-link"
            href="https://www.youtube.com/watch?v=NXmRAQ-9Eis"
            target="_blank"
            rel="noreferrer"
          >
            YouTube дээр нээх
          </a>
        </div>
      )}
    </div>
  );
};

const TimelineItem = ({ title, subtitle, icon, note }) => {
  const itemRef = useRef(null);
  const inView = useReveal(itemRef);

  return (
    <div
      ref={itemRef}
      className={`timeline-item ${inView ? "is-visible" : ""}`}
    >
      <div className="timeline-dot">{icon}</div>
      <div className="timeline-content">
        <p className="timeline-title">{title}</p>
        <p className="timeline-subtitle">{subtitle}</p>
        <p className="timeline-note">{note}</p>
      </div>
      <div className="timeline-card" aria-hidden="true">
        <span>❤</span>
      </div>
    </div>
  );
};

const App = () => {
  const playgroundRef = useRef(null);
  const noBtnRef = useRef(null);

  const [yesScale, setYesScale] = useState(1.05);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);

  const [storyStep, setStoryStep] = useState("intro");
  const [confettiBurst, setConfettiBurst] = useState(false);

  const [mood, setMood] = useState("Romantic");
  const [emoji, setEmoji] = useState("🥹");
  const [length, setLength] = useState("Short");
  const [letter, setLetter] = useState("");
  const [copyStatus, setCopyStatus] = useState("");

  const [countdown, setCountdown] = useState(null);
  const [countdownDone, setCountdownDone] = useState(false);

  const hearts = useMemo(() => createFloatingHearts(16), []);
  const confettiPieces = useMemo(() => createConfetti(40), []);

  const moveNoButton = () => {
    const playground = playgroundRef.current;
    const noBtn = noBtnRef.current;
    if (!playground || !noBtn) return;

    const maxX = playground.clientWidth - noBtn.offsetWidth;
    const maxY = playground.clientHeight - noBtn.offsetHeight;

    const nextX = Math.random() * maxX;
    const nextY = Math.random() * maxY;

    setNoPos({
      x: clamp(nextX, 0, maxX),
      y: clamp(nextY, 0, maxY),
    });
  };

  const teaseNo = () => {
    moveNoButton();
    setNoCount((prev) => prev + 1);
    setYesScale((prev) => clamp(prev + 0.08, 1.05, 2.3));
  };

  const handleYes = () => {
    setAccepted(true);
  };

  const resetStory = () => {
    setStoryStep("intro");
    setConfettiBurst(false);
  };

  const handleStoryEnding = (step) => {
    setStoryStep(step);
    setConfettiBurst(true);
    setTimeout(() => setConfettiBurst(false), 2400);
  };

  useEffect(() => {
    moveNoButton();
    const handleResize = () => moveNoButton();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const templates = {
      Romantic: {
        short: `Чи бол миний өдөр бүрийн аз жаргал ${emoji}. Өнөө орой би чамтайгаа зүгээр л хамт алхахыг хүсэж байна.`,
        long: `Хайрт минь, ${emoji} чиний инээмсэглэл миний өдөр бүрийг гэрэлтүүлдэг. Би чамтайгаа хамт байх бүртээ тайван, дулаан мэдрэмж авдаг. Энэ Валентайнаар чамд хэлэх зүйл нэг л байна: би чамайг үнэхээр хайрлаж байна.`,
      },
      Funny: {
        short: `Чи миний Wi‑Fi шиг л хэрэгтэй ${emoji}. Сигнал тасрахад би төөрөөд явчихна.`,
        long: `Би чамайг харах болгондоо сэтгэл минь "update" хийдэг ${emoji}. Хоолны цэсэн дээрх хамгийн амттай хэсэг шиг, чиний инээмсэглэл бүхнийг гоё болгодог. Валентайнд би чамтайгаа инээж, хөгжилдөж, дахиад дахин "тийм" гэж хэлэхийг хүсэж байна.`,
      },
      Shy: {
        short: `Би жаахан ичимхий ч гэсэн… чамд дуулгах нэг зүйлтэй ${emoji}. Чи миний зүрхэнд байгаа.`,
        long: `Би үг хэлэхдээ нэг их сайн биш ч, чамтай байхад сэтгэл минь тайван байдаг ${emoji}. Чиний дэргэд өөрийнхөөрөө байж чаддаг нь миний хамгийн том бэлэг. Хэрвээ зөвшөөрвөл, энэ Валентайнаар чамтайгаа зүгээр л хамт байхыг хүсэж байна.`,
      },
    };

    const lengthKey = length === "Long" ? "long" : "short";
    const moodKey = templates[mood] ? mood : "Romantic";
    setLetter(templates[moodKey][lengthKey]);
  }, [mood, emoji, length]);

  useEffect(() => {
    const getTargetDate = () => {
      const now = new Date();
      const year = now.getFullYear();
      const target = new Date(year, 1, 14, 0, 0, 0);
      return now > target ? new Date(year + 1, 1, 14, 0, 0, 0) : target;
    };

    const target = getTargetDate();
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        setCountdownDone(true);
        setCountdown({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }
      const seconds = Math.floor(diff / 1000);
      setCountdown({
        days: Math.floor(seconds / 86400),
        hours: Math.floor((seconds % 86400) / 3600),
        minutes: Math.floor((seconds % 3600) / 60),
        seconds: seconds % 60,
      });
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyLetter = async () => {
    try {
      await navigator.clipboard.writeText(letter);
      setCopyStatus("Copied!");
    } catch (error) {
      setCopyStatus("Copy failed");
    }
    setTimeout(() => setCopyStatus(""), 1500);
  };

  const shareLetter = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Love Letter",
          text: letter,
        });
      } catch (error) {
        return;
      }
    } else {
      copyLetter();
    }
  };

  return (
    <main className={`page ${countdownDone ? "is-cracked" : ""}`}>
      <div className="floating-hearts" aria-hidden="true">
        {hearts.map((heart) => (
          <span
            key={heart.id}
            className="heart"
            style={{
              left: `${heart.left}%`,
              animationDelay: `${heart.delay}s`,
              fontSize: `${heart.size}px`,
              opacity: heart.opacity,
            }}
          >
            ❤
          </span>
        ))}
      </div>

      <header className="page-header">
        <p className="page-eyebrow">Valentine Interactive Lab</p>
        <h1>Хайрын 5 төрөлт туршлага ❤️</h1>
        <p className="page-subtitle">
          Бүгд нь нэг хуудсан дээр “КDL-ийн зүрхэнд”  байрласан.
        </p>
        <SoftMusic />
      </header>

      <div className="section-grid">
        <MotionSection
          className="feature-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="feature-header">
            <span>1️⃣</span>
            <h2>“Choose Your Ending” Valentine 💘</h2>
          </div>
          <p className="feature-note">“Надад чамд хэлэх нэг зүйл байна…”</p>

          <div className="story-box">
            <SafeAnimatePresence mode="wait">
              {storyStep === "intro" && (
                <MotionDiv
                  key="intro"
                  className="story-step"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                >
                  <p className="story-line">Надад чамд хэлэх нэг зүйл байна…</p>
                  <div className="story-actions">
                    <button className="primary-btn" onClick={() => setStoryStep("choice")}>
                      Сонголтоо үзье
                    </button>
                  </div>
                </MotionDiv>
              )}

              {storyStep === "choice" && (
                <MotionDiv
                  key="choice"
                  className="story-step"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="story-line">Хариултаа сонгоорой:</p>
                  <div className="story-actions">
                    <button className="primary-btn" onClick={() => setStoryStep("sonsyo")}>
                      Сонсъё
                    </button>
                    <button className="ghost-btn" onClick={() => handleStoryEnding("funny")}>
                      Айж байна 😳
                    </button>
                  </div>
                </MotionDiv>
              )}

              {storyStep === "sonsyo" && (
                <MotionDiv
                  key="sonsyo"
                  className="story-step"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <p className="story-line">Сонсъё гээд хэллээ… одоо ямар төгсгөлөөр явах вэ?</p>
                  <div className="story-actions">
                    <button className="primary-btn" onClick={() => handleStoryEnding("cute")}>
                      Cute ending ✨
                    </button>
                    <button className="primary-btn" onClick={() => handleStoryEnding("romantic")}>
                      Romantic ending 💖
                    </button>
                  </div>
                </MotionDiv>
              )}

              {["cute", "romantic", "funny"].includes(storyStep) && (
                <MotionDiv
                  key={storyStep}
                  className="story-step ending"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                >
                  {storyStep === "cute" && (
                    <>
                      <p className="story-title">Cute Ending</p>
                      <p className="story-line">
                        Чи инээгээд, би гараа атгаад… яг тэр мөчөөс бүх зүйл илүү дулаахан болсон 💞
                      </p>
                    </>
                  )}
                  {storyStep === "romantic" && (
                    <>
                      <p className="story-title">Romantic Ending</p>
                      <p className="story-line">
                        Би зүрхээ өглөө. Чи хүлээж авлаа. Одоо үлдэх нь хамтдаа байсан түүх 💘
                      </p>
                    </>
                  )}
                  {storyStep === "funny" && (
                    <>
                      <p className="story-title">Funny Ending</p>
                      <p className="story-line">
                        Айгаад зугтсан ч миний зүрх “ping” хийгээд л чамайг олчихлоо 😂
                      </p>
                    </>
                  )}
                  <button className="ghost-btn" onClick={resetStory}>
                    Дахин эхлүүлэх
                  </button>
                </MotionDiv>
              )}
            </SafeAnimatePresence>

            {confettiBurst && (
              <div className="confetti-layer" aria-hidden="true">
                {confettiPieces.map((piece) => (
                  <span
                    key={piece.id}
                    className="confetti"
                    style={{
                      left: `${piece.left}%`,
                      animationDelay: `${piece.delay}s`,
                      transform: `rotate(${piece.rotation}deg)`,
                      background: `hsl(${piece.hue} 80% 60%)`,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </MotionSection>

        <MotionSection
          className="feature-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="feature-header">
            <span>2️⃣</span>
            <h2>“Memory Timeline” ❤️</h2>
          </div>
          <p className="feature-note">Scroll хийх тусам түүх амилна.</p>

          <div className="timeline">
            <TimelineItem
              title="Танилцсан өдөр"
              subtitle="Анхны харц, анхны догдлол"
              note="Бидний түүх эндээс эхэлсэн."
              icon="🌸"
            />
            <TimelineItem
              title="Анхны чат"
              subtitle="“Сайн уу?” гэдэг үг"
              note="Тэр хоёрхон үг бүхнийг өөрчилсөн."
              icon="💬"
            />
            <TimelineItem
              title="Анхны инээсэн мөч"
              subtitle="Инээдээр эхэлсэн хайр"
              note="Тэр мөчөөс хойш бид үргэлж инээдэг болсон."
              icon="😄"
            />
            <div className="timeline-ending">
              <p>“Энэ бүхэн зөвхөн эхлэл байсан…”</p>
            </div>
          </div>
        </MotionSection>

        <MotionSection
          className="feature-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="feature-header">
            <span>3️⃣</span>
            <h2>Халинаа, чи KDL-ийн Валентайн болох уу? 😈</h2>
          </div>
          <p className="feature-note">NO товч зугтана. YES л ялна.</p>

          <div className="escape-zone" ref={playgroundRef}>
            <button
              className="primary-btn yes-btn"
              type="button"
              style={{ transform: `scale(${yesScale})` }}
              onClick={handleYes}
              disabled={accepted}
            >
              YES
            </button>
            {!accepted && (
              <button
                className="ghost-btn no-btn"
                ref={noBtnRef}
                type="button"
                style={{ left: `${noPos.x}px`, top: `${noPos.y}px` }}
                onMouseEnter={teaseNo}
                onClick={teaseNo}
              >
                NO
              </button>
            )}
          </div>

          <p className="escape-status">
            {accepted
              ? "❤️ Дэлгэц дүүрэн зүрх!"
              : noCount >= 4
              ? "Ямар ч байсан YES л дарах юм байна 😌"
              : "NO дээр хүрч чадах уу?"}
          </p>

          {accepted && (
            <div className="yes-overlay" aria-hidden="true">
              {hearts.map((heart) => (
                <span
                  key={`yes-${heart.id}`}
                  className="yes-heart"
                  style={{
                    left: `${heart.left}%`,
                    animationDelay: `${heart.delay}s`,
                    fontSize: `${heart.size + 8}px`,
                    opacity: heart.opacity,
                  }}
                >
                  ❤
                </span>
              ))}
            </div>
          )}
        </MotionSection>

        <MotionSection
          className="feature-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="feature-header">
            <span>4️⃣</span>
            <h2>Love Letter Generator ✍️</h2>
          </div>
          <p className="feature-note">Mood + Emoji + Length = AI маягийн захиа</p>

          <div className="generator">
            <label>
              Mood
              <select value={mood} onChange={(event) => setMood(event.target.value)}>
                <option>Romantic</option>
                <option>Funny</option>
                <option>Shy</option>
              </select>
            </label>
            <label>
              Emoji
              <select value={emoji} onChange={(event) => setEmoji(event.target.value)}>
                <option>🥹</option>
                <option>💘</option>
                <option>😂</option>
              </select>
            </label>
            <label>
              Length
              <select value={length} onChange={(event) => setLength(event.target.value)}>
                <option>Short</option>
                <option>Long</option>
              </select>
            </label>
          </div>

          <div className="letter">
            <p>{letter}</p>
          </div>
          <div className="letter-actions">
            <button className="primary-btn" onClick={copyLetter}>
              Copy
            </button>
            <button className="ghost-btn" onClick={shareLetter}>
              Share
            </button>
            {copyStatus && <span className="copy-status">{copyStatus}</span>}
          </div>
        </MotionSection>

        <MotionSection
          className="feature-card"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="feature-header">
            <span>5️⃣</span>
            <h2>Countdown to Valentine ⏳</h2>
          </div>
          <p className="feature-note">Feb 14 хүртэл countdown.</p>

          <div className="countdown">
            {countdown && (
              <div className="countdown-grid">
                <div>
                  <span>{countdown.days}</span>
                  <small>Days</small>
                </div>
                <div>
                  <span>{countdown.hours}</span>
                  <small>Hours</small>
                </div>
                <div>
                  <span>{countdown.minutes}</span>
                  <small>Minutes</small>
                </div>
                <div>
                  <span>{countdown.seconds}</span>
                  <small>Seconds</small>
                </div>
              </div>
            )}
            {countdownDone && (
              <div className="countdown-message">
                <p>Одоо би чамд үүнийг хэлэх цаг боллоо…</p>
              </div>
            )}
          </div>
          {countdownDone && <div className="screen-crack" aria-hidden="true" />}
        </MotionSection>
      </div>
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
