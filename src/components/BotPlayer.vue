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
    },
    currentTurn: {
      type: Number,
      required: true
    },
    position: {
      type: Number,
      required: true
    }
  },
  data: () => ({
    roundOrdered: 0
  }),
  watch: {
    currentTurn(newVal) {
      if (this.position === newVal) {
        this.order();
      }
    }
  },
  computed: {
    totalCosts() {
      return this.stats.costs[this.stats.costs.length - 1];
    },
    lastTenOrders() {
      if (this.stats.incomingOrders?.length > 10) {
        return this.stats.incomingOrders.slice(
          Math.max(this.stats.incomingOrders.length - 10, 0)
        );
      }
      return this.stats.incomingOrders;
    },
    incomingOrderAvarage() {
      if (!this.stats.incomingOrders?.length) {
        return 0;
      }

      return this.lastTenOrders.reduce((total, num) => total + num) / this.lastTenOrders.length;
    },
    orderAgainLevelCalcROP() {
      const Ud = this.incomingOrderAvarage,
        LT = 2,
        z = 1.95;

      const Od = this.standardDeviation(this.lastTenOrders, false);
console.log(Od);
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
        // if (this.roundOrdered <= this.round) {
        this.quantityToManufacture =
          this.orderAgainLevelCalcROP > 30 ? 30 : this.orderAgainLevelCalcROP;
        this.roundOrdered = this.round + LT;
        // } else {
        // this.quantityToManufacture = 0;
        // }
      } else {
        this.quantityToManufacture = 0;
      }

      // if (
      //   this.round > 0 &&
      //   this.incomingOrderQty > this.stats.incomingOrders[this.round - 1]
      // ) {
      //   this.quantityToManufacture =
      //     this.orderAgainLevelCalcROP > 30 ? 30 : this.orderAgainLevelCalcROP;
      // } else {
      //   this.quantityToManufacture = this.incomingOrderQty;
      // }

      // if (this.stock < this.orderAgainLevelCalcROP) {
      //   if (this.roundOrdered <= this.round || !this.roundOrdered) {
      //     this.quantityToManufacture =
      //       this.orderAgainLevelCalcROP > 30 ? 30 : this.orderAgainLevelCalcROP;
      //     this.roundOrdered = this.round + LT;
      //   } else {
      //     if (
      //       this.incomingOrderQty > this.stats.incomingOrders[this.round - 1]
      //     ) {
      //       this.quantityToManufacture =
      //         this.orderAgainLevelCalcROP > 30
      //           ? 30
      //           : this.orderAgainLevelCalcROP;
      //     }

      //     this.quantityToManufacture = this.incomingOrderQty + 1;
      //   }
      // } else {
      //   if (this.round === 1) {
      //     this.quantityToManufacture = this.incomingOrderQty;
      //   } else {
      //     this.quantityToManufacture = 0;
      //   }
      // }
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
