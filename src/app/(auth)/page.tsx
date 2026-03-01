"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { fileUrlGenerator, makeFormData } from "@/utils/helpers";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "./action";
import { useStore } from "@/hooks/store/use-store";
import { useBranch } from "@/hooks/store/use-branch";
import Image from "next/image";
import { Settings } from "@/types/shared";
import { getSetting } from "@/services/settings";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState<Settings>();
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    getSetting().then((data) => setSetting(data));
  }, []);

  const formSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const branchStore = useStore(useBranch, (state) => state);
  if (!branchStore) return null;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = makeFormData(values);
    setLoading(true);
    try {
      const loggedIn = await loginUser(data);
      branchStore.clearBranch();
      if (loggedIn) {
        toast({
          title: "Logged in Successfully!",
          variant: "default",
        });

        router.push("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed!",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="relative grid min-h-screen w-full grid-cols-1 p-4 sm:p-8 lg:grid-cols-2 lg:p-10">
      <div className="z-10 m-auto grid w-full max-w-md gap-6 rounded-xl bg-white/30 p-6 shadow-lg backdrop-blur-lg sm:p-8">
        <div className="grid gap-2 text-center">
          <h1 className="text-3xl font-bold">Login</h1>
          <p className="text-sm text-gray-400 text-muted-foreground">
            Enter your registered email and password to login.
          </p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <Form {...form}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="user@email.com" {...field} />
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs">
                      {form.formState.errors.email?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      {/* <Input type="password" placeholder="******" {...field} /> */}
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="******"
                          {...field}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-2 text-gray-500"
                          onClick={() => setShowPassword((prev) => !prev)}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormDescription className="text-red-400 text-xs">
                      {form.formState.errors.password?.message}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button loading={loading} type="submit" className="w-full">
                Login
              </Button>
            </Form>
          </div>
        </form>
      </div>
      {setting?.login_image_url && (
        <Image
          src={fileUrlGenerator(setting.login_image_url)}
          alt="Login to Bizpos"
          fill
          sizes="(max-width: 1024px) 0vw, 50vw"
          style={{ objectFit: "cover" }}
          quality={100}
          className="-z-10 hidden lg:block"
        />
      )}
    </div>
  );
}
