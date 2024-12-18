// components/ClientStyledWrapper.tsx
"use client";
export default function ClientStyledWrapper({ children, theme }) {
  return (
    <div style={{
      backgroundColor: theme.colors.background,
      color: theme.colors.text,
      fontFamily: theme.fonts.body
    }}>
      <style jsx global>{`
        .font-heading {
          font-family: ${theme.fonts.heading}, system-ui;
        }
        .text-primary {
          color: ${theme.colors.primary};
        }
        .bg-primary {
          background-color: ${theme.colors.primary};
        }
        .text-secondary {
          color: ${theme.colors.secondary};
        }
        .bg-secondary {
          background-color: ${theme.colors.secondary};
        }
        .text-accent {
          color: ${theme.colors.accent};
        }
        .bg-accent {
          background-color: ${theme.colors.accent};
        }
      `}</style>
      {children}
    </div>
  );
}