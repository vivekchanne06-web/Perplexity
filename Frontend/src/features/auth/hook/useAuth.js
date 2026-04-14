import { useDispatch } from "react-redux";
import { login, register, getMe, logout, resendVerificationEmail } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";


export const useAuth = () => {


    const dispatch = useDispatch()

    async function handleRegister({ username, email, password }) {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))
            const data = await register({ username, email, password })
            return data

        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Registration failed'))
            return null
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setError(null))
            dispatch(setLoading(true))

            const data = await login({ email, password })

            if (!data.success) {
                dispatch(setError(data.message))
                return false
            }

            dispatch(setUser(data.user))
            return true


        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Login failed'))
            return false
        } finally {
            dispatch(setLoading(false))
        }

    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true))
            await logout()

            dispatch(setUser(null))
            dispatch(setError(null))

        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Logout failed'))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch {
            dispatch(setUser(null))
        } finally {
            dispatch(setLoading(false))
        }
    }


    async function handleResendVerificationEmail(email) {
        try {
            dispatch(setError(null))
            await resendVerificationEmail(email)
            return true
        } catch (error) {
            dispatch(setError(error.response?.data?.message || 'Failed to resend verification email'))
            return false
        }
    }


    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
        handleResendVerificationEmail
    }

}
