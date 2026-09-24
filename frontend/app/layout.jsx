import "./globals.css";
import ClientLayout from "@/components/providers/ClientLayout";

export const metadata = {
  title: "LucidMind",
  description:
    "LucidMind helps organisations build the leadership, operating models and AI capabilities needed for the Adaptive Future. Expert advisory services for enterprise transformation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/lucidmind-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
