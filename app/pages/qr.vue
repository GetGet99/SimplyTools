<template>
    <Feature category="none" tool="QRCode" class="flex justify-center">
        <Flex column class="bg-control-primary border-border-control-primary w-fit p-4 rounded-2 gap-3 lg:flex-row">
            <Flex column class="gap-2">
                <div>QR Code Content</div>
                <TextBox multiline class="w-min-100" v-model="value" placeholder="Add text or link here!" />
                <Grid :columns="2" class="gap-2 justify-center items-center">
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
                </Grid>
            </Flex>
            <Flex column class="gap-2">
                <Flex>
                    <div>Preview</div>
                    <Grow />
                    <ToggleSwitch v-model="constraint">
                        Constrain Size Preview
                    </ToggleSwitch>
                </Flex>
                <QRCodeRenderer ref="qrCode" class="rounded-2 border border-control-strong"
                    :class="constraint ? 'w-100 h-100' : ''" alt="" :value :mode :foreground :background :size
                    :padding />
                <Flex class="gap-2">
                    <Grow />
                    <Button @click="downloadQr" title="Download" class="pl-1.5 flex gap-1">
                        <IconArrowDownload alt="" />
                        Download
                    </Button>
                    <Button @click="copyQrData" class="pl-1.5 flex gap-1" title="Copy Source">
                        <IconCopy alt="Copy" />
                        Data URL
                    </Button>
                    <Button v-if="mode === 'svg'" @click="copyQr" class="pl-1.5 flex gap-1" title="Copy Source">
                        <IconCopy alt="Copy" />
                        Source
                    </Button>
                    <Button v-if="mode === 'img'" @click="copyQr" class="pl-1.5 flex gap-1" title="Copy Source">
                        <IconCopy alt="Copy" />
                        Image
                    </Button>
                </Flex>
            </Flex>
        </Flex>
        <template #summary>
            Generate QR codes from text or links.
        </template>
        <template #details>
            <p>This tool allows you to create QR codes easily by entering text or links. Customize the appearance of
                your QR code by adjusting the foreground and background colors, padding, and size. You can choose to
                generate the QR code as a PNG image or an SVG file. Once generated, you can download the QR code or copy
                it directly to your clipboard for easy sharing.</p>
        </template>
    </Feature>
</template>
<script setup lang="ts">
setPageInfo(Uncategorized.pages.find(x => x.path === 'qr'))
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