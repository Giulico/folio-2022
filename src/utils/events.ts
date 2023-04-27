type Cursor = { x: number; y: number }

export const cursorPosition = (
  e: (MouseEvent | TouchEvent) & { originalEvent?: TouchEvent }
): Cursor => {
  const cursor: Cursor = { x: 0, y: 0 }
  if (
    e.type == 'touchstart' ||
    e.type == 'touchmove' ||
    e.type == 'touchend' ||
    e.type == 'touchcancel'
  ) {
    const original = e.originalEvent
    const evt = (typeof original === 'undefined' ? e : original) as TouchEvent
    const touch = evt.touches[0] || evt.changedTouches[0]
    cursor.x = touch.clientX
    cursor.y = touch.clientY
  } else if (
    e.type == 'mousedown' ||
    e.type == 'mouseup' ||
    e.type == 'mousemove' ||
    e.type == 'mouseover' ||
    e.type == 'mouseout' ||
    e.type == 'mouseenter' ||
    e.type == 'mouseleave'
  ) {
    const evt = e as MouseEvent
    cursor.x = evt.clientX
    cursor.y = evt.clientY
  }
  return cursor
}
