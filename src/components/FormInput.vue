<script setup lang="ts">
import type BrandInterface from "../types/BrandInterface";

defineProps<{
  label?: string;
  type?: string;
  brands?: BrandInterface[] | null;
  name: string;
  price: string;
  description: string;
  img_file: FileList;
  brand: string;
  condition: string;
}>();
</script>

<template>
  <label v-if="type === 'textarea'" class="block">
    <span>Description</span>
    <textarea
      class="mt-1 block w-full"
      rows="3"
      :value="description"
      @input="
        $emit('update:description', ($event.target as HTMLInputElement).value)
      "
    />
  </label>

  <label v-else-if="type === 'select'" class="block">
    <span>Brand</span>
    <select
      class="block w-full mt-1"
      :value="brand"
      @change="$emit('update:brand', ($event.target as HTMLInputElement).value)"
    >
      <option v-for="brand in brands" :key="brand.id" :value="brand.id">
        {{ brand.name }}
      </option>
    </select>
  </label>

  <div v-else-if="type === 'radio'">
    <p>{{ label }}</p>
    <label class="inline-flex items-center">
      <input
        type="radio"
        name="condition"
        value="new"
        @change="
          $emit('update:condition', ($event.target as HTMLInputElement).value)
        "
      />
      <span class="mx-2">New</span>
    </label>
    <label class="inline-flex items-center">
      <input
        type="radio"
        name="condition"
        value="old"
        @change="
          $emit('update:condition', ($event.target as HTMLInputElement).value)
        "
      />
      <span class="mx-2">Old</span>
    </label>
  </div>

  <label v-else-if="type === 'checkbox'" class="inline-flex items-center">
    <input type="checkbox" />
    <span class="ml-2">I agree to the terms and conditions</span>
  </label>

  <label v-else-if="type === 'number'">
    <span>{{ label }}</span>
    <input
      type="number"
      class="mt-1 block w-full"
      :value="price"
      @input="$emit('update:price', ($event.target as HTMLInputElement).value)"
    />
  </label>

  <label v-else-if="type === 'file'">
    <span>{{ label }}</span>
    <input
      type="file"
      class="mt-1 block w-full"
      @change="
        $emit('update:img_file', ($event.target as HTMLInputElement).files)
      "
    />
  </label>

  <label v-else class="block">
    <span>{{ label }}</span>
    <input
      type="text"
      class="mt-1 block w-full"
      :value="name"
      @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
    />
  </label>
</template>
