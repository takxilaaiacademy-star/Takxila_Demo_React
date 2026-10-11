// mammoth's self-contained browser bundle (no Node built-ins), typed like the main entry.
declare module 'mammoth/mammoth.browser.min.js' {
  const mammoth: typeof import('mammoth');
  export default mammoth;
}
