"use client"
import S3LoginForm from '@/components/S3LoginForm'
import React from 'react'

const ConfigForm = () => {
    return (
        <div className="p-4 animate-[borderPulse_2s_ease-in-out_infinite] border-[3px] border-[var(--primary)] rounded-xl shadow transition-all duration-500"
            style={{
                boxShadow: '0 0 0 0 var(--primary)',
                animationName: 'borderPulse',
                animationDuration: '2s',
                animationIterationCount: 'infinite',
                animationTimingFunction: 'ease-in-out'
            }}
        >
            <S3LoginForm />
            <style jsx global>{`
                @keyframes borderPulse {
                    0% {
                        box-shadow: 0 0 0 0 var(--primary);
                        border-color: var(--primary);
                    }
                    50% {
                        box-shadow: 0 0 12px 2px var(--primary);
                        border-color: var(--brand-orange);
                    }
                    100% {
                        box-shadow: 0 0 0 0 var(--primary);
                        border-color: var(--primary);
                    }
                }
            `}</style>
        </div>
    )
}

export default ConfigForm