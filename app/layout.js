import styles from "./globals.css"

export const metadata = {
  title: "Rick and Morty App",
  description: "Meu primeiro consumo de API grátis"
};
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <link rel="icon" href="./rick.png" />
      </head>
      <body>{children}</body>
    </html>
);
}
