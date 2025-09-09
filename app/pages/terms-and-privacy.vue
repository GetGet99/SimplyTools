<template>
    <Feature category="none" tool="Policy">
        <div class="font-[system-ui] text-wrap m-4 select-text">
            SimplyTools Terms of service and Privacy Policy<br>
            September 9th 2025</br>
            </br>
            SimplyTools is open sourced under GPL-2.0-or-later on <a
                href="https://github.com/GetGet99/SimplyTools">GitHub</a>. By using this site, you acknowledged its <a
                href="https://github.com/GetGet99/SimplyTools/blob/master/LICENSE">License</a></br>

            SimplyTools are tools running in JavaScript locally on the machine. We do not ourselves collect any data and
            send outside the machine. Some
            tools may save data in the local stoage, but is never shared outside automatically. We do not have access to
            any data you input into these tools.

            However, while I believe that most browsers would not share information you input into this site, we can't
            guarantee mostly what browsers are doing. See your browsers' vendor's privacy policy for
            more information on how they access information stored and whether they collect any logs.

            For Desktop SimplyTools app, we are using WebView2 browser provided by Microsoft. Please check their privacy
            policy for more information.

            Note that as of the time of my writing currently, most AI tools are running locally using built-in AI APIs.
            However, please check your browser's privacy policy and terms of service with AI APIs for full details.

            By using AI-related tools, you agree to our <OurLink href="ai/policy">AI Policy</OurLink> and your browsers'
            AI Policy if there is one.
        </div>
        <template #summary>
            This policy outlines the responsible use of AI features within SimplyAITools, emphasizing user
            responsibility, privacy, and compliance with legal standards.
        </template>
        <template #details>
            <p>This policy is designed to ensure that users of SimplyAITools understand their responsibilities when
                using
                the built-in, on-device AI features. It highlights the importance of lawful and ethical use, user
                accountability for input and output content, and the privacy-preserving nature of the application. Users
                are encouraged to review the policy regularly for updates.</p>
        </template>
    </Feature>
</template>
<script setup lang="ts">
import { PrivacyPage } from '~/utils/pages/uncategorized';
usePageInfo(PrivacyPage)
</script>