/**
 * @param device_x: x coordinate of cursor on device
 * @param device_y: y coordinate of cursor on device
 * @param element: HTMLElement
 * @returns: whether or not cursor is in box
 */
export function isInBox(device_x: number, device_y: number, element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const top = rect.top;
  const left = rect.left;
  const width = rect.width;
  const height = rect.height;
  const _device_x = device_x / window.devicePixelRatio;
  const _device_y = device_y / window.devicePixelRatio;

  return _device_x >= left
    && _device_x <= left + width
    && _device_y >= top
    && _device_y <= top + height;
}
