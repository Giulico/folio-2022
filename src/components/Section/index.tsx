// Types
import { ReactNode } from "react";

// Hooks
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { useInView } from "react-hook-inview";

type Props = {
  children: ReactNode;
  name: string;
  threshold?: number;
  tag?: "section";
  className?: string;
  onEnter?: (entry: IntersectionObserverEntry | null) => void;
  onResize?: (entry: IntersectionObserverEntry | null) => void;
};

function Section({
  children,
  name,
  threshold = 0.5,
  tag = "section",
  className,
  onEnter,
  onResize,
}: Props) {
  const dispatch = useDispatch();
  const [ref, isVisible, entry] = useInView({
    threshold,
  });
  const appReady = useRef(false);

  useEffect(() => {
    setTimeout(() => {
      appReady.current = true;
    }, 500);
  }, []);

  useEffect(() => {
    // TODO: Waiting for all content being loaded to avoid fuoc
    if (isVisible && appReady.current) {
      dispatch.section.update(name);
      onEnter?.(entry);
    }
  }, [isVisible, dispatch]);

  const Tag = tag;

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

export default Section;
