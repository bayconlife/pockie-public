const lockQueue = new Map<string, Queue>();

class Queue {
  queue: {
    resolve: () => any;
  }[] = [];
  inProgress = false;

  enqueue(key: string) {
    return new Promise((resolve) => {
      // console.log('lock', key);

      this.queue.push({
        resolve: () => resolve(null),
      });

      this.dequeue();
    });
  }

  dequeue() {
    if (this.inProgress) {
      return;
    }

    const next = this.queue.shift();

    if (!!next) {
      this.inProgress = true;
      next.resolve();
    }
  }

  free() {
    // console.log('unlock');
    this.inProgress = false;
    this.dequeue();
  }
}

export async function createLock(serverId: number, accountId: number) {
  const key = `server-${serverId}-account-${accountId}`;

  let queue = lockQueue.get(key);

  if (!!queue) {
    await queue.enqueue(key);
  } else {
    queue = new Queue();
    lockQueue.set(key, queue);
    await queue.enqueue(key);
  }

  const timeout = setTimeout(() => {
    // console.log('Timeout trigger');
    queue?.free();
  }, 60000);

  return () => {
    clearTimeout(timeout);
    queue?.free();
  };
}
