import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

import Providers from '../components/Providers';

export const metadata = {
  title: 'Netflix Clone',
  description: 'A Netflix clone built with Next.js and React.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}