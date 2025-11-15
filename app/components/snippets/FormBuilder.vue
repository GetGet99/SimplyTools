<template>
    <Flex column class="gap-3 overflow-y-auto">
        <template v-for="(propDef, propName) in properties" :key="propName">
            <div class="flex flex-col gap-1">
                <label class="text-sm font-medium">{{ toReadableName(propName) }}</label>
                <template v-if="getPropComment(propName)">
                    <span class="text-xs text-muted-foreground">{{ getPropComment(propName) }}</span>
                </template>
                
                <!-- Boolean -->
                <ToggleSwitch v-if="propDef === 'boolean' || propDef === true" v-model="formData[propName]" />
                
                <!-- String -->
                <TextBox v-else-if="propDef === 'string'" 
                    v-model="formData[propName]" 
                    :placeholder="`Enter ${toReadableName(propName)}`" />
                
                <!-- Number -->
                <NumberBox v-else-if="propDef === 'number'" 
                    v-model="formData[propName]" 
                    :placeholder="`Enter ${toReadableName(propName)}`"
                    mode="real" />
                
                <!-- String Array -->
                <Flex v-else-if="isStringArray(propDef)" column class="gap-2">
                    <Flex v-for="(item, idx) in (formData[propName] as string[])" :key="idx" class="gap-2 items-center">
                        <TextBox v-model="(formData[propName] as string[])[idx]" 
                            :placeholder="`Item ${idx + 1}`" 
                            class="flex-1" />
                        <Button variant="ghost" icon @click="removeArrayItem(propName, idx)">
                            <Icon :icon="DeleteIcon" alt="Remove" />
                        </Button>
                    </Flex>
                    <Button variant="ghost" @click="addArrayItem(propName)">
                        + Add Item
                    </Button>
                </Flex>
                
                <!-- Array of Objects (like props) -->
                <Flex v-else-if="isObjectArray(propDef)" column class="gap-3 border-l-2 pl-3">
                    <Flex v-for="(item, idx) in (formData[propName] as any[])" :key="idx" column class="gap-2 border rounded p-2">
                        <Flex class="items-center justify-between">
                            <span class="text-sm font-medium">Item {{ idx + 1 }}</span>
                            <Button variant="ghost" icon @click="removeArrayItem(propName, idx)">
                                <Icon :icon="DeleteIcon" alt="Remove" />
                            </Button>
                        </Flex>
                        <template v-for="(nestedPropDef, nestedPropName) in getObjectArraySchema(propDef)" :key="nestedPropName">
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-medium">{{ toReadableName(nestedPropName) }}</label>
                                <template v-if="getNestedPropComment(propName, nestedPropName)">
                                    <span class="text-xs text-muted-foreground">{{ getNestedPropComment(propName, nestedPropName) }}</span>
                                </template>
                                
                                <TextBox v-if="nestedPropDef === 'string'" 
                                    v-model="(formData[propName] as any[])[idx][nestedPropName]" 
                                    :placeholder="`Enter ${toReadableName(nestedPropName)}`" />
                                
                                <NumberBox v-else-if="nestedPropDef === 'number'" 
                                    v-model="(formData[propName] as any[])[idx][nestedPropName]" 
                                    :placeholder="`Enter ${toReadableName(nestedPropName)}`"
                                    mode="real" />
                                
                                <ToggleSwitch v-else-if="nestedPropDef === 'boolean' || nestedPropDef === true" v-model="(formData[propName] as any[])[idx][nestedPropName]" />
                            </div>
                        </template>
                    </Flex>
                    <Button variant="ghost" @click="addObjectArrayItem(propName, getObjectArraySchema(propDef))">
                        + Add Item
                    </Button>
                </Flex>
            </div>
        </template>
    </Flex>
</template>

<script setup lang="ts">
import * as YAML from "yaml";
import DeleteIcon from '@fluentui/svg-icons/icons/delete_24_regular.svg?raw';

const props = defineProps<{
    properties: Record<string, any>
    metaRaw?: any
}>()

const input = defineModel<string>({ required: true })

// Get the properties node from metaRaw for comment extraction
const propertiesNode = computed(() => {
    if (props.metaRaw) {
        try {
            return props.metaRaw.get('properties', true)
        } catch {
            return null
        }
    }
    return null
})

// Form data - reactive object that mirrors the YAML structure
const formData = ref<Record<string, any>>({})
const isUpdatingFromYAML = ref(false)

// Initialize form data from YAML or defaults
function initializeFormData() {
    isUpdatingFromYAML.value = true
    try {
        const parsed = input.value ? YAML.parse(input.value) : {}
        const newFormData: Record<string, any> = {}
        
        for (const [propName, propDef] of Object.entries(props.properties)) {
            if (parsed[propName] !== undefined) {
                newFormData[propName] = parsed[propName]
            } else {
                // Set defaults based on type
                if (propDef === 'boolean' || propDef === true) {
                    newFormData[propName] = false
                } else if (propDef === 'string') {
                    newFormData[propName] = ''
                } else if (propDef === 'number') {
                    newFormData[propName] = undefined
                } else if (isStringArray(propDef)) {
                    newFormData[propName] = []
                } else if (isObjectArray(propDef)) {
                    newFormData[propName] = []
                }
            }
        }
        
        formData.value = newFormData
    } finally {
        isUpdatingFromYAML.value = false
    }
}

