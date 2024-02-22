class EventEmitter {
  private counter = 1;
  private _registry: {
    [key: string]: {
      [id: string]: (...args: any[]) => void;
    };
  } = {};

  emit(key: string, ...args: any[]) {
    Object.keys(this._registry[key] || {}).forEach((id) => {
      this._registry[key][id]?.(...args);
    });
  }

  on(key: string, fn: (...args: any[]) => void) {
    if (!(key in this._registry)) this._registry[key] = {};

    this.counter += 1;
    const id = generateUUID();

    this._registry[key][id] = fn;

    return id;
  }

  off(id: string) {
    Object.keys(this._registry).forEach((key) => {
      if (id in this._registry[key]) {
        delete this._registry[key][id];
      }
    });
  }
}

function generateUUID() {
  // Public Domain/MIT
  var d = new Date().getTime(); //Timestamp
  var d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const Events = new EventEmitter();

export function prompt(message: string, onAccept: () => void, onDecline?: () => void) {
  Events.emit('prompt', message, onAccept, onDecline);
}

export function selectItemFromInventory(onSelect: (uid: string) => void) {
  Events.emit('selectItemFromInventory', onSelect);
}

export function display(id: string, node: React.ReactNode) {
  Events.emit('display', node, id);

  return id;
}

export function closeDisplay(id: string) {
  Events.emit('closeDisplay', id);
}

export default Events;
