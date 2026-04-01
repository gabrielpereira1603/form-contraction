import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("📩 Body recebido:", body);

        console.log("📧 Config SMTP:", {
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            user: process.env.MAIL_USERNAME,
            from: process.env.MAIL_FROM_ADDRESS,
            fromName: process.env.MAIL_FROM_NAME,
            hasPassword: !!process.env.MAIL_PASSWORD,
        });

        if (
            !process.env.MAIL_HOST ||
            !process.env.MAIL_PORT ||
            !process.env.MAIL_USERNAME ||
            !process.env.MAIL_PASSWORD ||
            !process.env.MAIL_FROM_ADDRESS ||
            !process.env.MAIL_FROM_NAME
        ) {
            console.error("❌ Variáveis de ambiente ausentes", {
                MAIL_HOST: process.env.MAIL_HOST,
                MAIL_PORT: process.env.MAIL_PORT,
                MAIL_USERNAME: process.env.MAIL_USERNAME,
                MAIL_PASSWORD: process.env.MAIL_PASSWORD ? "********" : undefined,
                MAIL_FROM_ADDRESS: process.env.MAIL_FROM_ADDRESS,
                MAIL_FROM_NAME: process.env.MAIL_FROM_NAME,
            });

            return NextResponse.json(
                { success: false, error: "Variáveis de ambiente de e-mail não configuradas corretamente." },
                { status: 500 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: Number(process.env.MAIL_PORT),
            secure: Number(process.env.MAIL_PORT) === 465,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
            logger: true,
            debug: true,
        });

        console.log("🔍 Verificando conexão SMTP...");
        await transporter.verify();
        console.log("✅ Conexão SMTP validada com sucesso");

        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
            to: ["dp1@ceopag.com.br", "dp@ceopag.com.br"],
            bcc: ["pereiragabrieldev@gmail.com"],
            subject: `Nova vaga cadastrada: ${body.cargo}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color:#003D60;">📋 Nova solicitação de vaga</h2>
          <table style="width:100%; border-collapse:collapse;">
            <tr><td><b>Departamento / Líder:</b></td><td>${body.departamento}</td></tr>
            <tr><td><b>Cargo:</b></td><td>${body.cargo}</td></tr>
            <tr><td><b>Perfil exigido:</b></td><td>${body.perfil}</td></tr>
            <tr><td><b>Resumo das atividades:</b></td><td>${body.atividades}</td></tr>
            <tr><td><b>Tipo de contratação:</b></td><td>${body.contratacao}</td></tr>
            <tr><td><b>Quantidade de colaboradores:</b></td><td>${body.quantidade}</td></tr>
            <tr><td><b>Data de admissão:</b></td><td>${body.admissao}</td></tr>
            <tr><td><b>Observação:</b></td><td>${body.observacao || "-"}</td></tr>
          </table>
          <br/>
          <p style="font-size:12px; color:#666;">Enviado automaticamente pelo sistema Ceopag</p>
        </div>
      `,
        });

        console.log("✅ E-mail enviado com sucesso");
        console.log("📨 Resposta do Nodemailer:", info);

        return NextResponse.json({
            success: true,
            messageId: info.messageId,
            response: info.response,
        });
    } catch (error: any) {
        console.error("❌ Erro ao enviar e-mail");
        console.error("Mensagem:", error?.message);
        console.error("Code:", error?.code);
        console.error("Command:", error?.command);
        console.error("Response:", error?.response);
        console.error("ResponseCode:", error?.responseCode);
        console.error("Stack:", error?.stack);
        console.error("Erro completo:", error);

        return NextResponse.json(
            {
                success: false,
                error: "Erro ao enviar e-mail",
                details: {
                    message: error?.message || null,
                    code: error?.code || null,
                    command: error?.command || null,
                    response: error?.response || null,
                    responseCode: error?.responseCode || null,
                },
            },
            { status: 500 }
        );
    }
}