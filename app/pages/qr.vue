<template>
    <Feature category="none" tool="QRCode" class="flex justify-center">
        <div
            class="bg-control-primary border-border-control-primary w-fit p-4 rounded-2 flex flex-col gap-3 lg:flex-row">
            <div class="flex flex-col gap-2">
                <div>QR Code Content</div>
                <TextBox multiline class="w-min-100" v-model="value" placeholder="Add text or link here!" />
                <div class="grid grid-cols-2 gap-2 justify-center items-center">
                    <div>Foreground Color</div>
                    <div>Background Color</div>
                    <ColorHexEditorShared v-model="foreground" />
                    <ColorHexEditorShared v-model="background" />
                    <div>Padding</div>
                    <div>QR Size</div>
                    <NumberBox placeholder="Padding" mode="integer_positive" v-model="padding" />
                    <NumberBox placeholder="QR Size" mode="integer_positive" v-model="size" />
                    <div>Image Kind</div>
                    <ComboBox :options="(['img', 'svg'] as const)" v-model="mode">
                        <template v-slot="{ option }">
                            <template v-if="option === 'img'">PNG</template>
                            <template v-if="option === 'svg'">SVG</template>
                        </template>
                    </ComboBox>
                </div>
            </div>
            <div class="flex flex-col gap-2">
                <div class="flex">
                    <div>Preview</div>
                    <div class="grow"></div>
                    <Button :variant="constraint ? 'accent' : 'control'" @click="constraint = !constraint">Constrain
                        Size Preview: {{ constraint ?
                            'On' : 'Off' }}</Button>
                </div>
                <QRCodeRenderer ref="qrCode" class="rounded-2 border border-control-strong"
                    :class="constraint ? 'w-100 h-100' : ''" alt="" :value :mode :foreground :background :size
                    :padding />
                <div class="flex gap-2">
                    <div class="grow"></div>
                    <Button @click="downloadQr" title="Download" class="pl-1.5 flex gap-1">
                        <Icon :icon="DownloadIcon" alt="" />
                        Download
                    </Button>
                    <Button @click="copyQrData" class="pl-1.5 flex gap-1" title="Copy Source">
                        <Icon :icon="CopyIcon" alt="Copy" />
                        Data URL
                    </Button>
                    <Button v-if="mode === 'svg'" @click="copyQr" class="pl-1.5 flex gap-1" title="Copy Source">
                        <Icon :icon="CopyIcon" alt="Copy" />
                        Source
                    </Button>
                    <Button v-if="mode === 'img'" @click="copyQr" class="pl-1.5 flex gap-1" title="Copy Source">
                        <Icon :icon="CopyIcon" alt="Copy" />
                        Image
                    </Button>
                </div>
            </div>
        </div>
    </Feature>
</template>
<script setup lang="ts">
import CopyIcon from '@fluentui/svg-icons/icons/copy_24_regular.svg?raw'
import DownloadIcon from '@fluentui/svg-icons/icons/arrow_download_24_regular.svg?raw'



import { Uncategorized } from '~/utils/pages/uncategorized';
usePageInfo(Uncategorized.pages.find(x => x.path === 'qr'))
const value = ref('Add text or link here!')
const constraint = ref(true)
const foreground = ref('#ffffffff')
const background = ref('#22222200')
const padding = ref(8)
const size = ref(8)
const mode = ref<'img' | 'svg'>('img')
const qrCode = useTemplateRef('qrCode')

function downloadQr() {
    if (!qrCode.value) return;

    const link = document.createElement("a");

    if (mode.value === "img") {
        link.href = qrCode.value.pngData;
        link.download = "qrcode.png";
        link.click();
    } else if (mode.value === "svg") {
        const svgBlob = new Blob([qrCode.value.svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(svgBlob);
        link.href = url;
        link.download = "qrcode.svg";
        link.click();
        URL.revokeObjectURL(url);
    }
}

async function copyQr() {
    if (!qrCode.value) return;

    try {
        if (mode.value === "img") {
            // PNG case (already working)
            const res = await fetch(qrCode.value.pngData);
            const blob = await res.blob();
            const item = new ClipboardItem({ "image/png": blob });
            await navigator.clipboard.write([item]);
        } else if (mode.value === "svg") {
            // const svgBlob = new Blob([qrCode.value.svgData], { type: "image/svg+xml" });
            // const item = new ClipboardItem({ "image/svg+xml": svgBlob });
            // await navigator.clipboard.write([item]);
            await navigator.clipboard.writeText(qrCode.value.svg);
        }
    } catch (err) {
        useToasts().pushError(`Failed to copy QR code: ${err}`);
    }
}

async function copyQrData() {
    if (!qrCode.value) return;

    try {
        if (mode.value === "svg") {
            await navigator.clipboard.writeText(`data:image/svg+xml,${qrCode.value.svg}`);
        } else {
            await navigator.clipboard.writeText(qrCode.value.pngData);
        }
    } catch (err) {
        useToasts().pushError(`Failed to copy QR code: ${err}`);
    }
}

</script>