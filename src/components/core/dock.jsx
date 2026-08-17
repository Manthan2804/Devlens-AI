"use client";

import React, {
  Children,
  cloneElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Dock — a motion-primitives-style macOS dock: icons magnify based    */
/*  on distance from the cursor, with a tooltip label on hover.         */
/*                                                                      */
/*  Usage:                                                              */
/*    <Dock>                                                            */
/*      <DockItem>                                                      */
/*        <DockLabel>Home</DockLabel>                                   */
/*        <DockIcon><HomeIcon /></DockIcon>                             */
/*      </DockItem>                                                     */
/*    </Dock>                                                           */
/* ------------------------------------------------------------------ */

function cx(...parts) {
  return parts.filter(Boolean).join(" ");
}

const DockContext = createContext(null);
const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;
const DEFAULT_PANEL_HEIGHT = 64;

function useDock() {
  const ctx = useContext(DockContext);
  if (!ctx) throw new Error("Dock sub-components must be used inside <Dock>");
  return ctx;
}

export function Dock({
  children,
  className,
  style,
  distance = DEFAULT_DISTANCE,
  panelHeight = DEFAULT_PANEL_HEIGHT,
  magnification = DEFAULT_MAGNIFICATION,
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);
  const maxHeight = Math.max(panelHeight, magnification + magnification / 2 + 4);
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div style={{ height, scrollbarWidth: "none" }} className="mx-2 flex max-w-full items-end overflow-x-auto">
      <motion.div
        onMouseMove={(e) => {
          isHovered.set(1);
          mouseX.set(e.pageX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={cx("mx-auto flex w-fit items-end gap-4 rounded-2xl px-4", className)}
        style={{ height: panelHeight, ...style }}
        role="toolbar"
      >
        <DockContext.Provider value={{ mouseX, spring, distance, magnification }}>
          {children}
        </DockContext.Provider>
      </motion.div>
    </motion.div>
  );
}

export function DockItem({ children, className, style, onClick, active }) {
  const ref = useRef(null);
  const { distance, magnification, mouseX, spring } = useDock();
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(mouseDistance, [-distance, 0, distance], [40, magnification, 40]);
  const width = useSpring(widthTransform, spring);

  return (
    <motion.button
      ref={ref}
      style={{ width, ...style }}
      onClick={onClick}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      className={cx("relative inline-flex aspect-square items-center justify-center rounded-full", className)}
      tabIndex={0}
    >
      {Children.map(children, (child) => cloneElement(child, { width, isHovered, active }))}
    </motion.button>
  );
}

export function DockLabel({ children, className, style, isHovered }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return;
    const unsub = isHovered.on("change", (latest) => setVisible(latest === 1));
    return () => unsub();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={cx("absolute -top-7 left-1/2 w-fit whitespace-pre rounded-md px-2 py-1 text-xs", className)}
          style={{ x: "-50%", ...style }}
          role="tooltip"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DockIcon({ children, className, width }) {
  const widthTransform = useTransform(width, (val) => val / 2);
  return (
    <motion.div style={{ width: widthTransform }} className={cx("flex items-center justify-center", className)}>
      {children}
    </motion.div>
  );
}

export default Dock;