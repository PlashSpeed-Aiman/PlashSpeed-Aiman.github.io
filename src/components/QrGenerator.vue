<script>
import { ref, watch } from 'vue';

export default {
  name: 'QrCode',
  setup() {
    const qrCode = ref(null);
    const qrCodeUrl = ref({
      url: null,
      description: null,
    });

    const debounce = (func, timeout = 300) => {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    };

    const generateQrCode = debounce(() => {
      if (qrCode.value) {
        qrCodeUrl.value.url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCode.value}`;
        qrCodeUrl.value.description = qrCode.value;
      }
    }, 1000);

    watch(qrCode, () => {
      generateQrCode();
    });

    const downloadPng = () => {
      if (qrCode.value && qrCodeUrl.value.url) {
        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = qrCodeUrl.value.url;
        link.click();
      }
    };

    return {
      qrCode,
      qrCodeUrl,
      downloadPng,
    };
  },
};
</script>

<template>
  <section>
    <div class="mx-10 md:lg:xl:mx-auto md:py-16 lg:flex flex-col items-center">
      <div>
        <h1 class="text-5xl font-bold text-center bg-gradient-to-r from-gray-600 to-amber-600 text-transparent bg-clip-text ">QR Code Utility</h1>
        <p class="text-2xl text-center">Type into the text field to generate a QR code</p>
        <form @submit.prevent autocomplete="off">
          <input
              class="shadow  my-3  rounded-md w-full py-4 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Name"
              v-model="qrCode"
          />
        </form>
        <div v-if="qrCode" class="flex flex-col  justify-center items-center my-2 border border-orange-100 bg-gray-50 p-2 shadow rounded-md">
          <img :src="qrCodeUrl.url" alt="qr code" />
          <p>{{ qrCodeUrl.description }}</p>
          <button @click="downloadPng" class="bg-amber-500 flex items-center justify-center my-1  px-2 py-2 rounded-md ">
            <img class="h-8" src="https://img.icons8.com/pastel-glyph/128/download--v2.png"/>
          </button>

        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>