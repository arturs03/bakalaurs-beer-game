<template>
    <div class="container">
        <div class="row align-items-center mb-4">
            <div class="col-12 col-md-3">
                <h2 class="mb-3">Manufacturer</h2>
            </div>
            <div class="col-12 col-md-9">
                <img
                    src="@/assets/truck.png"
                    class="manufacturer-truck"
                    height="50"
                />
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
                        <span class="input-group-text"
                            >1. preču ražošanas solis</span
                        >
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
                        <span class="input-group-text"
                            >2. preču ražošanas solis</span
                        >
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
            </div>
            <div class="col-6 d-flex align-items-center">
                <img src="@/assets/out-stock.png" class="mr-2" height="50" />
                <p class="m-o">Atpakaļsūtijumi: {{ backlogOrders }}</p>
            </div>
        </div>
        <button
            type="button"
            class="btn btn-primary btn-lg btn-block mb-5"
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
            stock: 10,
            backlogOrders: 0,
            stats: {
                incomingOrders: [],
                ordered: [],
                stock: [],
                backlog: [],
            },
        };
    },
    methods: {
        manufacture() {
            this.incomingOrderQty = this.getIncomingOrderQty();
            if (this.firstManufactureStep !== null) {
                this.secondManufactureStep = this.firstManufactureStep;
            }
            this.firstManufactureStep = this.quantityToManufacture;
            this.deliverInomingOrder();
            this.addToStats();
        },
        getIncomingOrderQty() {
            return Math.floor(Math.random() * 50);
        },
        deliverInomingOrder() {
            this.stock = parseInt(this.stock, 10);
            this.stock += this.secondManufactureStep
                ? this.secondManufactureStep
                : 0;
            this.stock -= this.incomingOrderQty;

            if (this.stock < 0) {
                this.backlogOrders += -1 * this.stock;
                this.stock = 0;
            } else if (this.stock > 0) {
                if (this.backlogOrders > this.stock) {
                    const tempBacklogOrders = this.stock;
                    this.stock -= tempBacklogOrders;
                    this.backlogOrders -= tempBacklogOrders;
                } else {
                    this.stock -= this.backlogOrders;
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
    animation: drive 3s;
    position: relative;
}

@keyframes drive {
    from {
        left: 0;
    }

    to {
        left: 80%;
    }
}
</style>
