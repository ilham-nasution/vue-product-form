<script setup lang="ts">
import { onMounted, ref } from "vue";
import useSupabase from "./composables/useSupabase";
import type BrandInterface from "./types/BrandInterface";
import type FormInterface from "./types/FormInterface";

const brands = ref<BrandInterface[] | null>([]);
const forms = ref<FormInterface[] | null>([]);

async function getBrands() {
  const { data } = await useSupabase.from("brands").select();
  brands.value = data;
}

async function getForms() {
  const { data } = await useSupabase.from("forms").select(`*, form_types (
      name
    )`);
  forms.value = data;
}

onMounted(() => {
  getBrands();
  getForms();
});
</script>

<template>
  <div class="container mx-auto px-3">
    <h1 class="text-3xl font-bold">Add Product</h1>

    <form class="mt-5">
      <div v-for="form in forms" :key="form.id" class="mb-2">
        <label v-if="form.form_types?.name === 'textarea'" class="block">
          <span>Description</span>
          <textarea class="mt-1 block w-full" rows="3" />
        </label>

        <label v-else-if="form.form_types?.name === 'select'" class="block">
          <span>Brand</span>
          <select class="block w-full mt-1">
            <option v-for="brand in brands" :key="brand.id">
              {{ brand.name }}
            </option>
          </select>
        </label>

        <div v-else-if="form.form_types?.name === 'radio'">
          <p>{{ form.label }}</p>
          <label class="inline-flex items-center">
            <input type="radio" name="condition" />
            <span class="mx-2">New</span>
          </label>
          <label class="inline-flex items-center">
            <input type="radio" name="condition" />
            <span class="mx-2">Old</span>
          </label>
        </div>

        <label
          v-else-if="form.form_types?.name === 'checkbox'"
          class="inline-flex items-center"
        >
          <input type="checkbox" />
          <span class="ml-2">I agree to the terms and conditions</span>
        </label>

        <label v-else class="block">
          <span>{{ form.label }}</span>
          <input :type="form.form_types?.name" class="mt-1 block w-full" />
        </label>
      </div>

      <div class="text-center">
        <button
          class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full"
        >
          Add Product
        </button>
      </div>
    </form>
  </div>
</template>
