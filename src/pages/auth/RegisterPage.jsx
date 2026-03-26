import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, User, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

const schema = z.object({
    fullName: z.string().min(2, "Min 2 characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Min 6 characters"),
    confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export function RegisterPage() {
    const { register: registerUser } = useAuth();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });

    const onSubmit = async ({ fullName, email, password }) => {
        const result = await registerUser({ fullName, email, password });
        if (result.success) {
            toast.success("Account created!");
            navigate("/subscription");
        } else {
            toast.error(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
                <div className="flex items-center gap-3 mb-8">
                    <div className="h-9 w-9 rounded-lg bg-brand-500 flex items-center justify-center">
                        <Heart className="h-4 w-4 text-white" fill="white" />
                    </div>
                    <span className="font-display text-xl text-white">GolfGives</span>
                </div>

                <div className="mb-8">
                    <h2 className="font-display text-3xl text-white mb-2">Create account</h2>
                    <p className="text-white/50">Start your journey — play golf, give back</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <Input label="Full Name" icon={User} placeholder="John Doe" error={errors.fullName?.message}            {...register("fullName")} />
                    <Input label="Email" type="email" icon={Mail} placeholder="you@example.com" error={errors.email?.message}  {...register("email")} />
                    <Input label="Password" type="password" icon={Lock} placeholder="••••••••" error={errors.password?.message} {...register("password")} />
                    <Input label="Confirm Password" type="password" icon={Lock} placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
                    <Button type="submit" isLoading={isSubmitting} className="w-full" size="lg">
                        Create Account
                    </Button>
                </form>

                <p className="mt-6 text-center text-white/40 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
                </p>
            </div>
        </div>
    );
}