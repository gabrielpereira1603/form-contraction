"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Briefcase,
    Building2,
    CalendarDays,
    FileText,
    Moon,
    Send,
    Sun,
    Users,
} from "lucide-react";
import CeopagLogo from "../public/ceopag-logo.webp";

const formSchema = z.object({
    departamento: z
        .string()
        .min(3, "Informe o departamento ou líder com pelo menos 3 caracteres."),
    cargo: z.string().min(2, "Informe o cargo."),
    perfil: z.string().min(10, "Descreva melhor o perfil exigido."),
    atividades: z.string().min(10, "Descreva melhor as atividades."),
    contratacao: z.enum(["CLT", "PJ"]),
    quantidade: z.coerce.number().min(1, "A quantidade deve ser no mínimo 1."),
    admissao: z.string().min(1, "Informe a data de admissão."),
    observacao: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
type ThemeMode = "light" | "dark";

export default function Home() {
    const [theme, setTheme] = useState<ThemeMode>("light");

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme-mode") as ThemeMode | null;
        if (savedTheme === "dark" || savedTheme === "light") {
            setTheme(savedTheme);
            document.documentElement.classList.toggle("dark", savedTheme === "dark");
            return;
        }

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme: ThemeMode = prefersDark ? "dark" : "light";
        setTheme(initialTheme);
        document.documentElement.classList.toggle("dark", initialTheme === "dark");
    }, []);

    function toggleTheme() {
        const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        localStorage.setItem("theme-mode", nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
    }

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            departamento: "",
            cargo: "",
            perfil: "",
            atividades: "",
            contratacao: "CLT",
            quantidade: 1,
            admissao: "",
            observacao: "",
        },
    });

    async function onSubmit(data: FormValues) {
        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (!res.ok) {
                throw new Error(result?.error || "Erro ao enviar formulário.");
            }

            reset();

            toast.success("Formulário enviado com sucesso.", {
                description: "A solicitação foi encaminhada para os responsáveis.",
            });
        } catch (error: any) {
            console.error("Erro no envio:", error);

            toast.error("Falha ao enviar formulário.", {
                description: error?.message || "Tente novamente em instantes.",
            });
        }
    }

    const shellClass =
        "min-h-screen transition-colors duration-300 " +
        (theme === "dark"
            ? "bg-slate-950 text-white"
            : "bg-slate-100 text-slate-900");

    const panelClass =
        "w-full max-w-4xl rounded-3xl border shadow-2xl transition-colors duration-300 " +
        (theme === "dark"
            ? "border-white/10 bg-slate-900/90"
            : "border-slate-200 bg-white");

    const inputClass =
        "w-full rounded-xl border px-4 py-3 text-sm outline-none transition " +
        (theme === "dark"
            ? "border-slate-700 bg-slate-950 text-white placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
            : "border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15");

    const labelClass =
        "mb-2 block text-sm font-medium " +
        (theme === "dark" ? "text-slate-200" : "text-slate-700");

    const hintClass =
        "text-xs " + (theme === "dark" ? "text-red-300" : "text-red-600");

    const mutedClass =
        theme === "dark" ? "text-slate-400" : "text-slate-500";

    const topBarClass =
        "border-b px-5 py-5 sm:px-8 " +
        (theme === "dark" ? "border-white/10" : "border-slate-200");

    const iconColor =
        theme === "dark" ? "text-slate-400" : "text-slate-500";

    const cardSoftClass =
        theme === "dark"
            ? "bg-slate-950 border border-slate-800"
            : "bg-slate-50 border border-slate-200";

    const buttonPrimaryClass =
        theme === "dark"
            ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            : "bg-slate-900 text-white hover:bg-slate-800";

    return (
        <main className={shellClass}>
            <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
                <section className={panelClass}>
                    <div className={topBarClass}>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                                        theme === "dark" ? "bg-white" : "bg-slate-100"
                                    }`}
                                >
                                    <Image
                                        src={CeopagLogo}
                                        alt="Ceopag Logo"
                                        width={150}
                                        height={44}
                                        priority
                                    />
                                </div>

                                <div>
                                    <p
                                        className={`text-sm font-medium ${
                                            theme === "dark" ? "text-cyan-300" : "text-blue-700"
                                        }`}
                                    >
                                        Solicitação interna
                                    </p>
                                    <h1 className="text-2xl font-semibold sm:text-3xl">
                                        Cadastro de Vaga
                                    </h1>
                                    <p className={`mt-1 text-sm ${mutedClass}`}>
                                        Preencha os dados abaixo para encaminhar a solicitação.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={toggleTheme}
                                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                                    theme === "dark"
                                        ? "border-slate-700 bg-slate-950 text-slate-200 hover:bg-slate-800"
                                        : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                            >
                                {theme === "dark" ? (
                                    <>
                                        <Sun className="h-4 w-4" />
                                        Tema claro
                                    </>
                                ) : (
                                    <>
                                        <Moon className="h-4 w-4" />
                                        Tema escuro
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6 px-5 py-5 sm:px-8 sm:py-8"
                    >
                        <div className={`rounded-2xl p-4 sm:p-5 ${cardSoftClass}`}>
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="md:col-span-2">
                                    <label htmlFor="departamento" className={labelClass}>
                                        Departamento / Líder
                                    </label>
                                    <div className="relative">
                                        <Building2
                                            className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${iconColor}`}
                                        />
                                        <input
                                            id="departamento"
                                            type="text"
                                            placeholder="Ex.: Recursos Humanos / João Silva"
                                            className={`${inputClass} pl-11`}
                                            {...register("departamento")}
                                        />
                                    </div>
                                    {errors.departamento && (
                                        <p className={`mt-2 ${hintClass}`}>
                                            {errors.departamento.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="cargo" className={labelClass}>
                                        Cargo
                                    </label>
                                    <div className="relative">
                                        <Briefcase
                                            className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${iconColor}`}
                                        />
                                        <input
                                            id="cargo"
                                            type="text"
                                            placeholder="Ex.: Analista Financeiro"
                                            className={`${inputClass} pl-11`}
                                            {...register("cargo")}
                                        />
                                    </div>
                                    {errors.cargo && (
                                        <p className={`mt-2 ${hintClass}`}>{errors.cargo.message}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="contratacao" className={labelClass}>
                                        Tipo de contratação
                                    </label>
                                    <select
                                        id="contratacao"
                                        className={inputClass}
                                        {...register("contratacao")}
                                    >
                                        <option value="CLT">CLT</option>
                                        <option value="PJ">PJ</option>
                                    </select>
                                    {errors.contratacao && (
                                        <p className={`mt-2 ${hintClass}`}>
                                            {errors.contratacao.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="quantidade" className={labelClass}>
                                        Quantidade de colaboradores
                                    </label>
                                    <div className="relative">
                                        <Users
                                            className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${iconColor}`}
                                        />
                                        <input
                                            id="quantidade"
                                            type="number"
                                            min={1}
                                            className={`${inputClass} pl-11`}
                                            {...register("quantidade")}
                                        />
                                    </div>
                                    {errors.quantidade && (
                                        <p className={`mt-2 ${hintClass}`}>
                                            {errors.quantidade.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="admissao" className={labelClass}>
                                        Data de admissão
                                    </label>
                                    <div className="relative">
                                        <CalendarDays
                                            className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${iconColor}`}
                                        />
                                        <input
                                            id="admissao"
                                            type="date"
                                            className={`${inputClass} pl-11`}
                                            {...register("admissao")}
                                        />
                                    </div>
                                    {errors.admissao && (
                                        <p className={`mt-2 ${hintClass}`}>
                                            {errors.admissao.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="perfil" className={labelClass}>
                                        Perfil exigido
                                    </label>
                                    <textarea
                                        id="perfil"
                                        rows={4}
                                        placeholder="Descreva o perfil necessário para a vaga."
                                        className={`${inputClass} resize-none`}
                                        {...register("perfil")}
                                    />
                                    {errors.perfil && (
                                        <p className={`mt-2 ${hintClass}`}>{errors.perfil.message}</p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="atividades" className={labelClass}>
                                        Resumo das atividades
                                    </label>
                                    <textarea
                                        id="atividades"
                                        rows={4}
                                        placeholder="Descreva as atividades e responsabilidades da função."
                                        className={`${inputClass} resize-none`}
                                        {...register("atividades")}
                                    />
                                    {errors.atividades && (
                                        <p className={`mt-2 ${hintClass}`}>
                                            {errors.atividades.message}
                                        </p>
                                    )}
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor="observacao" className={labelClass}>
                                        Observação
                                    </label>
                                    <div className="relative">
                                        <FileText
                                            className={`pointer-events-none absolute left-4 top-4 h-4 w-4 ${iconColor}`}
                                        />
                                        <textarea
                                            id="observacao"
                                            rows={3}
                                            placeholder="Informações adicionais, se necessário."
                                            className={`${inputClass} resize-none pl-11`}
                                            {...register("observacao")}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 border-t border-slate-200/20 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className={`text-sm ${mutedClass}`}>
                                Após o envio, a solicitação será encaminhada automaticamente por e-mail.
                            </p>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70 ${buttonPrimaryClass}`}
                            >
                                {isSubmitting ? (
                                    <>
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
                                        Enviando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Enviar formulário
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    );
}