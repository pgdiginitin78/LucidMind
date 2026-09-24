"use client";
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { SplitText as GSAPSplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(GSAPSplitText, useGSAP);

const SplitText = ({
  text,
  children,
  className = '',
  delay = 20,
  duration = 0.9,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 30 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '0px',
  textAlign = 'left',
  tag = 'h1',
  onLetterAnimationComplete
}) => {
  const ref = useRef(null);
  const onCompleteRef = useRef(onLetterAnimationComplete);

  useEffect(() => {
    onCompleteRef.current = onLetterAnimationComplete;
  }, [onLetterAnimationComplete]);

  useGSAP(
    () => {
      if (!ref.current || (!text && !children)) return;
      const el = ref.current;

      if (el._rbsplitInstance) {
        try {
          el._rbsplitInstance.revert();
        } catch {}
        el._rbsplitInstance = null;
      }

      const startPct = (1 - threshold) * 100;
      const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
      const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
      const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
      const sign =
        marginValue === 0
          ? ''
          : marginValue < 0
            ? `-=${Math.abs(marginValue)}${marginUnit}`
            : `+=${marginValue}${marginUnit}`;
      const start = `top ${startPct}%${sign}`;

      let targets;
      const assignTargets = self => {
        if (splitType.includes('chars') && self.chars.length) targets = self.chars;
        if (!targets && splitType.includes('words') && self.words.length) targets = self.words;
        if (!targets && splitType.includes('lines') && self.lines.length) targets = self.lines;
        if (!targets) targets = self.chars || self.words || self.lines;
      };

      let splitInstance = null;
      let tween = null;
      
      const initGSAP = () => {
        if (!el || !el.parentNode) return;

        splitInstance = new GSAPSplitText(el, {
          type: splitType,
          smartWrap: true,
          autoSplit: splitType === 'lines',
          linesClass: 'split-line',
          wordsClass: 'split-word',
          charsClass: 'split-char',
          reduceWhiteSpace: false,
          onSplit: self => {
            assignTargets(self);
            if (!targets || !targets.length) return;

            tween = gsap.from(targets, {
              ...from,
              duration,
              ease,
              stagger: (delay || 20) / 1000,
              immediateRender: false, paused: true,
              
              onComplete: () => {
                onCompleteRef.current?.();
              },
              willChange: 'transform, opacity',
              force3D: true,
            });

            const io = new IntersectionObserver((entries) => {
              if(entries[0].isIntersecting) {
                tween.play();
                io.disconnect();
              }
            }, { threshold: 0.1 });
            io.observe(el);
            el._rbIo = io;
          }
        });

        el._rbsplitInstance = splitInstance;
      };

      // Delay initialization to avoid blocking first paint (LCP optimization)
      const timeoutId = setTimeout(initGSAP, 10);

      return () => {
        clearTimeout(timeoutId);
        if (tween) tween.kill();
        if (el && el._rbIo) { el._rbIo.disconnect(); el._rbIo = null; }
        if (el && el.parentNode && el._rbsplitInstance) {
          try {
            el._rbsplitInstance.revert();
          } catch {}
        }
        if (el) el._rbsplitInstance = null;
      };
    },
    {
      dependencies: [
        text,
        children,
        delay,
        duration,
        ease,
        splitType,
        JSON.stringify(from),
        JSON.stringify(to),
        threshold,
        rootMargin,
      ],
      scope: ref
    }
  );

  const style = {
    textAlign,
    overflow: 'visible',
    display: 'inline-block',
    whiteSpace: 'normal',
    wordWrap: 'break-word',
    opacity: 1,
    visibility: 'visible',
  };
  const classes = `split-parent ${className}`;
  const Tag = tag || 'p';

  return (
    <Tag ref={ref} style={style} className={classes}>
      {children || text}
    </Tag>
  );
};

export default SplitText;
