"use server";

import { UserModel } from "@/utils/backend/userModel";
import { connectDB } from "@/utils/backend/mongoDB";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sendMail } from "@/utils/mailService";
import { ActionResponse, IUserContext } from "@/types/index";

export async function loginAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !password) {
      return { success: false, error: "Incomplete data" };
    }

    await connectDB();

    let user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return { success: false, error: "Invalid credentials" };
    }

    let decryptedPass = bcrypt.compareSync(password, user.password);

    if (!decryptedPass) {
      return { success: false, error: "Invalid credentials" };
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    );

    cookies().set({
      name: "taskmastertoken",
      value: token,
      path: "/",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });

    return {
      success: true,
      message: "Welcome back " + user.name + "!",
      user: {
        name: user.name,
        email: user.email,
        token: token,
      },
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function signupAction(
  prevState: any,
  formData: FormData,
): Promise<ActionResponse> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!name || !email || !password) {
      return { success: false, error: "Incomplete data" };
    }

    await connectDB();

    let user = await UserModel.findOne({ email });
    if (user) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await UserModel.create({ name, email, password: hashedPassword });

    return { success: true, message: "User created!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getUser(token: string): Promise<IUserContext | null> {
  try {
    if (!token) return null;

    await connectDB();
    const verified = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    ) as any;

    let user = await UserModel.findById(verified.id);
    if (!user) return null;

    // Convert ObjectId to string to pass to Client Components
    return {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      token: token,
    };
  } catch (error) {
    return null;
  }
}

export async function verifyEmailAction(
  token: string,
): Promise<ActionResponse> {
  try {
    const { name, email, password } = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    ) as any;

    if (!name || !email || !password) {
      return { success: false, error: "Incomplete data" };
    }

    await connectDB();

    let user = await UserModel.findOne({ email });
    if (user) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    await UserModel.create({ name, email, password: hashedPassword });

    return { success: true, message: "User created!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function sendRecoveryEmailAction(
  email: string,
): Promise<ActionResponse> {
  try {
    if (!email) {
      return { success: false, error: "Incomplete Data" };
    }

    await connectDB();

    let user = await UserModel.findOne({ email });
    if (!user) {
      return { success: false, error: "User does not exist" };
    }

    const token = jwt.sign(
      { _id: user._id },
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    );
    const link = process.env.NEXT_PUBLIC_RECOVERY_URL + `?verifyToken=${token}`;

    const html = `
    <html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
  	<meta name="viewport" content="width=device-width, initial-scale=1.0;">
  <meta name="format-detection" content="telephone=no"/>
	<style>
/* Reset styles */ 
body { margin: 0; padding: 0; min-width: 100%; width: 100% !important; height: 100% !important;}
body, table, td, div, p, a { -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%; }
table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-collapse: collapse !important; border-spacing: 0; }
img { border: 0; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
#outlook a { padding: 0; }
.ReadMsgBody { width: 100%; } .ExternalClass { width: 100%; }
.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
@media all and (min-width: 560px) {
	.container { border-radius: 8px; -webkit-border-radius: 8px; -moz-border-radius: 8px; -khtml-border-radius: 8px;}
}
a, a:hover {
	color: #127DB3;
}
.footer a, .footer a:hover {
	color: #999999;
}
 	</style>
	<title>Password Recovery !</title>
</head>
<body topmargin="0" rightmargin="0" bottommargin="0" leftmargin="0" marginwidth="0" marginheight="0" width="100%" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%; height: 100%; -webkit-font-smoothing: antialiased; text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; line-height: 100%;
	background-color: #F0F0F0;
	color: #000000;"
	bgcolor="#F0F0F0"
	text="#000000">
<table width="100%" align="center" border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; width: 100%;" class="background"><tr><td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;"
	bgcolor="#F0F0F0">
<table border="0" cellpadding="0" cellspacing="0" align="center"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="wrapper">
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
			padding-top: 20px;
			padding-bottom: 20px;">
			<div style="display: none; visibility: hidden; overflow: hidden; opacity: 0; font-size: 1px; line-height: 1px; height: 0; max-height: 0; max-width: 0;
			color: #F0F0F0;" class="preheader">
			Recover your account by resseting your password.	
            </div>
		</td>
	</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" align="center"
	bgcolor="#FFFFFF"
	width="560" style="border-collapse: collapse; border-spacing: 0; padding: 0; width: inherit;
	max-width: 560px;" class="container">
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 24px; font-weight: bold; line-height: 130%;
			padding-top: 25px;
			color: #000000;
			font-family: sans-serif;" class="header">
				Welcome ${user.name} !
		</td>
	</tr>
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-bottom: 3px; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 18px; font-weight: 300; line-height: 150%;
			padding-top: 5px;
			color: #000000;
			font-family: sans-serif;" class="subheader">
				Forgot your password ? no issues ..! .
		</td>
	</tr>
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0;
			padding-top: 20px;" class="hero"><a target="_blank" style="text-decoration: none;"
			href="https://github.com/konsav/email-templates/"><img border="0" vspace="0" hspace="0"
			src="https://png.pngtree.com/thumb_back/fh260/back_our/20190614/ourmid/pngtree-internet-password-network-security-technology-background-image_122932.jpg"
			alt="Please enable images to view this content" title="Hero Image"
			width="560" style="
			width: 100%;
			max-width: 560px;
			color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; border: none; display: block;"/></a></td>
	</tr>
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;
			padding-top: 25px; 
			color: #000000;
			font-family: sans-serif;" class="paragraph">
				Click on the Reset button to reset your account password.
        You will be redirected to the TaskMaster website.
		</td>
	</tr>
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%;
			padding-top: 25px;
			padding-bottom: 5px;" class="button"><a
			href="${link}" target="_blank" style="text-decoration: underline;">
				<table border="0" cellpadding="0" cellspacing="0" align="center" style="max-width: 240px; min-width: 120px; border-collapse: collapse; border-spacing: 0; padding: 0;"><tr><td align="center" valign="middle" style="padding: 12px 24px; margin: 0; text-decoration: underline; border-collapse: collapse; border-spacing: 0; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; -khtml-border-radius: 4px;"
					bgcolor="#E9703E"><a target="_blank" style="text-decoration: underline;
					color: #FFFFFF; font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;"
					href="${link}">
						Reset Password
					</a>
			</td></tr></table></a>
		</td>
	</tr>
	<tr>
		<td align="center" valign="top" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 13px; font-weight: 400; line-height: 150%;
			padding-top: 20px;
			padding-bottom: 20px;
			color: #999999;
			font-family: sans-serif;" class="footer">
				This email  was sent to you because you choose to reset your TaskMaster password . If this is a mistake please report to our support at sunilbandwork@gmail.com.
		</td>
	</tr>
</table>
</td></tr></table>
</body>
</html>
    `;

    await sendMail(email, "Reset Password", html);
    return {
      success: true,
      message: "Email verification link sent to your mail !",
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function resetPasswordAction(
  token: string,
  password: string,
): Promise<ActionResponse> {
  try {
    const { _id } = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET as string,
    ) as any;

    if (!_id) {
      return { success: false, error: "Invalid token" };
    }

    await connectDB();
    let hashedPassword = await bcrypt.hash(password.toString(), 10);
    let user = await UserModel.findByIdAndUpdate(
      _id,
      { password: hashedPassword },
      { new: true },
    );

    if (!user) {
      return { success: false, error: "No user found" };
    }

    return { success: true, message: "Password Updated!" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function logoutAction(): Promise<ActionResponse> {
  try {
    cookies().delete("taskmastertoken");
    return { success: true, message: "Logged out successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
