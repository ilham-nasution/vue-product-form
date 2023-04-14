<script setup lang="ts">
import { onMounted, reactive, ref, computed } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import useSupabase from "./composables/useSupabase";
import type BrandInterface from "./types/BrandInterface";
import type FormInterface from "./types/FormInterface";
import type ProductInterface from "./types/ProductInterface";
import FormInput from "./components/FormInput.vue";
import useCurrencyIDR from "./composables/useCurrencyIDR";

const brands = ref<BrandInterface[] | null>([]);
const forms = ref<FormInterface[] | null>([]);
const products = ref<ProductInterface[] | null>([]);
const loading = ref(false);
const success = ref(false);
const product_data = reactive({
  name: "",
  price: "",
  description: "",
  img_file: "",
  brand: "",
  condition: "",
  term: null,
});

const rules = computed(() => ({
  name: {
    required: helpers.withMessage("Product name cannot be empty", required),
  },
  price: {
    required: helpers.withMessage("Price cannot be empty", required),
  },
  brand: {
    required: helpers.withMessage("Brand cannot be empty", required),
  },
  condition: {
    required: helpers.withMessage("Condition cannot be empty", required),
  },
  term: {
    required: helpers.withMessage(
      "Please check the terms and condition",
      required
    ),
  },
}));

const v$ = useVuelidate(rules, product_data);

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

async function getProducts() {
  const { data } = await useSupabase.from("products").select();
  products.value = data;
}

async function handleSubmitProduct() {
  loading.value = true;
  const valid = await v$.value.$validate();

  if (valid) {
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
      loading.value = false;
      success.value = true;
      getProducts();
    }
  } else {
    loading.value = false;
  }
}

onMounted(() => {
  getBrands();
  getForms();
  getProducts();
});
</script>

<template>
  <div class="container mx-auto px-3 pb-5">
    <h1 class="text-3xl font-bold">Add Product</h1>

    <div
      v-show="success"
      class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-3"
      role="alert"
    >
      <span>Product item successfully created</span>
      <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
        <svg
          class="fill-current h-6 w-6 text-green-500"
          role="button"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <title>Close</title>
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </span>
    </div>

    <div v-for="error of v$.$errors" :key="error.$uid" class="my-3">
      <div
        class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <span>{{ error.$message }}</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg
            class="fill-current h-6 w-6 text-red-500"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path
              d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
            />
          </svg>
        </span>
      </div>
    </div>

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
          v-model:term="product_data.term"
        />
      </div>

      <div class="text-center">
        <button
          type="submit"
          class="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded w-full"
        >
          {{ loading ? "Uploading..." : "Add Product" }}
        </button>
      </div>
    </form>

    <h1 class="text-3xl font-bold mt-5">Product List</h1>

    <div class="grid grid-cols-2 gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="border-2 border-black rounded flex items-center"
      >
        <img :src="product.img_url" :alt="product.name" class="w-20" />
        <div>
          <p>{{ product.name }}</p>
          <p>{{ useCurrencyIDR(product.price) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
