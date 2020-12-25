<script lang="ts">
import { chain } from "lodash";
//@ts-ignore
import Quagga from "quagga";

import { defineComponent } from "vue";
import { error } from "./Toast.vue";

let detectedHandler: any;

export default defineComponent({
  name: "ScanIsbn",
  emits: ["cancel", "isbn"],
  setup() {
    return {
      error,
    };
  },
  created() {
    setTimeout(() => {
      Quagga.init(
        {
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector("#camera-view"),
          },
          decoder: {
            readers: ["ean_reader"],
          },
        },
        (err: Error) => {
          if (err) {
            console.log(err);
            console.log("stuff");
            this.error = "Failed to initialize camera";
            return;
          }
          console.log("Initialization finished. Ready to start");
          Quagga.start();

          const codes: string[] = [];

          detectedHandler = (data: { codeResult: { code: string } }) => {
            const isbn = data.codeResult.code;
            codes.push(isbn);
            if (codes.length > 20) {
              console.log(
                "Found code",
                codes.length,
                chain(codes)
                  .countBy()
                  .toPairs()
                  .sortBy((l) => -l[1])
                  .value()[0][0]
              );

              Quagga.offDetected(detectedHandler);
              Quagga.stop();
              this.$emit(
                "isbn",

                chain(codes)
                  .countBy()
                  .toPairs()
                  .sortBy((l) => -l[1])
                  .value()[0][0]
              );
            }
          };

          Quagga.onDetected(detectedHandler);
        }
      );
    });
  },
  beforeUnmount() {
    Quagga.offDetected(detectedHandler);
    Quagga.stop();
  },
});
</script>
<template>
  <div
    class="w-screen h-screen absolute top-0 left-0 bg-gray-200 flex flex-col justify-center align-center z-10"
  >
    <div id="camera-view"></div>
    <div class="flex flex-row justify-center space-x-6 mt-4">
      <button
        class="button bg-gray-100 hover:bg-gray-200"
        @click="$emit('cancel')"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