// Watch for external YAML changes
watch(input, () => {
    if (!isUpdatingFromYAML.value) {
        initializeFormData()
    }
}, { immediate: true })

// Watch form data changes and update YAML
watch(formData, () => {
    if (!isUpdatingFromYAML.value) {
        updateYAML()
    }
}, { deep: true })

function updateYAML() {
    try {
        // Remove undefined values
        const cleaned = Object.fromEntries(
            Object.entries(formData.value).filter(([_, v]) => v !== undefined)
        )
        const yaml = YAML.stringify(cleaned)
        // Only update if different to prevent loops
        if (yaml !== input.value) {
            input.value = yaml
        }
    } catch (err) {
        console.error('Error generating YAML:', err)
    }
}

function addArrayItem(propName: string) {
    if (!Array.isArray(formData.value[propName])) {
        formData.value[propName] = []
    }
    (formData.value[propName] as string[]).push('')
}

function removeArrayItem(propName: string, index: number) {
    if (Array.isArray(formData.value[propName])) {
        (formData.value[propName] as any[]).splice(index, 1)
    }
}

function addObjectArrayItem(propName: string, objectSchema: Record<string, any>) {
    if (!Array.isArray(formData.value[propName])) {
        formData.value[propName] = []
    }
    const newItem: Record<string, any> = {}
    for (const [nestedPropName, nestedPropDef] of Object.entries(objectSchema)) {
        if (nestedPropDef === 'boolean' || nestedPropDef === true) {
            newItem[nestedPropName] = false
        } else if (nestedPropDef === 'string') {
            newItem[nestedPropName] = ''
        } else if (nestedPropDef === 'number') {
            newItem[nestedPropName] = undefined
        }
    }
    (formData.value[propName] as any[]).push(newItem)
}

function getPropComment(propName: string): string | null {
    if (!propertiesNode.value) return null
    try {
        const propNode = propertiesNode.value.get(propName, true)
        if (propNode && propNode.commentBefore) {
            return propNode.commentBefore.trim().replace(/^#\s*/, '')
        }
    } catch {
        // Property might not exist
    }
    return null
}

function getNestedPropComment(propName: string, nestedPropName: string): string | null {
    if (!propertiesNode.value) return null
    try {
        const propNode = propertiesNode.value.get(propName, true)
        if (propNode && propNode.type === 'MAP') {
            // For object arrays, the schema is the map itself
            const nestedProp = propNode.items?.find((item: any) => item.key?.value === nestedPropName)
            if (nestedProp && nestedProp.value?.commentBefore) {
                return nestedProp.value.commentBefore.trim().replace(/^#\s*/, '')
            }
        }
    } catch {
        // Property might not exist
    }
    return null
}

// Check if propDef represents a string array
function isStringArray(propDef: any): boolean {
    // Check for "string[]" notation or array with string as first element
    return propDef === 'string[]' || 
           (Array.isArray(propDef) && propDef[0] === 'string')
}

// Check if propDef represents an array of objects
function isObjectArray(propDef: any): boolean {
    // If it's an object (not a string type, not an array of primitives), it's an array of objects
    return typeof propDef === 'object' && 
           propDef !== null && 
           !Array.isArray(propDef) &&
           propDef !== 'boolean' &&
           propDef !== 'string' &&
           propDef !== 'number' &&
           propDef !== 'string[]'
}

// Get the schema for an array of objects
function getObjectArraySchema(propDef: any): Record<string, any> {
    // If propDef is already an object schema, return it
    if (typeof propDef === 'object' && !Array.isArray(propDef)) {
        return propDef
    }
    // If it's an array with an object as first element, return that
    if (Array.isArray(propDef) && typeof propDef[0] === 'object') {
        return propDef[0]
    }
    return {}
}

// Convert camelCase/snake_case/PascalCase to readable name
function toReadableName(name: string): string {
    // Handle snake_case: replace underscores with spaces
    let result = name.replace(/_/g, ' ')
    
    // Handle camelCase and PascalCase: insert space before uppercase letters
    // But not if it's already separated or at the start
    result = result.replace(/([a-z])([A-Z])/g, '$1 $2')
    
    // Handle consecutive uppercase letters (like "HTML" or "XML")
    // Insert space between consecutive uppercase followed by lowercase
    result = result.replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    
    // Capitalize first letter of each word
    return result.split(' ').map(word => {
        if (word.length === 0) return word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    }).join(' ')
}
</script>

