<script setup lang="ts">
import * as IconComponents from "~~/layers/fluentui-icons/components-autogen/_barrel";
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
setPageInfo(InDevCategory.pages.find(x => x.path === 'icon-gallery')!)
const components = Object.entries(IconComponents)
components.sort((a, b) => a[0].localeCompare(b[0]));
</script>

<template>
  <Feature class="grid gap-4 overflow-scroll" style="grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));">
    <CardBase>
      <Flex column v-for="[name, Component] in components" :key="name" class="items-center">
        <component :is="Component" />
        <code class="text-xs">&lt;{{ name }} /&gt;</code>
        <Button @click="copyToClipboard(`<${name} />`)">
          <IconCopy alt="Copy" />
        </Button>
      </Flex>
    </CardBase>
  </Feature>
</template>
