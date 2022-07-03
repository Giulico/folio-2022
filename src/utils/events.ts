export const cursorPosition = (e: any) => {
  const cursor = { x: 0, y: 0 };
  if (
    e.type == "touchstart" ||
    e.type == "touchmove" ||
    e.type == "touchend" ||
    e.type == "touchcancel"
  ) {
    const evt = typeof e.originalEvent === "undefined" ? e : e.originalEvent;
    const touch = evt.touches[0] || evt.changedTouches[0];
    cursor.x = touch.pageX;
    cursor.y = touch.pageY;
  } else if (
    e.type == "mousedown" ||
    e.type == "mouseup" ||
    e.type == "mousemove" ||
    e.type == "mouseover" ||
    e.type == "mouseout" ||
    e.type == "mouseenter" ||
    e.type == "mouseleave"
  ) {
    cursor.x = e.clientX;
    cursor.y = e.clientY;
  }
  return cursor;
};
