// Polyfill localStorage for React Native environment
const createMemoryStore = () => {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] || null,
    get length() {
      return store.size;
    }
  };
};

const g = (typeof globalThis !== 'undefined' ? globalThis : typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : {}) as any;

if (!g.localStorage) {
  g.localStorage = createMemoryStore();
}
if (typeof global !== 'undefined' && !(global as any).localStorage) {
  (global as any).localStorage = g.localStorage;
}
if (typeof window !== 'undefined' && !(window as any).localStorage) {
  (window as any).localStorage = g.localStorage;
}

// Polyfill atob and btoa for React Native environment (used by Supabase for JWT decoding)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

const customBtoa = function (input: string) {
  let str = input;
  let output = '';
  for (
    let block = 0, charCode, i = 0, map = chars;
    str.charAt(i | 0) || (map = '=', i % 1);
    output += map.charAt(63 & block >> 8 - i % 1 * 8)
  ) {
    charCode = str.charCodeAt(i += 3 / 4);
    if (charCode > 0xFF) {
      throw new Error("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
    }
    block = block << 8 | charCode;
  }
  return output;
};

const customAtob = function (input: string) {
  let str = input.replace(/=+$/, '');
  let output = '';
  if (str.length % 4 === 1) {
    throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    let bc = 0, bs = 0, buffer, i = 0;
    buffer = str.charAt(i++);
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    buffer = chars.indexOf(buffer);
  }
  return output;
};

if (!g.btoa) g.btoa = customBtoa;
if (!g.atob) g.atob = customAtob;
if (typeof global !== 'undefined') {
  if (!(global as any).btoa) (global as any).btoa = customBtoa;
  if (!(global as any).atob) (global as any).atob = customAtob;
}
if (typeof window !== 'undefined') {
  if (!(window as any).btoa) (window as any).btoa = customBtoa;
  if (!(window as any).atob) (window as any).atob = customAtob;
}

