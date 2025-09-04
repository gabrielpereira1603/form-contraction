import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: Number(process.env.MAIL_PORT) === 465,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: "dp1@ceopag.com.br, dp@ceopag.com.br",
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

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Erro ao enviar e-mail" },
      { status: 500 }
    );
  }
}
