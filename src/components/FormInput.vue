<script setup lang="ts">
import type BrandInterface from "./types/BrandInterface";

defineProps<{
  label?: string;
  type?: string;
  brands?: BrandInterface[] | null;
}>();
</script>

<template>
  <label v-if="type === 'textarea'" class="block">
    <span>Description</span>
    <textarea class="mt-1 block w-full" rows="3" />
  </label>

  <label v-else-if="type === 'select'" class="block">
    <span>Brand</span>
    <select class="block w-full mt-1">
      <option v-for="brand in brands" :key="brand.id">
        {{ brand.name }}
      </option>
    </select>
  </label>

  <div v-else-if="type === 'radio'">
    <p>{{ label }}</p>
    <label class="inline-flex items-center">
      <input type="radio" name="condition" />
      <span class="mx-2">New</span>
    </label>
    <label class="inline-flex items-center">
      <input type="radio" name="condition" />
      <span class="mx-2">Old</span>
    </label>
  </div>

  <label v-else-if="type === 'checkbox'" class="inline-flex items-center">
    <input type="checkbox" />
    <span class="ml-2">I agree to the terms and conditions</span>
  </label>

  <label v-else class="block">
    <span>{{ label }}</span>
    <input :type="type" class="mt-1 block w-full" />
  </label>
</template>
