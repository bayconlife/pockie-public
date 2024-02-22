const stack: number[] = [];

export function next() {
  const n = (stack[stack.length - 1] || 99) + 1;
  stack.push(n);
  return n;
}

export function release(n: number) {
  let idx = stack.indexOf(n);

  while (idx !== -1) {
    stack.splice(idx, 1);
    idx = stack.indexOf(n);
  }
}
