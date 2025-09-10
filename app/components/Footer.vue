<template>
    <footer class="flex flex-col gap-1 my-4 text-center items-center justify-center">
        <p>Copyright © {{ new Date(Date.now()).getFullYear() }} SimplyTools</p>
        <p>Open sourced on <a href="https://github.com/GetGet99/SimplyTools">GitHub</a>.
            Licensed under GPL-2.0-or-later.
        </p>
        <p class="app:hidden">
            SimplyTools is also avaliable as a Windows application.
        </p>
        <OurLink href="https://apps.microsoft.com/detail/9MZ975XWMXH5?referrer=appbadge&cid=web" class="w-50 app:hidden">
            <img :src="`https://get.microsoft.com/images/en-us%20${theme === 'light' ? 'dark' : 'light'}.svg`" width="200" alt="Download from the Microsoft Store" />
        </OurLink>
    </footer>
</template>
<script setup lang="ts">
const theme = useColorScheme()
</script>