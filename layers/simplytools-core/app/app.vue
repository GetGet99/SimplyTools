<script setup lang="ts">
import simplyToolsIconFit from './assets/SimplyToolsIcon_fit.png';
useHead({
    bodyAttrs: {
        style: {
            'color-scheme': 'dark light',
            'overflow': 'hidden'
        }
    },
    htmlAttrs: {
        lang: 'en'
    },
    link: [
        { rel: 'icon', type: 'image/png', href: simplyToolsIconFit }
    ],
    style: [
        {
            tagPosition: 'head',
            innerHTML: '@layer properties, base, components, theme, utilities;'
        }
    ],
    script: [
        {
            textContent: `(function () {
      try {
        var ua = navigator.userAgent;
        if (ua.indexOf('SimplyTools/Windows') !== -1) {
          document.documentElement.classList.add('app');
          document.body.classList.add('app');
        } else {
          function isPWA() {
            return window.matchMedia('(display-mode: standalone)').matches ||
              window.navigator.standalone === true ||
              document.referrer.includes('android-app://');
          }

          if (isPWA()) {
            document.documentElement.classList.add('app');
            document.body.classList.add('app');
            document.documentElement.classList.add('app-browser');
            document.body.classList.add('app-browser');
          }
        }
      } catch (e) { }
    })();`,
            tagPosition: 'head'
        }
    ]
})
</script>
<template>
    <Grid columns="auto grow" rows="auto grow" class="w-full h-screen bg-root text-foreground">
        <SkipLink to="main" />
        <SkipLink to="selected-navigation-item" />
        <div class="col-span-2">
            <TitleBar />
        </div>
        <div class="w-80 not-lg:contents">
            <GlobalNavigationView />
        </div>
        <SkipLink to="selected-navigation-item" />
        <Layer class="w-full h-full lg:rounded-tl-lg not-lg:col-span-2">
            <ToastProvider :duration="7500">
                <ToastsGenerator>
                    <main id="main" class="w-full h-full overflow-scroll rounded-tl-lg">
                        <NuxtPage />
                    </main>
                </ToastsGenerator>
                <Flex as-child column class="fixed bottom-0 right-0 gap-2 p-6">
                    <ToastViewport />
                </Flex>
            </ToastProvider>
        </Layer>
    </Grid>
</template>