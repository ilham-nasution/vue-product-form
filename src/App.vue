<script setup lang="ts">
import { onMounted, ref } from "vue";
import useSupabase from "./composables/useSupabase";
import type BrandInterface from "./types/BrandInterface";
import type FormInterface from "./types/FormInterface";
import FormInput from "./components/FormInput.vue";

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
        <FormInput
          :label="form.label"
          :type="form.form_types?.name"
          :brands="brands"
        />
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
