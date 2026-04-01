import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function escapeHtml(value: unknown) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export async function POST(req: Request) {
    try {
        const body = await req.json();

        console.log("📩 Body recebido:", body);

        if (
            !process.env.MAIL_HOST ||
            !process.env.MAIL_PORT ||
            !process.env.MAIL_USERNAME ||
            !process.env.MAIL_PASSWORD
        ) {
            console.error("❌ Variáveis SMTP ausentes");
            return NextResponse.json(
                {
                    success: false,
                    error: "Configuração de e-mail ausente no servidor.",
                },
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
        });

        await transporter.verify();
        console.log("✅ SMTP validado");

        const info = await transporter.sendMail({
            from: `"${process.env.MAIL_FROM_NAME || "Formulário de Contratação - CEOPAG"}" <${process.env.MAIL_USERNAME}>`,
            replyTo: "gabrielpereira@geometrisa-prod.com.br",
            to: ["dp1@ceopag.com.br", "dp@ceopag.com.br"],
            bcc: ["pereiragabrieldev@gmail.com"],
            subject: `Nova vaga cadastrada: ${escapeHtml(body.cargo)}`,
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color:#003D60; margin-bottom: 16px;">📋 Nova solicitação de vaga</h2>

          <table style="width:100%; border-collapse:collapse; border:1px solid #e5e7eb;">
            <tbody>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Departamento / Líder</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.departamento)}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Cargo</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.cargo)}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Perfil exigido</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.perfil)}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Resumo das atividades</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.atividades)}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Tipo de contratação</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.contratacao)}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Quantidade de colaboradores</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.quantidade)}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Data de admissão</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.admissao)}</td>
              </tr>
              <tr>
                <td style="padding:10px; border:1px solid #e5e7eb; background:#f9fafb;"><b>Observação</b></td>
                <td style="padding:10px; border:1px solid #e5e7eb;">${escapeHtml(body.observacao || "-")}</td>
              </tr>
            </tbody>
          </table>

          <p style="font-size:12px; color:#666; margin-top:20px;">
            Enviado automaticamente pelo sistema Ceopag
          </p>
        </div>
      `,
        });

        console.log("✅ E-mail enviado:", info.messageId);

        return NextResponse.json({
            success: true,
            message: "E-mail enviado com sucesso.",
            messageId: info.messageId,
        });
    } catch (error: any) {
        console.error("❌ Erro ao enviar e-mail");
        console.error("Mensagem:", error?.message);
        console.error("Code:", error?.code);
        console.error("Response:", error?.response);
        console.error("ResponseCode:", error?.responseCode);
        console.error("Stack:", error?.stack);

        return NextResponse.json(
            {
                success: false,
                error: error?.message || "Erro interno ao enviar e-mail.",
            },
            { status: 500 }
        );
    }
}