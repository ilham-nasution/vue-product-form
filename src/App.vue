<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import useSupabase from "./composables/useSupabase";
import type BrandInterface from "./types/BrandInterface";
import type FormInterface from "./types/FormInterface";
import FormInput from "./components/FormInput.vue";

const brands = ref<BrandInterface[] | null>([]);
const forms = ref<FormInterface[] | null>([]);
const product_data = reactive({
  name: "",
  price: "",
  description: "",
  img_file: "",
  brand: "",
  condition: "",
});

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

async function handleSubmitProduct() {
  await useSupabase.storage
    .from("products")
    .upload(product_data.name, product_data.img_file[0]);

  const image_url = useSupabase.storage
    .from("products")
    .getPublicUrl(product_data.name);

  const { error } = await useSupabase.from("products").insert([
    {
      img_url: image_url.data.publicUrl,
      name: product_data.name,
      description: product_data.description,
      price: product_data.price,
      brand_id: product_data.brand,
      condition: product_data.condition,
    },
  ]);

  if (error) {
    alert("error creating");
  } else {
    alert("success");
  }
}

onMounted(() => {
  getBrands();
  getForms();
});
</script>

<template>
  <div class="container mx-auto px-3">
    <h1 class="text-3xl font-bold">Add Product</h1>

    <form class="mt-5" @submit.prevent="handleSubmitProduct">
      <div v-for="form in forms" :key="form.id" class="mb-2">
        <FormInput
          :label="form.label"
          :type="form.form_types?.name"
          :brands="brands"
          v-model:name="product_data.name"
          v-model:price="product_data.price"
          v-model:description="product_data.description"
          v-model:img_file="product_data.img_file"
          v-model:brand="product_data.brand"
          v-model:condition="product_data.condition"
        />
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full"
        >
          Add Product
        </button>
      </div>
    </form>
  </div>
</template>
