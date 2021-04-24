<template>
    <div>
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
        <graph :chart-data="stats" />
    </div>
</template>

<script>
import Graph from "@/components/Graph";
import { processOrder } from "@/common/mixins/processOrder.js";
export default {
    name: "BotPlayer",
    components: {
        Graph,
    },
    mixins: [processOrder],
    props: {
        incomingOrder: {
            type: Number,
            required: true,
        },
        round: {
            type: Number,
            required: true,
        }
    },
    watch: {
        round() {
            this.order();
        },
    },
    methods: {
        order() {
            // this.$refs.animatedTruck.classList.add("manufacturer-truck");
            // this.orderButton = false;
             this.quantityToManufacture = this.orderCount();
            this.incomingOrderQty = this.incomingOrder;
            this.moveIncomingDelivery();
            this.deliverAndProcessIncomingOrder();
            this.addToStats();
            setTimeout(() => {
                this.orderButton = true;
                // this.$refs.animatedTruck.classList.remove("manufacturer-truck");
                // this.$refs.stockAdded.classList.remove("fade-element");
            }, 2000);
            this.$emit('ordered', this.quantityToManufacture);
        },
        orderCount() {
            return Math.floor(Math.random() * 10);
        },
    },
};
</script>
