<template>
  <div class="h-full flex flex-col items-center justify-center">
    <img
      alt="Inventory logo"
      src="../assets/logo.svg"
      className="App-logo"
      style="width: 200px; height: 200px"
    />
    <div className="logo-text">Home</div>
  </div>
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "index",
  emits: ["onRedirect", "showLoading", "hideLoading", "alert", "confirm", "confirmInput"],
  setup(props, ctx) {
    return {};
  },
});
</script>
<style lang="scss">
.App-logo {
  height: 40vmin;
  pointer-events: none;
  animation: App-logo-float infinite 3s ease-in-out;
}
@keyframes App-logo-float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
  100% {
    transform: translateY(0px);
  }
}
.logo-text {
  font-family: cursive;
  font-size: 50px;
  color: $themeColor;
  font-weight: bold;
  text-shadow: 3px 4px #87a396;
  animation: textBounceStretch infinite 3s ease-in-out;
}

@keyframes textBounceStretch {
  50% {
    letter-spacing: 5px;
  }
  100% {
    letter-spacing: 0px;
  }
}
</style>
