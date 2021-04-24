<template>
    <div class="row">
        <div class="col-12 col-md-8 offset-md-2">
            <p class="lead">Izvēlies vadības ķēdes posmu:</p>
            <div class="d-flex justify-content-center mb-4">
                <div v-for="(position, k) in positions" :key="k" class="mx-2">
                    <button
                        class="btn btn-light"
                        :disabled="position.disabled"
                        :class="{
                            disabled: position.disabled,
                            active: gameSettings.pickedRole === position,
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
                        params: { gameSettings: JSON.stringify(gameSettings) },
                    }"
                    class="btn btn-outline-success w-100"
                >
                    Sākt spēli
                </router-link>
            </template>
        </div>
    </div>
</template>

<script>
export default {
    name: "Home",
    data: () => ({
        positions: [
            {
                id: "manufacturer",
                label: "Ražotājs",
                disabled: true,
            },
            {
                id: "distributer",
                label: "Izplatītājs",
                disabled: true,
            },
            {
                id: "wholesaler",
                label: "Vairumtirgotājs",
                disabled: false,
            },
            {
                id: "retailer",
                label: "Mazumtirgotājs",
                disabled: true,
            },
        ],
        gameSettings: {
            pickedRole: null,
            roundCount: 1,
        },
    }),
    methods: {
        startGame() {},
    },
};
</script>
``
