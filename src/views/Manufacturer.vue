<template>
    <div class="container">
        <h2 class="mb-3 text-center">Raožotājs</h2>
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
                        <span class="input-group-text"
                            >Ienākošais pasūtijuma lielums</span
                        >
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
                        <span class="input-group-text"
                            >Preču ražošanas daudzums</span
                        >
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
                <p class="text-success h6" style="opacity: 0;" ref="stockAdded">
                    + {{ arrivingManufactureStep }}
                </p>
            </div>
            <div class="col-6 d-flex align-items-center">
                <img src="@/assets/out-stock.png" class="mr-2" height="50" />
                <p class="m-o">Atpakaļsūtijumi: {{ backlogOrders }}</p>
            </div>
        </div>
        <button
            type="button"
            class="btn btn-primary btn-lg btn-block mb-5"
            :class="{ disabled: !orderButton }"
            :disabled="!orderButton"
            @click="manufacture()"
        >
            Sākt ražošanu
        </button>
        <graph :chart-data="stats" />
    </div>
</template>
<script>
import Graph from "@/components/Graph";

export default {
    name: "Manufacturer",
    components: {
        Graph,
    },
    props: {
        incomingOrder: {
            requried: true,
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            incomingOrderQty: null,
            quantityToManufacture: null,
            firstManufactureStep: null,
            secondManufactureStep: null,
            arrivingManufactureStep: null,
            stock: 10,
            backlogOrders: 0,
            stats: {
                incomingOrders: [],
                ordered: [],
                stock: [],
                backlog: [],
            },
            orderButton: true,
        };
    },
    methods: {
        manufacture() {
            this.$refs.animatedTruck.classList.add("manufacturer-truck");
            this.orderButton = false;
            this.incomingOrderQty = this.getIncomingOrderQty();
            this.moveIncomingDelivery();
            this.deliverAndProcessIncomingOrder();
            this.addToStats();
            setTimeout(() => {
                this.orderButton = true;
                this.$refs.animatedTruck.classList.remove("manufacturer-truck");
                this.$refs.stockAdded.classList.remove("fade-element");
            }, 2000);
        },
        getIncomingOrderQty() {
            return Math.floor(Math.random() * 10);
        },
        moveIncomingDelivery() {
            if (this.secondManufactureStep !== null) {
                this.arrivingManufactureStep = this.secondManufactureStep;
            }

            if (this.firstManufactureStep !== null) {
                this.secondManufactureStep = this.firstManufactureStep;
            }
            this.firstManufactureStep = this.quantityToManufacture;

        },
        deliverAndProcessIncomingOrder() {
            // Processing ordered items to stock
            this.stock += this.arrivingManufactureStep
                ? this.arrivingManufactureStep
                : 0;

            if (this.arrivingManufactureStep) {
                this.$refs.stockAdded.classList.add("fade-element");
            }

            // Processing order qty.
            // 1. Check backlog, if there are orders then process
            if (this.backlogOrders > 0) {
                const availableOrderDifference = this.stock - this.backlogOrders;

                if (availableOrderDifference >= 0) {
                    this.backlogOrders = 0;
                } else {
                    this.backlogOrders -= this.stock;
                }

                this.stock = availableOrderDifference;
            }

            // 2. After processing backlog, if there where not enough items to process orders, 
            // then incoming and difference add to backlogOrders
            if (this.stock <= 0) {
                this.backlogOrders += this.incomingOrderQty;
                this.stock = 0;
            } else if (this.stock > 0) {   //3. If there were enough items, then process incoming 
                this.stock -= this.incomingOrderQty;
                if (this.stock <= 0) {
                    this.backlogOrders += (this.stock * -1);
                    this.stock = 0;
                }
            }
        },
        addToStats() {
            this.stats.incomingOrders.push(this.incomingOrderQty);
            this.stats.ordered.push(this.quantityToManufacture);
            this.stats.stock.push(this.stock);
            this.stats.backlog.push(this.backlogOrders);
        },
    },
};
</script>

<style scoped>
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
