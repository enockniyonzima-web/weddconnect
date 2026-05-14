"use client";

import { AuthSubmitBtn, AuthTextInput, AuthPasswordInput } from "@/components/forms/AuthForms";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, Mail } from "lucide-react";

type Step = "request" | "sent" | "reset";

export default function ResetPasswordPage() {
     const [step, setStep] = useState<Step>("request");
     const [email, setEmail] = useState("");
     const [loading, setLoading] = useState(false);

     const handleRequestReset = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!email) return;
          setLoading(true);
          await toast.promise(
               new Promise<void>((resolve) => setTimeout(resolve, 1500)),
               {
                    loading: "Sending reset instructions...",
                    success: "Email sent!",
                    error: "Something went wrong. Try again.",
               }
          );
          setLoading(false);
          setStep("sent");
     };

     const handleResetPassword = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          toast.promise(
               new Promise<void>((resolve) => setTimeout(resolve, 1500)),
               {
                    loading: "Updating your password...",
                    success: "Password updated!",
                    error: "Something went wrong. Try again.",
               }
          );
          setLoading(false);
          setStep("reset");
     };

     return (
          <div className="flex flex-col gap-6">

               {/* Step: Request reset */}
               {step === "request" && (
                    <>
                         <div className="mb-2">
                              <div className="w-11 h-11 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center mb-4">
                                   <Mail className="w-5 h-5 text-blue-400" />
                              </div>
                              <h1 className="text-2xl font-bold text-white tracking-tight">Forgot your password?</h1>
                              <p className="text-gray-500 text-sm mt-1.5">
                                   No worries — enter your email and we&apos;ll send you reset instructions.
                              </p>
                         </div>

                         <form onSubmit={handleRequestReset} className="flex flex-col gap-4">
                              <AuthTextInput
                                   label="Email address"
                                   name="reset-email"
                                   type="email"
                                   placeholder="you@example.com"
                                   action={setEmail}
                              />
                              <AuthSubmitBtn loading={loading} name={loading ? "Sending..." : "Send Reset Instructions"} />
                         </form>

                         <p className="text-center text-sm text-gray-500">
                              Remember your password?{" "}
                              <Link href="/auth/login" className="text-blue-500 hover:text-blue-400 font-medium transition-colors">
                                   Back to sign in
                              </Link>
                         </p>
                    </>
               )}

               {/* Step: Email sent */}
               {step === "sent" && (
                    <div className="flex flex-col items-center gap-5 py-6 text-center">
                         <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center">
                              <Mail className="w-8 h-8 text-blue-400" />
                         </div>
                         <div>
                              <h2 className="text-xl font-bold text-white">Check your inbox</h2>
                              <p className="text-gray-400 text-sm mt-2 max-w-xs mx-auto">
                                   We sent a password reset link to{" "}
                                   <span className="text-white font-medium">{email}</span>.
                                   It may take a minute to arrive.
                              </p>
                         </div>
                         <button
                              onClick={() => setStep("reset")}
                              className="text-xs text-blue-500 hover:text-blue-400 transition-colors mt-1"
                         >
                              I have a reset code → Enter new password
                         </button>
                         <div className="h-px w-full bg-gray-800" />
                         <p className="text-sm text-gray-500">
                              Didn&apos;t receive it?{" "}
                              <button
                                   onClick={() => setStep("request")}
                                   className="text-blue-500 hover:text-blue-400 font-medium transition-colors"
                              >
                                   Try again
                              </button>
                         </p>
                    </div>
               )}

               {/* Step: Enter new password */}
               {step === "reset" && (
                    <>
                         <div className="mb-2">
                              <h1 className="text-2xl font-bold text-white tracking-tight">Set new password</h1>
                              <p className="text-gray-500 text-sm mt-1.5">Choose a strong password for your account.</p>
                         </div>

                         <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
                              <AuthPasswordInput
                                   label="New Password"
                                   name="new-password"
                                   placeholder="Enter new password"
                              />
                              <AuthPasswordInput
                                   label="Confirm Password"
                                   name="confirm-password"
                                   placeholder="Confirm new password"
                              />
                              <AuthSubmitBtn loading={loading} name={loading ? "Updating..." : "Update Password"} />
                         </form>
                    </>
               )}

               {/* Step: Done */}
               {step === "reset" && !loading && (
                    <></>
               )}

               {/* Success state shown after submit */}
               {(step as string) === "done" && (
                    <div className="flex flex-col items-center gap-5 py-6 text-center">
                         <div className="w-16 h-16 rounded-2xl bg-green-600/10 border border-green-600/20 flex items-center justify-center">
                              <CheckCircle className="w-8 h-8 text-green-400" />
                         </div>
                         <div>
                              <h2 className="text-xl font-bold text-white">Password updated!</h2>
                              <p className="text-gray-400 text-sm mt-2">Your password has been changed successfully.</p>
                         </div>
                         <Link
                              href="/auth/login"
                              className="w-full py-3 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors text-center"
                         >
                              Back to Sign In
                         </Link>
                    </div>
               )}
          </div>
     );
}
