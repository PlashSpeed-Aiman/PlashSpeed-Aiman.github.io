<template>
  <section>
    <div class="mx-10 md:lg:xl:mx-auto md:py-16 lg:flex flex-col items-center">
      <div>
        <h1 class="text-5xl font-bold text-center bg-gradient-to-r from-green-500 to-black text-transparent bg-clip-text">WhatsApp Tool</h1>
        <p class="text-2xl text-center">Type into the text field and press Enter to chat with a person on WhatsApp</p>
        <form @submit.prevent="handleClick" autocomplete="off" class="my-3 flex flex-col">
          <input
              class="shadow rounded-md w-1/2  py-4 px-3 text-gray-700 mx-auto focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Phone Number"
              v-model="phone"
          />
        </form>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'WhatsApp',
  setup() {
    const phone = ref('');

    function handleClick(event) {
      event.preventDefault();
      window.open(`https://wa.me/${phone.value}?text=Hi%20there%20I%20am%20interested%20in%20your%20services`);
    }

    return {
      phone,
      handleClick,
    };
  },
};
</script>

<style scoped>
/* Add any required styles here */
</style>
