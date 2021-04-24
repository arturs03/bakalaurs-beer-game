<template>
    <div>
        <router-link
            v-if="!parsedGameSettings"
            :to="{ name: 'home' }"
            class="btn btn-outline-danger"
            @click="resetGameState()"
        >
            Uz sākumlapu
        </router-link>
        <template v-else>
            <router-link
                :to="{ name: 'home' }"
                class="btn btn-outline-danger"
                @click="resetGameState()"
            >
                Beigt spēli
            </router-link>
            <h2 class="mb-3 text-center">
                {{ parsedGameSettings.pickedRole.label }}
            </h2>
            <p class="mb-2 blockquote text-center">
                Raunds {{ currentRound }}/{{ parsedGameSettings.roundCount }}
            </p>

            <div class="row align-items-center mb-4">
                <div class="col-12">
                    <div class="d-flex align-items-baseline w-100">
                        <img src="@/assets/warehouse.png" height="60" />
                        <img
                            src="@/assets/truck.png"
                            class="pb-2"
                            height="30"
                            ref="animatedTruck"
                        />
                        <img
                            src="@/assets/warehouse.png"
                            class="ml-auto"
                            height="60"
                        />
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-12 col-md-6 mb-4">
                    <div class="input-group input-group-lg">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                Ienākošais pasūtijuma lielums
                            </span>
                        </div>
                        <input
                            v-model="incomingOrderQty"
                            type="text"
                            class="form-control disabled"
                            aria-label="Ienākošais pasūtijuma lielums"
                            disabled
                        />
                    </div>
                </div>
                <div class="col-12 col-md-6 mb-4">
                    <div class="input-group input-group-lg">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                Preču sūtīšanas daudzums
                            </span>
                        </div>
                        <input
                            v-model.number="quantityToManufacture"
                            type="text"
                            class="form-control"
                            aria-label="Preču ražošanas daudzums"
                        />
                    </div>
                </div>
                <div class="col-12 col-md-6 mb-4">
                    <div class="input-group input-group-lg">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                1. preču ražošanas solis
                            </span>
                        </div>
                        <input
                            v-model="firstManufactureStep"
                            type="text"
                            class="form-control disabled"
                            aria-label="1. preču ražošanas solis"
                            disabled
                        />
                    </div>
                </div>
                <div class="col-12 col-md-6 mb-4">
                    <div class="input-group input-group-lg">
                        <div class="input-group-prepend">
                            <span class="input-group-text">
                                2. preču ražošanas solis
                            </span>
                        </div>
                        <input
                            v-model="secondManufactureStep"
                            type="text"
                            class="form-control disabled"
                            aria-label="2. preču ražošanas solis"
                            disabled
                        />
                    </div>
                </div>
            </div>
            <div class="row mb-4">
                <div class="col-6 d-flex align-items-center">
                    <img src="@/assets/stock.png" class="mr-2" height="50" />
                    <p class="m-0">Krājumi: {{ stock }}</p>
                    <p
                        class="text-success h6"
                        style="opacity: 0;"
                        ref="stockAdded"
                    >
                        + {{ arrivingManufactureStep }}
                    </p>
                </div>
                <div class="col-6 d-flex align-items-center">
                    <img
                        src="@/assets/out-stock.png"
                        class="mr-2"
                        height="50"
                    />
                    <p class="m-o">Atpakaļsūtijumi: {{ backlogOrders }}</p>
                </div>
            </div>
            <p
                v-if="
                    currentRound === parseInt(parsedGameSettings.roundCount - 1)
                "
                class="text-danger lead"
            >
                Pirms pēdējais raunds
            </p>
            <p
                v-if="currentRound === parseInt(parsedGameSettings.roundCount)"
                class="text-danger lead"
            >
                Pēdējais raunds
            </p>
            <button
                type="button"
                class="btn btn-primary btn-lg btn-block mb-5"
                :class="{ disabled: !orderButton }"
                :disabled="
                    !orderButton ||
                        currentRound === parseInt(parsedGameSettings.roundCount)
                "
                @click="order()"
            >
                Pasūtīt
            </button>
            <h2 class="text-center mb-4">Spēlētāja stāvokļu grafiks</h2>
            <graph v-show="currentRound > 0" :chart-data="stats" />
            <div class="row">
                <div class="col-12 col-md-4">
                    <p class="lead">
                        Ražotājs
                    </p>
                    <BotPlayer
                        :incomingOrder="distributorOrder"
                        :round="currentRound"
                        @ordered="manufacturerOrdered"
                    />
                </div>
                <div class="col-12 col-md-4">
                    <p class="lead">
                        Izplatītājs
                    </p>
                    <BotPlayer
                        :incomingOrder="wholesalerOrder"
                        :round="currentRound"
                        @ordered="distributerOrdered"
                    />
                </div>
                <div class="col-12 col-md-4">
                    <p class="lead">
                        Mazumtirgotājs
                    </p>
                    <BotPlayer
                        :incomingOrder="clientsOrdered"
                        :round="currentRound"
                        @ordered="retailerOrdered"
                    />
                </div>
            </div>
        </template>
    </div>
</template>
<script>
import Graph from "@/components/Graph";
import BotPlayer from "@/components/BotPlayer";
import { processOrder } from "@/common/mixins/processOrder.js";
export default {
    name: "Wholesaler",
    components: {
        Graph,
        BotPlayer,
    },
    mixins: [processOrder],
    props: {
        gameSettings: {
            requried: true,
        },
        incomingOrder: {
            requried: true,
            type: Number,
            default: 0,
        },
    },
    data: () => ({
        orderButton: true,
        currentRound: 0,
        manufacturerOrder: 0,
        distributorOrder: 0,
        wholesalerOrder: 0,
        retailerOrder: 0,
        clientsOrdered: 0,
    }),
    computed: {
        parsedGameSettings() {
            return JSON.parse(this.gameSettings) ?? null;
        },
    },
    methods: {
        order() {
            this.currentRound += 1;
            // this.$refs.animatedTruck.classList.add("manufacturer-truck");
            this.orderButton = false;
            this.wholesalerOrder = this.quantityToManufacture;
            this.clientsOrdered = this.getIncomingOrderQty();
            this.incomingOrderQty = this.retailerOrder;
            this.moveIncomingDelivery();
            this.deliverAndProcessIncomingOrder();
            this.addToStats();
            setTimeout(() => {
                this.orderButton = true;
                // this.$refs.animatedTruck.classList.remove("manufacturer-truck");
                // this.$refs.stockAdded.classList.remove("fade-element");
            }, 2000);
        },
        getIncomingOrderQty() {
            return Math.floor(Math.random() * 10);
        },

        resetGameState() {
            // Object.assign(this.$data, this.$options.data.apply(this));
        },
        manufacturerOrdered(val) {
            this.manufacturerOrder = val;
            return val;
        },
        distributerOrdered(val) {
            this.distributorOrder = val;
            return val;
        },
        retailerOrdered(val) {
            this.retailerOrder = val;
            return val;
        },
    },
};
</script>

<style>
.manufacturer-truck {
    animation: drive 2s;
    position: relative;
}

@keyframes drive {
    0% {
        left: 0;
    }

    90% {
        opacity: 1;
    }

    100% {
        left: calc(100% - 160px);
        opacity: 0;
    }
}

.fade-element {
    animation: fade 2s;
}

@keyframes fade {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>
