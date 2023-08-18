import { ResetPasswordVerificateEmail, 
    ResetPasswordEnterNewPassword } from "../components/ResetPasswordComponents";
import { useState } from "react";


export default function ResetPasswordPage() {
    const [submitted, setSubmitted] = useState(false);

    return (
        <>
        {!submitted ? (
            <ResetPasswordVerificateEmail setSubmitted={setSubmitted} />
        ): (
            <ResetPasswordEnterNewPassword />
        )}
        </>
    )

}
