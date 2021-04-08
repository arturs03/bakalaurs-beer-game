<template>
    <div class="container">
        <h2 class="mb-3">Manufacturer</h2>
        <div class="row">
            <div class="col-12 col-sm-6 mb-4">
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
            <div class="col-12 col-sm-6 mb-4">
                <div class="input-group input-group-lg">
                    <div class="input-group-prepend">
                        <span class="input-group-text"
                            >Preču ražošanas daudzums</span
                        >
                    </div>
                    <input
                        v-model="quantityToManufacture"
                        type="text"
                        class="form-control"
                        aria-label="Preču ražošanas daudzums"
                    />
                </div>
            </div>
            <div class="col-12 col-sm-6 mb-4">
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
            <div class="col-12 col-sm-6 mb-4">
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
        <div class="col-6">Stock: {{ stock }}</div>
        <div class="col-6">Backlog: {{ backlogOrders }}</div>
        <button
            type="button"
            class="btn btn-primary btn-lg btn-block"
            @click="manufacture()"
        >
            Sākt ražošanu
        </button>
        <graph />
    </div>
</template>
<script>
export default {
    name: "Manufacturer",
    components: {
        Graph: () => import("@/components/Graph.vue"),
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
            },
            chartData: {
                labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
                datasets: [
                    {
                        label: "# of Votes",
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                            "rgba(153, 102, 255, 0.2)",
                            "rgba(255, 159, 64, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 159, 64, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
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
        },
    },
};
</script>
