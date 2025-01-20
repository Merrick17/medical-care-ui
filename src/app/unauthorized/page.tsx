"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import useStore from "@/store";
import { useEffect } from "react";

const UnauthorizedPage = () => {
  const router = useRouter();
  const { user } = useStore();

  useEffect(() => {
    // If user is logged in, redirect to their dashboard
    if (user) {
      const redirectPath = `/${user.role.toLowerCase()}`;
      router.push(redirectPath);
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-500">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center pb-6">
            <p className="text-gray-600">
              You don&apos;t have permission to access this page. {user ? "Redirecting to your dashboard..." : "Please log in with appropriate credentials."}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            {!user ? (
              <>
                <Button 
                  className="w-full" 
                  onClick={() => router.push('/auth/login')}
                >
                  Go to Login
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => router.push('/')}
                >
                  Return to Home
                </Button>
              </>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => router.push(`/${user.role.toLowerCase()}`)}
              >
                Go to Dashboard
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default UnauthorizedPage; 