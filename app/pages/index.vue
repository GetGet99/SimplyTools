<template>
    <div class="w-screen min-h-screen grid grid-rows-[auto_auto_minmax(0,_1fr)_auto] gap-2">
        <h1 class="p-5 text-center">
            Simple Tools
        </h1>
        <div>
            <h2 class="h5 text-center">Free simple tools locally run in your browser!</h2>
            <noscript class="h2">
                JavaScript is required for the most part of the site. As all tools are written to work
                locally.
            </noscript>
        </div>
        <div class="flex flex-col">
            <main class="mx-30 sm:mx2 my-2 grid gap-4 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">
                <FeatureCard title="Base 64 Converter" href="dev/b64">
                    A simple <code>atob</code> and <code>btoa</code> GUI wrapper
                </FeatureCard>
                <FeatureCard title="Random Number Generator" href="rng">
                    A simple RNG (Random Number Generator) that can
                    generate numbers between a given range, either integers or real numbers
                </FeatureCard>
                <FeatureCard title="Cases!" href="cases">
                    Want to lowercase? UPPERCASE? swappingCASE? or raNDomcAsE? We got you covered.
                </FeatureCard>
                <FeatureCard title="Programmer Calculator" href="dev/progcalc">
                    Calculator in many number bases.
                </FeatureCard>
            </main>
        </div>
        <Footer />
    </div>
</template>