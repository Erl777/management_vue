type Callback<T> = (
  result: T | null,
  error: DOMException | null
) => void;

export const promisify = <TArgs extends unknown[], TResult>(
  fn: (...args: [...TArgs, Callback<TResult>]) => void
) => {
  return (...args: TArgs): Promise<TResult> => {
    return new Promise((resolve, reject) => {
      fn(
        ...args,
        (
          result: TResult | null,
          error: DOMException | null
        ) => {
          if (error) {
            reject(error);
          } else if (result === null) {
            reject(new Error('Operation for db failed'));
          } else {
            resolve(result);
          }
        }
      );
    });
  };
};
