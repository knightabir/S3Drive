import React from 'react';
import S3LoginForm from './configForm';
import HowToConnect from './howToConnect';

const page = () => {
  return (
    <main className="pb-12 pt-10 sm:pt-14">
      <section className="section-shell">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--secondary)]">Connection Setup</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Connect your AWS S3 workspace securely</h1>
          <p className="mt-3 text-sm text-[var(--muted-foreground)] sm:text-base">
            Add your credentials locally in-browser, validate access, and start managing files with a cleaner professional interface.
          </p>
        </header>
        <S3LoginForm />
        <HowToConnect />
      </section>
    </main>
  );
};

export default page;
