import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Protected = ({ children }) => {

    const user = useSelector(state => state.auth.user)

    

    const loading = useSelector(state => state.auth.loading)

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="flex flex-col items-center gap-4">

                    {/* Spinner */}
                    <div className="relative w-12 h-12">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>

                    {/* Text */}
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            </div>
        )
    }
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return children
}

export default Protected
