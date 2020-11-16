/** @format */

function useSWR(key: any);
function useSWR(key: any, config?: any);
function useSWR(key: any, fn?: any, config?: any);
function useSWR(...args) {
  let key: string, fn: string, config: string;
  if (args.length >= 1) {
    key = args[0];
  } else {
  }
}
