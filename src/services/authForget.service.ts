//                 forgotPassword
type ForgotPasswordResponse = {
    message: string
    resetToken: string
    expiresAt: string
}

export async function forgotPassword(email: string): Promise<ForgotPasswordResponse> {
    const token = localStorage.getItem("token")

    const response = await fetch("http://egyptvoyage.runasp.net/api/Auth/forgot-password", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
    }

    return data
}


//                resetPassword
export async function resetPassword(token: string, newPassword: string, confirmNewPassword: string) {

    const response = await fetch("http://egyptvoyage.runasp.net/api/Auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword, confirmNewPassword })
    }
    )

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.message || "Reset password failed")
    }

    return data
}
