import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import {  Bug, RefreshCw, TerminalSquare } from "lucide-react";
import  { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("❌ Error caught by ErrorBoundary:", error, errorInfo);
    // You can also log error to an error tracking service like Sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950 p-4 sm:p-6 lg:p-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="w-full max-w-lg"
          >
            <Card className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-700/50 bg-gray-900/80 backdrop-blur-sm">
              {/* Subtle abstract background element */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-800/10 to-purple-800/10 opacity-30 blur-3xl pointer-events-none"></div>

              <CardHeader className="bg-gradient-to-r from-indigo-700 to-purple-700 py-8 px-6 rounded-t-2xl flex flex-col items-center justify-center relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 10 }}
                >
                  <Bug className="h-20 w-20 text-yellow-300 mb-4 animate-pulse" /> {/* Larger, yellow, animated icon */}
                </motion.div>
                <CardTitle className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg">
                  System Glitch Detected!
                </CardTitle>
                <p className="text-indigo-100 text-base mt-2 text-center max-w-xs">
                  An unexpected error occurred. We're on it!
                </p>
              </CardHeader>
              <CardContent className="p-8 space-y-6 bg-gray-900/90">
                <p className="text-center text-xl text-gray-200 font-semibold">Something went wrong on our end.</p>
                <p className="text-center text-sm text-gray-400">
                  Our engineers have been notified and are working to fix the issue.
                </p>

                {this.state.error && (
                  <div className="bg-gray-800 border border-gray-700 text-gray-300 p-4 rounded-lg text-left text-sm font-mono overflow-auto max-h-48 shadow-inner">
                    <p className="font-bold mb-2 flex items-center gap-2 text-gray-200">
                      <TerminalSquare className="h-4 w-4 text-blue-400" /> Error Details:
                    </p>
                    <pre className="whitespace-pre-wrap break-words">{this.state.error.message}</pre>
                  </div>
                )}

                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-lg font-bold rounded-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <RefreshCw className="h-6 w-6 mr-3" />
                  Reload Application
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary;
