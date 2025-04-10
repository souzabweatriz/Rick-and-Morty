export const metadata = {
  title: "Rick and Morty App",
  description: "Meu primeiro consumo de API grátis"
};
export default function RootLayout({ children }) {
  return (
    <html>
      <body>{children}</body>
    </html>
);
}
