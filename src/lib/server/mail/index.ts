// src/routes/api/send-email/+server.ts
import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
	host: env.SMTP_HOST,
	port: Number(env.SMTP_PORT),
	secure: false
});

export async function sendMail({
	to,
	subject,
	body
}: {
	to: string;
	subject: string;
	body: string;
}) {
	if (!to || !subject || !body) {
		return { success: false, message: 'Missing required fields' };
	}

	await transporter.sendMail({
		from: 'no-reply@env-manager.local',
		to,
		subject,
		html: body
	});

	return { success: true };
}
