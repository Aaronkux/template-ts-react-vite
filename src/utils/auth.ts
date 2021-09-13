export function getTokenAUTH() {
  if (localStorage.getItem('token')) {
    return `Bearer ${localStorage.getItem('token')}`;
  }
  return null;
}
