<template>
  <div class="flex flex-col items-center justify-center">
    <div class="box mb-4"></div>
    <h1 class="text-2xl text-white font-nothing tracking-[2px]">Loading...</h1>
  </div>
</template>

<style scoped>
.box {
  width: 30px;
  height: 30px;
  background-color: white;
  border: 2px solid black;
  transform-style: preserve-3d;
  transform: rotate(-45deg);
  animation: rotateY 2s linear infinite;
  transform-origin: 50% 50%;
}

@keyframes rotateY {
  0% {
    transform: rotateY(0deg) rotate(-45deg);
  }
  100% {
    transform: rotateY(360deg) rotate(-45deg);
  }
}
</style>
