// TypeScript 6 checks side-effect imports. NativeWind's global.css is
// imported for its side effect only (app/_layout.tsx), so declare it.
declare module '*.css';
