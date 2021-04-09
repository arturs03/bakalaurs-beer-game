<template>
    <div class="p-4">
        <div class="container">
            <div class="row border-bottom align-items-center pb-4 mb-5">
                <div class="col-12 col-md-6">
                    <h1 class="h3">
                        Beer distribution game
                    </h1>
                </div>
                <div class="col-12 col-md-6 d-flex justify-content-end">
                    <div
                        v-for="(position, k) in positions"
                        :key="k"
                        class="btn btn-light mx-2"
                    >
                        <router-link :to="'/' + position.id">
                            <a
                                href="javascript:;"
                                class="text-dark"
                                @click="startGame(position.id)"
                            >
                                {{ position.label }}
                            </a>
                        </router-link>
                    </div>
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
                    id: "manufacturer",
                    label: "Ražotājs",
                },
                {
                    id: "wholesaler",
                    label: "Vairumtirgotājs",
                },
                {
                    id: "retailer",
                    label: "Mazumtirgotājs",
                },
                {
                    id: "distributer",
                    label: "Izplatītājs",
                },
            ],
        };
    },
    methods: {
        startGame() {},
    },
};
</script>
