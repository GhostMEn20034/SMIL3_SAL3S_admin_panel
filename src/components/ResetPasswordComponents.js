import { useState } from "react";
import { Box, Typography, TextField, Button, Alert, Link } from "@mui/material";
import useAxios from "../utils/useAxios";
import { useLocation, useNavigate } from "react-router-dom";




export function ResetPasswordEnterEmail () {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    
    const style = {
        width: '30%',
        bgcolor: 'background.paper',
        border: 1,
        borderRadius: "10px",
        borderColor: "#e3e1cf",
        mt: 1,
        padding: 3
    };

    const api = useAxios();

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            let response = await api.post('/api/user/reset-password/', {email: email});

            let response_data = await response.data;
            sessionStorage.setItem("token", response_data.token);

            navigate(
                {pathname: '/reset-password/confirm'},
                {state: {"email": email}}
                );

        } catch (error) {
            setError(error.response.data.error);
        }
    };

    return (
        <>
            <Box display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 5 }}>
                <Box sx={style}>
                    <Box>
                        <Typography variant="h4">
                            Reset password
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body1">
                        Enter the email address associated with your Smile sales account.
                        </Typography>
                    </Box>
                    {error && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <TextField label='Email' size="small" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" fullWidth onClick={handleSubmit}
                            sx={{ borderRadius: "10px", color: "black", backgroundColor: "#ebeb05", ":hover": { backgroundColor: "#dede04" } }}
                        >
                            Continue
                        </Button>
                    </Box>
                    <Box sx={{ mt: 4 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Link href="/signin" variant="body2">
                            Go back
                        </Link>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export function ResetPasswordVerificateEmail ({setSubmitted}) {
    const [OTP, setOTP] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const style = {
        width: '30%',
        bgcolor: 'background.paper',
        border: 1,
        borderRadius: "10px",
        borderColor: "#e3e1cf",
        mt: 1,
        padding: 3
    };

    const api = useAxios();

    const location = useLocation();

    const email = location.state.email;

    const handleSubmit = async () => {
        try {
            let response = await api.post('/api/verification/confirm-password-reset-request/', {
                code: OTP,
                token: sessionStorage.getItem("token")
            });

            let response_data = await response.data;
            sessionStorage.setItem("token", response_data.token);
            setSubmitted(true);

        } catch (error) {
            setError(error.response.data.error);
        }
    }

    const resendOTP = async () => {
        try {
            let response = await api.post(`/api/verification/resend-otp/`, {
                token: sessionStorage.getItem("token"),
                action_type: 'reset-password'
            });

            let response_data = await response.data;
            sessionStorage.setItem("token", response_data.token);
            

            setSuccess("A new One Time Password (OTP) has been sent.")
        } catch (error) {
            setError(error.response.data.error)
        }
    }


    return (
        <>
            <Box display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 5 }}>
                <Box sx={style}>
                    <Box>
                        <Typography variant="h4">
                            Verification required
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body1">
                        To continue, complete this verification step. We've sent a One Time Password (OTP) to the email {email}. Please enter it below.
                        </Typography>
                    </Box>
                    {success && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
                        </Box>
                    )}
                    {error && (
                        <Box sx={{ mt: 2, mb: 2 }}>
                            <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <TextField label='Enter OTP' size="small" value={OTP} onChange={(e) => setOTP(e.target.value)} fullWidth />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" fullWidth onClick={handleSubmit}
                            sx={{ borderRadius: "10px", color: "black", backgroundColor: "#ebeb05", ":hover": { backgroundColor: "#dede04" } }}
                        >
                            Continue
                        </Button>
                    </Box>
                    <Box sx={{ mt: 4 }}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Link href="/reset-password" variant="body2" sx={{mr: 2}}>
                            Go back
                        </Link>
                        <Link component="button" variant="body2" onClick={resendOTP} sx={{ml: 2}}>
                            Resend OTP
                        </Link>
                    </Box>
                </Box>
            </Box>
        </>
    )
}


export function ResetPasswordEnterNewPassword () {
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const style = {
        width: '30%',
        bgcolor: 'background.paper',
        border: 1,
        borderRadius: "10px",
        borderColor: "#e3e1cf",
        mt: 1,
        padding: 3
    };

    const navigate = useNavigate();
    const api = useAxios();

    const handleSubmit = async () => {
        try {
            await api.post('/api/verification/reset-password/', {
                password: password,
                token: sessionStorage.getItem("token")
            });
            setSuccess("Password reseted successfully, now you can login with new password");
            setTimeout(() => {
                navigate("/signin");
              }, 2000);
            
        } catch (error) {
            if (error.response.status === 400) {
                setError(error.response.data.error);
            } else {
                setError("Something went wrong, try to request password reset again")
            }
            
        }
    }

    return (
        <>
            <Box display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 5 }}>
                <Box sx={style}>
                    <Box>
                        <Typography variant="h4">
                            New password
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body1">
                        Enter the new password associated with your Smile sales account. <br />
                        Note that new password should contain <b>at least 8 characters</b>.
                        </Typography>
                    </Box>
                    {success && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
                        </Box>
                    )}
                    {error && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
                        </Box>
                    )}
                    <Box sx={{ mt: 2 }}>
                        <TextField label='Password' size="small" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth type="password"/>
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" fullWidth onClick={handleSubmit}
                            sx={{ borderRadius: "10px", color: "black", backgroundColor: "#ebeb05", ":hover": { backgroundColor: "#dede04" } }}
                        >
                            Continue
                        </Button>
                    </Box>
                </Box>
            </Box>
        </>
    )
}