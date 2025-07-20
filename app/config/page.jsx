import React from 'react';
import S3LoginForm from './configForm';
import HowToConnect from './howToConnect';

const page = () => {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)] py-12">
            <header className="w-full max-w-2xl mx-auto text-center mb-8">
                <h1 className="text-4xl font-extrabold text-[var(--primary)] mb-2">Connect Your AWS S3 Storage</h1>
                <p className="text-lg text-[var(--foreground)] mb-4">
                    Easily link your S3 bucket to manage files with <span className="font-semibold">S3Drive</span>. Follow the steps below to get started.
                </p>
            </header>
            <S3LoginForm />
            <HowToConnect />
        </main>
    );
};

export default page;