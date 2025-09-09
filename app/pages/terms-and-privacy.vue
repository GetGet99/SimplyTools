<template>
    <Feature category="none" tool="Terms of service and Privacy Policy">
        <div class="font-[system-ui] text-wrap m-4 select-text">
            September 9th 2025<br />
            <br />
            SimplyTools is open sourced under GPL-2.0-or-later on <a
                href="https://github.com/GetGet99/SimplyTools">GitHub</a>. By using this site, you acknowledged its <a
                href="https://github.com/GetGet99/SimplyTools/blob/master/LICENSE">License</a><br /><br />

            SimplyTools are tools running in JavaScript locally on the machine. We do not ourselves collect any data and
            send outside the machine. Some
            tools may save data in the local stoage, but is never shared outside automatically. We do not have access to
            any data you input into these tools.<br /><br />

            However, while I believe that most browsers would not share information you input into this site, we can't
            guarantee mostly what browsers are doing. See your browsers' vendor's privacy policy for
            more information on how they access information stored and whether they collect any logs.<br /><br />

            For Desktop SimplyTools app, we are using WebView2 browser provided by Microsoft. Please check their privacy
            policy for more information.<br /><br />

            Note that as of the time of my writing currently, most AI tools are running locally using built-in AI APIs.
            However, please check your browser's privacy policy and terms of service with AI APIs for full
            details.<br /><br />

            By using AI-related tools, you agree to our <OurLink href="ai/policy">AI Policy</OurLink> and your browsers'
            AI Policy if there is one.<br /><br />
        </div>
        <template #summary>
            TOS and Privacy Policy
        </template>
        <template #details>
            <p>Users are encouraged to review the TOS and Privacy Policy regularly for updates.</p>
        </template>
    </Feature>
</template>
<script setup lang="ts">
import { PrivacyPage } from '~/utils/pages/uncategorized';
usePageInfo(PrivacyPage)
</script>