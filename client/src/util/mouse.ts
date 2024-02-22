export function preventClicks(e: React.MouseEvent) {
  e.preventDefault();
  e.stopPropagation();
}
