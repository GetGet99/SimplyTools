<script setup lang="ts">
import { Primitive } from 'reka-ui'

defineProps<{
  as?: string
  asChild?: boolean

  columns?: string | number
  rows?: string | number

  smColumns?: string | number
  smRows?: string | number

  mdColumns?: string | number
  mdRows?: string | number

  lgColumns?: string | number
  lgRows?: string | number

  xlColumns?: string | number
  xlRows?: string | number

  xxlColumns?: string | number  // Tailwind calls it `2xl`, but JS identifiers can’t start with a number
  xxlRows?: string | number
}>()

function postProcess(value: string | number | undefined) {
  if (value === undefined) return undefined
  if (typeof value === 'number') return `repeat(${value}, minmax(0, 1fr))`
  return value.replaceAll('grow', 'minmax(0, 1fr)')
}
</script>

<template>
  <Primitive
    :as="as ?? 'div'"
    :as-child="asChild"
    class="grid grid-component"
    :style="{
      '--grid-component-columns': postProcess(columns),
      '--grid-component-rows': postProcess(rows),

      '--grid-component-sm-columns': postProcess(smColumns),
      '--grid-component-sm-rows': postProcess(smRows),

      '--grid-component-md-columns': postProcess(mdColumns),
      '--grid-component-md-rows': postProcess(mdRows),

      '--grid-component-lg-columns': postProcess(lgColumns),
      '--grid-component-lg-rows': postProcess(lgRows),

      '--grid-component-xl-columns': postProcess(xlColumns),
      '--grid-component-xl-rows': postProcess(xlRows),

      '--grid-component-2xl-columns': postProcess(xxlColumns),
      '--grid-component-2xl-rows': postProcess(xxlRows),
    }"
  >
    <slot />
  </Primitive>
</template>
<style lang="css">
@reference '~~/layers/simplytools-ui/app/app.css';

.grid-component {
    --grid-component-columns: initial;
    --grid-component-rows: initial;
    --grid-component-sm-columns: initial;
    --grid-component-sm-rows: initial;
    --grid-component-md-columns: initial;
    --grid-component-md-rows: initial;
    --grid-component-lg-columns: initial;
    --grid-component-lg-rows: initial;
    --grid-component-xl-columns: initial;
    --grid-component-xl-rows: initial;
    --grid-component-2xl-columns: initial;
    --grid-component-2xl-rows: initial;
    grid-template-columns: var(--grid-component-columns, unset);
    grid-template-rows: var(--grid-component-rows, unset);

    @variant sm {
        grid-template-columns: var(--grid-component-sm-columns, var(--grid-component-columns, unset));
        grid-template-rows: var(--grid-component-sm-rows, var(--grid-component-rows, unset));
    }

    @variant md {
        grid-template-columns: var(--grid-component-md-columns, var(--grid-component-sm-columns, var(--grid-component-columns, unset)));
        grid-template-rows: var(--grid-component-md-rows, var(--grid-component-sm-rows, var(--grid-component-rows, unset)));
    }

    @variant lg {
        grid-template-columns: var(--grid-component-lg-columns, var(--grid-component-md-columns, var(--grid-component-sm-columns, var(--grid-component-columns, unset))));
        grid-template-rows: var(--grid-component-lg-rows, var(--grid-component-md-rows, var(--grid-component-sm-rows, var(--grid-component-rows, unset))));
    }

    @variant xl {
        grid-template-columns: var(--grid-component-xl-columns, var(--grid-component-lg-columns, var(--grid-component-md-columns, var(--grid-component-sm-columns, var(--grid-component-columns, unset)))));
        grid-template-rows: var(--grid-component-xl-rows, var(--grid-component-lg-rows, var(--grid-component-md-rows, var(--grid-component-sm-rows, var(--grid-component-rows, unset)))));
    }

    @variant 2xl {
        grid-template-columns: var(--grid-component-2xl-columns, var(--grid-component-xl-columns, var(--grid-component-lg-columns, var(--grid-component-md-columns, var(--grid-component-sm-columns, var(--grid-component-columns, unset))))));
        grid-template-rows: var(--grid-component-2xl-rows, var(--grid-component-xl-rows, var(--grid-component-lg-rows, var(--grid-component-md-rows, var(--grid-component-sm-rows, var(--grid-component-rows, unset))))));
    }
}
</style>