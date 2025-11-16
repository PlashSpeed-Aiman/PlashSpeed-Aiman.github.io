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
  <section class="max-w-8xl mx-auto px-6 lg:px-8 py-12 lg:py-16">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center space-y-4 mb-12">
        <h1 class="text-5xl font-bold text-stone-950 tracking-tight">
          QR Code <span class="text-gradient-warm">Generator</span>
        </h1>
        <p class="text-lg text-stone-600">
          Type into the text field to generate a QR code
        </p>
      </div>

      <!-- Input Form -->
      <form @submit.prevent autocomplete="off" class="mb-8">
        <div class="relative">
          <input
            id="qr-input"
            type="text"
            placeholder="Enter text or URL"
            v-model="qrCode"
            class="w-full px-6 py-4 rounded-lg border-2 border-stone-300 bg-white text-stone-950 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 transition-all duration-200 text-lg"
          />
        </div>
      </form>

      <!-- QR Code Display -->
      <transition name="fade">
        <div v-if="qrCode" class="glass rounded-xl p-8 space-y-6 animate-fade-in">
          <div class="flex flex-col items-center gap-6">
            <!-- QR Code Image -->
            <div class="p-4 bg-white rounded-lg shadow-md">
              <img
                :src="qrCodeUrl.url"
                alt="QR Code"
                class="w-64 h-64 object-contain"
              />
            </div>

            <!-- Description -->
            <p class="text-center text-stone-700 font-medium break-all max-w-md">
              {{ qrCodeUrl.description }}
            </p>

            <!-- Download Button -->
            <button
              @click="downloadPng"
              class="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-500 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Download PNG
            </button>
          </div>
        </div>
      </transition>

      <!-- Empty State -->
      <div v-if="!qrCode" class="text-center py-16 text-stone-400">
        <svg class="w-24 h-24 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
        </svg>
        <p class="text-lg">Your QR code will appear here</p>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>