import "./globals.css";
import AdminChatButton from "./AdminChatButton";

export const metadata = {
  title: "Daryanto Bot - Member Area",
  description: "Member area & admin panel Daryanto Bot",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        {children}
        <AdminChatButton />
      </body>
    </html>
  );
}
