<template>
    <div class="w-full min-h-screen grid grid-rows-[auto_auto_minmax(0,_1fr)_auto] gap-2">
        <h1 class="p-5 text-center">
            SimplyTools
        </h1>
        <div>
            <h2 class="h5 text-center">Free tools locally run in your browser!</h2>
            <noscript class="h2 text-danger">
                <div class="text-center">JavaScript is required for the most part of the site. All tools are written to work
                locally via JavaScript.</div>
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
                <FeatureCard title="Color Playground" href="colors">
                    Pick and play with different colors! Transform colors by inverting and more!
                </FeatureCard>
                <FeatureCard title="Text Compare" href="diff">
                    Compare between two pieces of text to see what are the differences.
                </FeatureCard>
            </main>
        </div>
        <Footer />
    </div>
</template>