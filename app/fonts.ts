import localFont from "next/font/local";

export const eurostileFont = localFont({
  src: [
    {
      path: "./fonts/EurostileNext/EurostileNextLTProRegular (Linotype) [2012].otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/EurostileNext/EurostileNextLTProBold (Linotype) [2012].otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/EurostileNext/EurostileNextLTProExtended (Linotype) [2012].otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/EurostileNext/EurostileNextLTProBoldExt (Linotype) [2012].otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-eurostile",
  display: "swap",
});
