<template>
  <div>
    <graph :chart-data="stats" />
    <div class="d-flex">
      <p class="mr-2 text-danger">{{ arrivingManufactureStep }}</p>
      <p class="mr-2 text-warning">{{ secondManufactureStep }}</p>
      <p class="mr-2 text-info">{{ firstManufactureStep }}</p>
    </div>
    <p>Ienākošais pasūtijums: {{ incomingOrderQty }}</p>
    <p>Kopējās izmaksas: {{ totalCosts }}</p>
    <p>Pasūtīs: {{ quantityToManufacture }}</p>
    <p>Krājumi: {{ stock }}</p>
    <p>Atpakaļsūtijumi: {{ backlogOrders }}</p>
    <p>ROP: {{ orderAgainLevelCalcROP }}</p>
  </div>
</template>

<script>
import Graph from "@/components/Graph";
import { processOrder } from "@/common/mixins/processOrder.js";
export default {
  name: "BotPlayer",
  components: {
    Graph
  },
  mixins: [processOrder],
  props: {
    incomingOrder: {
      type: Number,
      required: true
    },
    round: {
      type: Number,
      required: true
    },
    incomingDelivery: {
      type: Number,
      required: false,
      default: 0
    }
  },
  data: () => ({
    roundOrdered: null,
  }),
  watch: {
    round() {
      this.order();
    }
  },
  computed: {
    totalCosts() {
      return this.stats.costs[this.stats.costs.length - 1];
    },
    incomingOrderAvarage() {
      if (!this.stats.incomingOrders.length) {
        return 0;
      }
      return (
        this.stats.incomingOrders.reduce((total, num) => total + num) /
        this.stats.incomingOrders.length
      );
    },
    orderAgainLevelCalcROP() {
      const Ud = this.incomingOrderAvarage,
        LT = 2,
        z = 1.95;

      const Od = this.standardDeviation(this.stats.incomingOrders, false);

      const ROP = Ud * LT + z * Od * Math.sqrt(LT);
      // const ROP = Ud * (LT + 1) * z * Od * Math.sqrt(LT + 1);

      return Math.floor(ROP);
    }
  },
  methods: {
    order() {
      this.incomingOrderQty = this.incomingOrder;
      this.incomingChainDelivery = this.incomingDelivery;
      this.moveIncomingDelivery();
      this.deliverAndProcessIncomingOrder();

      this.orderCountQ();

      this.addToStats();
      // setTimeout(() => {
      //   this.orderButton = true;
      // }, 100);

      const statsCopy = JSON.parse(JSON.stringify(this.stats));

      const botInfo = {
        quantity: this.quantityToManufacture,
        stats: statsCopy
      };

      this.$emit("ordered", botInfo);
    },
    orderCountQ() {
      const LT = 3;

      if (this.stock < this.orderAgainLevelCalcROP) {
        // if (this.incomingOrderQty > this.stats.incomingOrders) {
        //   this.quantityToManufacture =
        //     this.orderAgainLevelCalcROP > 30 ? 30 : this.orderAgainLevelCalcROP;
        // } else {
        //   this.quantityToManufacture = this.incomingOrderQty + 1;
        // }
        if (this.roundOrdered <= this.round || !this.roundOrdered) {
          this.quantityToManufacture = this.orderAgainLevelCalcROP > 30 ? 30 : this.orderAgainLevelCalcROP;
          this.roundOrdered = this.round + LT;
        } else {
            if (this.incomingOrderQty > this.stats.incomingOrders[this.round - 1]) {

              this.quantityToManufacture = this.orderAgainLevelCalcROP > 30 ? 30 : this.orderAgainLevelCalcROP;
            }

            this.quantityToManufacture = this.incomingOrderQty + 1;
        }
      } else {
        // if (this.round === 1) {
        //   this.quantityToManufacture = this.orderAgainLevelCalcROP;
        // } else {
        //   this.quantityToManufacture = 0;
        // }
         this.quantityToManufacture = 0;
      }
    },

    // orderCountQ() {
    //   const Ud = this.incomingOrderAvarage,
    //     Ch = STOCK_COSTS,
    //     Co = 2;

    //   const Q = Math.sqrt((2 * Ud * Co) / Ch);

    //   return Math.floor(Q);
    // },

    standardDeviation(arr, usePopulation = false) {
      const mean = [...arr].reduce((acc, val) => acc + val, 0) / arr.length;
      return Math.sqrt(
        arr
          .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
          .reduce((acc, val) => acc + val, 0) /
          (arr.length - (usePopulation ? 0 : 1)) || 0
      );
    }
  }
};
</script>
