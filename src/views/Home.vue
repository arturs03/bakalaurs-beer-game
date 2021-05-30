<template>
  <div class="row">
    <div v-if="hasAccess" class="col-12 col-md-8 offset-md-2">
      <p class="lead">Izvēlies vadības ķēdes posmu:</p>
      <div class="d-flex justify-content-center mb-4">
        <div v-for="(position, k) in positions" :key="k" class="mx-2">
          <button
            class="btn btn-light"
            :disabled="position.disabled"
            :class="{
              disabled: position.disabled,
              active: gameSettings.pickedRole === position
            }"
            @click="gameSettings.pickedRole = position"
          >
            {{ position.label }}
          </button>
        </div>
      </div>

      <template v-if="gameSettings.pickedRole">
        <p class="lead">
          Izvēlies raundu skaitu: {{ gameSettings.roundCount }}
        </p>
        <input
          type="range"
          class="form-control-range mb-4"
          min="1"
          max="50"
          v-model="gameSettings.roundCount"
        />
        <router-link
          :to="{
            name: gameSettings.pickedRole.id,
            params: { gameSettings: JSON.stringify(gameSettings) }
          }"
          class="btn btn-outline-success w-100"
        >
          Sākt spēli
        </router-link>
      </template>
    </div>
    <div v-else class="col-12">
      <p class="lead">Ievadiet paroli, lai piekļūtu pie spēles:</p>
      <input type="text" class="form-control mb-4" v-model="enteredPassword" />
      <p class="lead text-danger">{{ incorrectPasswordMessage }}</p>
      <button class="btn btn-primary btn-lg btn-block" @click="startGame()">
        Piekļūt
      </button>
    </div>
  </div>
</template>

<script>
const oldSecret = "global";

export default {
  name: "Home",
  data: () => ({
    positions: [
      {
        id: "manufacturer",
        label: "Ražotājs",
        disabled: true
      },
      {
        id: "distributer",
        label: "Izplatītājs",
        disabled: true
      },
      {
        id: "wholesaler",
        label: "Vairumtirgotājs",
        disabled: false
      },
      {
        id: "retailer",
        label: "Mazumtirgotājs",
        disabled: true
      }
    ],
    gameSettings: {
      pickedRole: null,
      stockCosts: 1,
      backorderCosts: 2,
      roundCount: 1
    },
    hasAccess: false,
    enteredPassword: null,
    incorrectPasswordMessage: ""
  }),
  mounted() {
    this.hasAccess = JSON.parse(localStorage.getItem("beer-game-access"));
  },
  methods: {
    startGame() {
      if (this.enteredPassword === oldSecret) {
        localStorage.setItem("beer-game-access", true);
        this.hasAccess = true;
        return;
      }

      this.incorrectPasswordMessage = "Nepareizi ievadīta parole!";
    }
  }
};
</script>
