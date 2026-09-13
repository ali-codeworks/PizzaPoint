import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;

const getFramePath = (index: number) => {
  const num = index.toString().padStart(3, "0");
  return `/frames/frame_${num}.png`;
};

const TEXT_SECTIONS = [
  {
    start: 0,
    end: 0.3,
    layout: "center",
    empty: false,
    sub: "Crafted With Passion",
    heading: "Every Slice Tells a Story",
    para: "From the first bite to the last, taste the difference real ingredients make.",
  },
  {
    start: 0.3,
    end: 0.55,
    layout: "left",
    empty: true,
    sub: "",
    heading: "",
    para: "",
  },
  {
    start: 0.55,
    end: 0.8,
    layout: "right",
    empty: true,
    sub: "",
    heading: "",
    para: "",
  },
  {
    start: 0.8,
    end: 1,
    layout: "bottom",
    empty: false,
    sub: "Hot & Fresh, Always",
    heading: "Made Fresh, Just for You",
    para: "This isn't just pizza — it's an experience worth savoring.",
  },
];

function ScrollVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const activeIndexRef = useRef(0);
  const [loaded, setLoaded] = useState(false);
  const [active, setActive] = useState(TEXT_SECTIONS[0]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    const img = imagesRef.current[index - 1];
    if (img && context && canvas && img.complete) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1280;
    canvas.height = 720;

    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let settledCount = 0;

    const settle = () => {
      settledCount++;
      if (settledCount === FRAME_COUNT) {
        setLoaded(true);
      }
    };

    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = getFramePath(i);
      img.onload = () => {
        if (i === 1) drawFrame(1);
        settle();
      };
      img.onerror = () => settle();
      images[i - 1] = img;
    }
    imagesRef.current = images;
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const wrapper = wrapperRef.current;
    const pinEl = pinRef.current;
    if (!wrapper || !pinEl) return;

    ScrollTrigger.getAll().forEach((t) => t.kill());
    window.scrollTo(0, 0);

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "bottom bottom",
      pin: pinEl,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const frame = Math.floor(self.progress * (FRAME_COUNT - 1)) + 1;
        drawFrame(frame);

        const idx = TEXT_SECTIONS.findIndex(
          (s) => self.progress >= s.start && self.progress < s.end,
        );
        const finalIdx = idx === -1 ? TEXT_SECTIONS.length - 1 : idx;

        if (finalIdx !== activeIndexRef.current) {
          activeIndexRef.current = finalIdx;
          const el = textRef.current;
          if (el) {
            gsap.to(el, {
              opacity: 0,
              y: -16,
              duration: 0.2,
              ease: "power1.in",
              onComplete: () => setActive(TEXT_SECTIONS[finalIdx]),
            });
          } else {
            setActive(TEXT_SECTIONS[finalIdx]);
          }
        }
      },
    });

    const id = setTimeout(() => ScrollTrigger.refresh(), 100);

    return () => {
      clearTimeout(id);
      trigger.kill();
    };
  }, [loaded]);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power1.out" },
    );
  }, [active]);

  const getWrapperStyle = (layout: string): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: "absolute",
      inset: 0,
      display: "flex",
      padding: "24px",
      pointerEvents: "auto",
    };

    if (layout === "left") {
      return {
        ...base,
        alignItems: "center",
        justifyContent: "flex-start",
        textAlign: "left",
        paddingLeft: "6%",
        paddingRight: "40%",
      };
    }
    if (layout === "right") {
      return {
        ...base,
        alignItems: "center",
        justifyContent: "flex-end",
        textAlign: "right",
        paddingRight: "6%",
        paddingLeft: "40%",
      };
    }
    if (layout === "bottom") {
      return {
        ...base,
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      };
    }
    return {
      ...base,
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    };
  };

  return (
    <div ref={wrapperRef} className="relative h-[400vh] bg-black">
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-black"
      >
        <canvas ref={canvasRef} className="w-full h-full object-cover" />

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            pointerEvents: "none",
          }}
        />

        {!active.empty && (
          <div ref={textRef} style={getWrapperStyle(active.layout)}>
            <div>
              <p
                style={{
                  color: "#ffb98a",
                  textTransform: "uppercase",
                  letterSpacing: "0.25em",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "12px",
                  textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                }}
              >
                {active.sub}
              </p>
              <h2
                style={{
                  color: "white",
                  fontSize: "clamp(24px, 4.5vw, 56px)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  textShadow: "0 3px 12px rgba(0,0,0,0.95)",
                }}
              >
                {active.heading}
              </h2>
              <p
                style={{
                  color: "#f0e4d8",
                  fontSize: "clamp(14px, 2vw, 18px)",
                  marginTop: "16px",
                  maxWidth: "32rem",
                  marginLeft: active.layout === "right" ? "auto" : "0",
                  marginRight: active.layout === "left" ? "auto" : "0",
                  textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                }}
              >
                {active.para}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ScrollVideo;
