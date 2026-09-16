import "./globals.css";
import ClientLayout from "@/components/providers/ClientLayout";

export const metadata = {
  title: "LucidMind",
  description: "LucidMind helps organisations build the leadership, operating models and AI capabilities needed for the AI era. Expert advisory services for enterprise transformation.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/lucidmind-icon.png" />
      </head>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
