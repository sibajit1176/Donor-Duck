const forgotPasswordTemplate = (name, otp) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
</head>

<body style="
    margin:0;
    padding:40px 0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
    >
        <tr>
            <td align="center">

                <table
                    width="600"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        background:#ffffff;
                        border-radius:16px;
                        overflow:hidden;
                        box-shadow:0 10px 30px rgba(0,0,0,0.08);
                    "
                >

                    <!-- Header -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:linear-gradient(90deg,#16a34a,#059669);
                                padding:35px;
                                color:#ffffff;
                            "
                        >

                            <h1 style="margin:0;font-size:28px;">

                                Password Reset

                            </h1>

                            <p style="margin-top:10px;opacity:.9;">

                                Secure Verification Code

                            </p>

                        </td>

                    </tr>

                    <!-- Body -->

                    <tr>

                        <td
                            style="
                                padding:40px;
                                color:#374151;
                            "
                        >

                            <h2 style="margin-top:0;">

                                Hello ${name},

                            </h2>

                            <p
                                style="
                                    font-size:16px;
                                    line-height:28px;
                                "
                            >

                                We received a request to reset your
                                account password.

                                Please use the OTP below to continue.

                            </p>

                            <!-- OTP -->

                            <div
                                style="
                                    margin:35px 0;
                                    text-align:center;
                                "
                            >

                                <div
                                    style="
                                        display:inline-block;
                                        padding:18px 35px;
                                        background:#ecfdf5;
                                        border:2px dashed #16a34a;
                                        border-radius:14px;
                                        font-size:36px;
                                        font-weight:bold;
                                        letter-spacing:10px;
                                        color:#16a34a;
                                    "
                                >

                                    ${otp}

                                </div>

                            </div>

                            <p
                                style="
                                    font-size:15px;
                                    line-height:26px;
                                "
                            >

                                This OTP is valid for

                                <strong>

                                    10 minutes

                                </strong>

                                and can only be used once.

                            </p>

                            <div
                                style="
                                    margin-top:30px;
                                    padding:18px;
                                    border-radius:10px;
                                    background:#fff7ed;
                                    border-left:5px solid #f59e0b;
                                "
                            >

                                <strong>

                                    Security Notice

                                </strong>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        line-height:24px;
                                        font-size:14px;
                                    "
                                >

                                    Never share this OTP with anyone.
                                    Our team will never ask for your OTP.

                                </p>

                            </div>

                        </td>

                    </tr>

                    <!-- Footer -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:#f9fafb;
                                padding:25px;
                                color:#6b7280;
                                font-size:13px;
                            "
                        >

                            If you didn't request a password reset,
                            you can safely ignore this email.

                            <br /><br />

                            © 2026 Charity Donation Platform.
                            All rights reserved.

                        </td>

                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;

const verifyEmailTemplate = (name, otp) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
</head>

<body style="
    margin:0;
    padding:40px 0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
    >
        <tr>
            <td align="center">

                <table
                    width="600"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        background:#ffffff;
                        border-radius:16px;
                        overflow:hidden;
                        box-shadow:0 10px 30px rgba(0,0,0,0.08);
                    "
                >

                    <!-- Header -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:linear-gradient(90deg,#16a34a,#059669);
                                padding:35px;
                                color:#ffffff;
                            "
                        >

                            <h1 style="margin:0;font-size:28px;">
                                Verify Your Email
                            </h1>

                            <p style="margin-top:10px;opacity:.9;">
                                Welcome to Donor Duck
                            </p>

                        </td>

                    </tr>

                    <!-- Body -->

                    <tr>

                        <td
                            style="
                                padding:40px;
                                color:#374151;
                            "
                        >

                            <h2 style="margin-top:0;">
                                Hello ${name},
                            </h2>

                            <p
                                style="
                                    font-size:16px;
                                    line-height:28px;
                                "
                            >
                                Thank you for registering with
                                <strong>Donor Duck</strong>.

                                <br /><br />

                                To verify your email address and activate your account,
                                please enter the following One-Time Password (OTP):
                            </p>

                            <!-- OTP -->

                            <div
                                style="
                                    margin:35px 0;
                                    text-align:center;
                                "
                            >

                                <div
                                    style="
                                        display:inline-block;
                                        padding:18px 35px;
                                        background:#ecfdf5;
                                        border:2px dashed #16a34a;
                                        border-radius:14px;
                                        font-size:36px;
                                        font-weight:bold;
                                        letter-spacing:10px;
                                        color:#16a34a;
                                    "
                                >

                                    ${otp}

                                </div>

                            </div>

                            <p
                                style="
                                    font-size:15px;
                                    line-height:26px;
                                "
                            >

                                This verification OTP is valid for

                                <strong>10 minutes</strong>

                                and can only be used once.

                            </p>

                            <div
                                style="
                                    margin-top:30px;
                                    padding:18px;
                                    border-radius:10px;
                                    background:#ecfdf5;
                                    border-left:5px solid #16a34a;
                                "
                            >

                                <strong>
                                    Why verify your email?
                                </strong>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        line-height:24px;
                                        font-size:14px;
                                    "
                                >
                                    Email verification helps protect your account
                                    and allows you to donate securely, receive donation
                                    receipts, and stay updated on the impact of your
                                    contributions.
                                </p>

                            </div>

                            <div
                                style="
                                    margin-top:25px;
                                    padding:18px;
                                    border-radius:10px;
                                    background:#fff7ed;
                                    border-left:5px solid #f59e0b;
                                "
                            >

                                <strong>
                                    Security Notice
                                </strong>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        line-height:24px;
                                        font-size:14px;
                                    "
                                >
                                    Never share this OTP with anyone.
                                    Donor Duck will never ask for your OTP by phone,
                                    email, or message.
                                </p>

                            </div>

                        </td>

                    </tr>

                    <!-- Footer -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:#f9fafb;
                                padding:25px;
                                color:#6b7280;
                                font-size:13px;
                            "
                        >

                            If you did not create a Donor Duck account,
                            you can safely ignore this email.

                            <br /><br />

                            <strong>Donor Duck</strong><br />

                            Connecting Kindness with Impact

                            <br /><br />

                            © 2026 Donor Duck. All rights reserved.

                        </td>

                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;
const paymentSuccessTemplate = (
    name,
    amount,
    charityName,
    projectName,
    orderId,
    paymentDate
) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
</head>

<body style="
    margin:0;
    padding:40px 0;
    background:#f4f7fb;
    font-family:Arial, Helvetica, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
            <td align="center">

                <table
                    width="600"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        background:#ffffff;
                        border-radius:16px;
                        overflow:hidden;
                        box-shadow:0 10px 30px rgba(0,0,0,0.08);
                    "
                >

                    <!-- Header -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:linear-gradient(90deg,#16a34a,#059669);
                                padding:35px;
                                color:#ffffff;
                            "
                        >

                            <h1 style="margin:0;font-size:28px;">
                                Payment Successful
                            </h1>

                            <p style="margin-top:10px;opacity:.9;">
                                Thank you for your generous donation ❤️
                            </p>

                        </td>

                    </tr>

                    <!-- Body -->

                    <tr>

                        <td
                            style="
                                padding:40px;
                                color:#374151;
                            "
                        >

                            <h2 style="margin-top:0;">
                                Hello ${name},
                            </h2>

                            <p
                                style="
                                    font-size:16px;
                                    line-height:28px;
                                "
                            >
                                We are delighted to inform you that your donation
                                has been successfully processed.

                                <br /><br />

                                Thank you for supporting
                                <strong>${charityName}</strong>.
                                Your contribution will help create a meaningful
                                impact in the lives of those who need it most.
                            </p>

                            <!-- Amount -->

                            <div
                                style="
                                    margin:35px 0;
                                    text-align:center;
                                "
                            >

                                <div
                                    style="
                                        display:inline-block;
                                        padding:18px 40px;
                                        background:#ecfdf5;
                                        border:2px dashed #16a34a;
                                        border-radius:14px;
                                        font-size:34px;
                                        font-weight:bold;
                                        color:#16a34a;
                                    "
                                >

                                    ₹${Number(amount).toLocaleString("en-IN")}

                                </div>

                            </div>

                            <!-- Donation Details -->

                            <table
                                width="100%"
                                cellpadding="10"
                                cellspacing="0"
                                style="
                                    border:1px solid #e5e7eb;
                                    border-radius:10px;
                                    margin-top:20px;
                                "
                            >

                                <tr>

                                    <td><strong>Order ID</strong></td>

                                    <td>${orderId}</td>

                                </tr>

                                <tr>

                                    <td><strong>Charity</strong></td>

                                    <td>${charityName}</td>

                                </tr>

                                <tr>

                                    <td><strong>Project</strong></td>

                                    <td>${projectName}</td>

                                </tr>

                                <tr>

                                    <td><strong>Donation Date</strong></td>

                                    <td>${paymentDate}</td>

                                </tr>

                                <tr>

                                    <td><strong>Status</strong></td>

                                    <td style="color:#16a34a;font-weight:bold;">
                                        SUCCESS
                                    </td>

                                </tr>

                            </table>

                            <!-- Thank You -->

                            <div
                                style="
                                    margin-top:35px;
                                    padding:18px;
                                    border-radius:10px;
                                    background:#ecfdf5;
                                    border-left:5px solid #16a34a;
                                "
                            >

                                <strong>
                                    Thank You for Your Kindness ❤️
                                </strong>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        line-height:24px;
                                        font-size:14px;
                                    "
                                >
                                    Every donation, no matter the size,
                                    helps bring hope and creates a positive
                                    impact in someone's life. Thank you for
                                    making a difference.
                                </p>

                            </div>

                            <!-- Receipt -->

                            <div
                                style="
                                    margin-top:25px;
                                    padding:18px;
                                    border-radius:10px;
                                    background:#eff6ff;
                                    border-left:5px solid #2563eb;
                                "
                            >

                                <strong>
                                    Donation Receipt
                                </strong>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        line-height:24px;
                                        font-size:14px;
                                    "
                                >
                                    Please keep this email as confirmation
                                    of your donation. It serves as your
                                    donation receipt and transaction record.
                                </p>

                            </div>

                        </td>

                    </tr>

                    <!-- Footer -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:#f9fafb;
                                padding:25px;
                                color:#6b7280;
                                font-size:13px;
                            "
                        >

                            Thank you for choosing
                            <strong>Donor Duck</strong>.

                            <br /><br />

                            Together, we are creating a better tomorrow.

                            <br /><br />

                            <strong>Donor Duck</strong><br />

                            Connecting Kindness with Impact

                            <br /><br />

                            © 2026 Donor Duck. All rights reserved.

                        </td>

                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>

</html>
`;

const adminPermissionTemplate = (name, otp) => `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8" />
</head>

<body
    style="
        margin:0;
        padding:40px 0;
        background:#f4f7fb;
        font-family:Arial, Helvetica, sans-serif;
    "
>

    <table
        width="100%"
        cellpadding="0"
        cellspacing="0"
    >

        <tr>

            <td align="center">

                <table
                    width="600"
                    cellpadding="0"
                    cellspacing="0"
                    style="
                        background:#ffffff;
                        border-radius:16px;
                        overflow:hidden;
                        box-shadow:0 10px 30px rgba(0,0,0,0.08);
                    "
                >

                    <!-- Header -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:linear-gradient(90deg,#16a34a,#059669);
                                padding:35px;
                                color:#ffffff;
                            "
                        >

                            <h1
                                style="
                                    margin:0;
                                    font-size:28px;
                                "
                            >

                                Admin Permission Verification

                            </h1>

                            <p
                                style="
                                    margin-top:10px;
                                    opacity:.9;
                                "
                            >

                                Verify your identity to continue

                            </p>

                        </td>

                    </tr>

                    <!-- Body -->

                    <tr>

                        <td
                            style="
                                padding:40px;
                                color:#374151;
                            "
                        >

                            <h2 style="margin-top:0;">

                                Hello ${name},

                            </h2>

                            <p
                                style="
                                    font-size:16px;
                                    line-height:28px;
                                "
                            >

                                We received a request to grant your account
                                <strong>Administrator Permission</strong> on the
                                Charity Donation Platform.

                                To continue, please verify your identity using
                                the One-Time Password (OTP) below.

                            </p>

                            <!-- OTP -->

                            <div
                                style="
                                    margin:35px 0;
                                    text-align:center;
                                "
                            >

                                <div
                                    style="
                                        display:inline-block;
                                        padding:18px 35px;
                                        background:#ecfdf5;
                                        border:2px dashed #16a34a;
                                        border-radius:14px;
                                        font-size:36px;
                                        font-weight:bold;
                                        letter-spacing:10px;
                                        color:#16a34a;
                                    "
                                >

                                    ${otp}

                                </div>

                            </div>

                            <p
                                style="
                                    font-size:15px;
                                    line-height:26px;
                                "
                            >

                                This OTP will expire in
                                <strong>10 minutes</strong> and can only be used
                                once.

                            </p>

                            <div
                                style="
                                    margin-top:30px;
                                    padding:18px;
                                    border-radius:10px;
                                    background:#eff6ff;
                                    border-left:5px solid #2563eb;
                                "
                            >

                                <strong>

                                    Why am I receiving this?

                                </strong>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        line-height:24px;
                                        font-size:14px;
                                    "
                                >

                                    This verification is required before
                                    Administrator privileges can be assigned to
                                    your account. Only verified users can obtain
                                    admin access.

                                </p>

                            </div>

                            <div
                                style="
                                    margin-top:20px;
                                    padding:18px;
                                    border-radius:10px;
                                    background:#fff7ed;
                                    border-left:5px solid #f59e0b;
                                "
                            >

                                <strong>

                                    Security Notice

                                </strong>

                                <p
                                    style="
                                        margin:10px 0 0;
                                        line-height:24px;
                                        font-size:14px;
                                    "
                                >

                                    Never share this OTP with anyone.
                                    Our team will never ask for your OTP.
                                    If you did not request administrator access,
                                    please ignore this email.

                                </p>

                            </div>

                        </td>

                    </tr>

                    <!-- Footer -->

                    <tr>

                        <td
                            align="center"
                            style="
                                background:#f9fafb;
                                padding:25px;
                                color:#6b7280;
                                font-size:13px;
                            "
                        >

                            This is an automated email from the
                            <strong>Charity Donation Platform</strong>.

                            <br /><br />

                            © 2026 Charity Donation Platform.
                            All rights reserved.

                        </td>

                    </tr>

                </table>

            </td>

        </tr>

    </table>

</body>

</html>
`;

module.exports = {forgotPasswordTemplate,verifyEmailTemplate,paymentSuccessTemplate,adminPermissionTemplate}