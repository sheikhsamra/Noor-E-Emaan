import useInView from "../hooks/useInView";

/**
 * variant: "fadeUp" | "fadeLeft" | "fadeRight" | "fadeIn" | "scaleUp"
 * delay: tailwind delay class e.g. "delay-100"
 */
export default function AnimateOnScroll({ children, variant = "fadeUp", delay = "", className = "" }) {
  const [ref, inView] = useInView();

  const base = "transition-all duration-700 ease-out";

  const hidden = {
    fadeUp:    "opacity-0 translate-y-10",
    fadeLeft:  "opacity-0 -translate-x-10",
    fadeRight: "opacity-0 translate-x-10",
    fadeIn:    "opacity-0",
    scaleUp:   "opacity-0 scale-95",
  }[variant] ?? "opacity-0 translate-y-10";

  return (
    <div
      ref={ref}
      className={`${base} ${delay} ${inView ? "opacity-100 translate-y-0 translate-x-0 scale-100" : hidden} ${className}`}
    >
      {children}
    </div>
  );
}
