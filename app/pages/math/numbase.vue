<script setup lang="ts">
import { MathCategory } from '~/utils/pages/math';

usePageInfo(MathCategory.pages.find(x => x.path === 'numbase'))
const value = ref<bigint | undefined>(undefined)
</script>
<template>
    <Feature category="math" tool="Base Converter" class="flex flex-col px-4 sm:items-center gap-8">
        <div class="text-center italic -mt-4">Type the number into one of the box, and it'll automatically convert for
            you!</div>
        <Flex column class="gap-2">
            <div v-for="b in ([16n, 10n, 8n, 2n] as SupportedBaseBigInt[])" :value=b class="space-y-1 sm:min-w-100">
                <Flex class="items-center">
                    <span>
                        {{ b === 16n ? 'Hexadecimal (Base 16)' :
                            (b === 10n ? 'Decimal (Base 10)' :
                                (b === 8n ? 'Octal (Base 8)' :
                                    'Binary (Base 2)')) }}
                    </span>
                </Flex>
                <BigIntBox class="w-full" :placeholder="b === 16n ? 'Hexadecimal (Base 16)' :
                    (b === 10n ? 'Decimal (Base 10)' :
                        (b === 8n ? 'Octal (Base 8)' :
                            'Binary (Base 2)'))" :mode=b v-model="value" />
            </div>
        </Flex>
        <aside class="text-center italic">
            Wanted more advanced stuff like bit shifts and complement representations?<br></br>It might worth to also
            check out our <OurLink href="/dev/progcalc">Programmer Calculator</OurLink>
        </aside>

        <template #summary>
            Convert numbers between decimal, hexadecimal, binary, and octal.
        </template>

        <template #details>
            <p>
                This base converter lets you work across multiple number systems — base 10 (decimal), base 16
                (hexadecimal),
                base 8 (octal), and base 2 (binary). It’s designed for quick conversions.
            </p>
        </template>
    </Feature>
</template>
<style lang="css" scoped>
@reference '~/app.css';
</style>