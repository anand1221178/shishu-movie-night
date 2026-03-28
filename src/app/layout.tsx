import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shishu Movie Night | BAPS Hindu Mandir",
  description:
    "Register for Shishu Movie Night - Friday 10 April. Magic show, movie, and fun for kids! Free entry. BAPS Hindu Mandir.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
