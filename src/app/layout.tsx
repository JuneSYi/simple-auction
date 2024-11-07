"use client";
import './globals.css';
import type { ReactNode } from 'react';
import '@blueprintjs/core/lib/css/blueprint.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

// "use client";
// import './globals.css';
// import type { ReactNode } from 'react';
// import '@blueprintjs/core/lib/css/blueprint.css';
// import { OverlayToaster } from '@blueprintjs/core';

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="bp3-dark">
//         <OverlayToaster position="top-right" />
//         {children}
//       </body>
//     </html>
//   );
// }