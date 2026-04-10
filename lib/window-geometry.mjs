export function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

export function getViewportBounds({
  width,
  height,
  menuBarHeight,
  dockSpace,
  windowGap,
}) {
  return {
    maxWidth: width - windowGap * 2,
    maxHeight: height - menuBarHeight - dockSpace - windowGap * 2,
    minTop: menuBarHeight + windowGap,
    minLeft: windowGap,
    maxTop: (windowHeight) => height - dockSpace - windowHeight - windowGap,
    maxLeft: (windowWidth) => width - windowWidth - windowGap,
  };
}

export function getMaximizedFrame({
  width,
  height,
  menuBarHeight,
  dockSpace,
  windowGap,
}) {
  return {
    top: menuBarHeight + windowGap,
    left: windowGap,
    width: Math.max(width - windowGap * 2, 0),
    height: Math.max(height - menuBarHeight - dockSpace - windowGap * 2, 0),
  };
}

export function getDockReserveSpace(viewportWidth) {
  return viewportWidth < 640 ? 110 : 130;
}

export function detectSnapZone(point, { width, menuBarHeight, snapThreshold }) {
  if (point.y < menuBarHeight + snapThreshold) return 'top';
  if (point.x < snapThreshold) return 'left';
  if (point.x > width - snapThreshold) return 'right';
  return null;
}

export function computeResizeFrame({
  handle,
  pointer,
  startPointer,
  startFrame,
  viewport,
}) {
  const deltaX = pointer.x - startPointer.x;
  const deltaY = pointer.y - startPointer.y;

  let width = startFrame.width;
  let height = startFrame.height;
  let top = startFrame.top;
  let left = startFrame.left;

  if (handle.includes('right')) {
    width = clamp(
      startFrame.width + deltaX,
      viewport.minWidth,
      viewport.width - left
    );
  }

  if (handle.includes('left')) {
    left = clamp(
      startFrame.left + deltaX,
      0,
      startFrame.left + startFrame.width - viewport.minWidth
    );
    width = startFrame.width + (startFrame.left - left);
  }

  if (handle.includes('bottom')) {
    height = clamp(
      startFrame.height + deltaY,
      viewport.minHeight,
      viewport.height - viewport.dockSpace - top
    );
  }

  if (handle.includes('top')) {
    top = clamp(
      startFrame.top + deltaY,
      viewport.menuBarHeight + (viewport.windowGap ?? 0),
      startFrame.top + startFrame.height - viewport.minHeight
    );
    height = startFrame.height + (startFrame.top - top);
  }

  return { width, height, top, left };
}
