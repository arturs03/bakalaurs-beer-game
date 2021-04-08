<template>
  <div class="p-4">
    <div class="container">
      <h1 class="h1 mb-5">Beer distribution game</h1>
      <h3 class="h3 mb-4 text-center">Izvēlaties savu lomu</h3>
      <div class="d-flex px-2 justify-content-center">
        <div v-for="(position, k) in positions" :key="k" class="links mx-2">
          <router-link :to="'/' + position.id">
          <a
            href="javascript:;"
            class="button--green"
            @click="startGame(position.id)"
          >
            {{ position.label }}
          </a>
          </router-link>
        </div>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      positions: [
        {
          id: 'manufacturer',
          label: 'Ražotājs',
        },
        {
          id: 'wholesaler',
          label: 'Vairumtirgotājs',
        },
        {
          id: 'retailer',
          label: 'Mazumtirgotājs',
        },
        {
          id: 'distributer',
          label: 'Izplatītājs',
        },
      ],
    }
  },
  methods: {
    startGame() {},
  },
}
</script>
