export function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (result) => {
        if (result instanceof Event || result instanceof Error) {
          return reject(result);
        } else {
          resolve(result);
        }
      })
    })
  }
}
