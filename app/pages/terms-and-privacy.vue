<template>
    <Feature category="none" tool="Terms of service and Privacy Policy">
        <div class="font-[system-ui] text-wrap m-4 select-text">
            Latest updated: October 23rd 2025<br />
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

            <h2>Desktop SimplyTools app</h2><br /><br />

            This section only applies if you download the official SimplyTools Desktop app from <OurLink
                href="https://apps.microsoft.com/detail/9MZ975XWMXH5?referrer=appbadge&cid=web">Microsoft Store
            </OurLink>, specifically that link. We cannot guarantee any third party desktop apps or
            distributions, including fake apps, scam or malicious copies. Such third-party or unofficial apps (including
            scams, malware, or modified versions) are not affiliated with SimplyTools and are not covered by this
            privacy policy.<br /><br />

            For Desktop SimplyTools app, we are using WebView2 browser provided by Microsoft. Please check their privacy
            policy for more information.<br /><br />

            If you install SimplyTools from the Microsoft Store, Microsoft Partner Center may collect telemetry and
            usage information related to the app or its installation (for example analytics, diagnostics, crash reports,
            device identifiers, and store-related metadata). These collections are performed by Microsoft and are
            subject to their policies. Please review <OurLink
                href="https://privacy.microsoft.com/en-us/privacystatement">
                Microsoft's privacy statement
            </OurLink> and the Microsoft Store documentation for details on what is collected and how to manage or opt
            out of such data collection.<br /><br />

            As the time of my writing, we can see information including but not limited to the number of page views,
            installs, conversions, installation success rates, and usage statistics for SimplyTools. We may use this
            information to improve the app and our services. Note that this information do not include content you
            input into the app.<br /><br />

            <h2>AI-related tools</h2><br /><br />

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