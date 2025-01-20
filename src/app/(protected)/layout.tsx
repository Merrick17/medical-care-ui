import AuthMiddleware from '@/components/auth/auth-middleware';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthMiddleware requireAuth={true}>
      {children}
    </AuthMiddleware>
  );
} 