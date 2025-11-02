import React from 'react'
import ProtectedRoute from '../../components/ProtectedRoute'

export default function DashboardComponent() {
    return (
        <ProtectedRoute>
            <div>
                <div className="text-2xl font-bold mb-4 text-center pt-20">
                    Dashboard works!
                </div>
            </div>
        </ProtectedRoute>
    )
}
