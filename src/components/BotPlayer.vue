<template>
  <div>
    <graph :chart-data="stats" />
    <p>Ienākošais pasūtijums: {{ incomingOrderQty }}</p>
    <p>Kopējās izmaksas: {{ totalCosts }}</p>
    <p>Pasūtīs: {{ quantityToManufacture }}</p>
    <p>Krājumi: {{ stock }}</p>
    <p>Atpakaļsūtijumi: {{ backlogOrders }}</p>
    <p>ROP: {{ orderAgainLevelCalcROP() }}</p>
  </div>
</template>

<script>
import Graph from "@/components/Graph";
import { STOCK_COSTS, processOrder } from "@/common/mixins/processOrder.js";
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
      default: 0,
    }
  },
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
        return 0
      }
      return this.stats.incomingOrders.reduce(((total, num) => total + num)) / this.stats.incomingOrders.length;
    }
  },
  methods: {
    order() {
      this.incomingOrderQty = this.incomingOrder;
      this.incomingChainDelivery = this.incomingDelivery;
      if (
        this.stats.incomingOrders.length &&
        this.stock < this.orderAgainLevelCalcROP()
      ) {
        // Padomat vai sitos divus nesamainit vietam
        this.quantityToManufacture = this.orderCountQ();
      } else {
        this.quantityToManufacture = 0;
      }

      this.moveIncomingDelivery();
      this.deliverAndProcessIncomingOrder();
      this.addToStats();
      setTimeout(() => {
        this.orderButton = true;
      }, 2000);

      const statsCopy = JSON.parse(JSON.stringify(this.stats));
    
      const botInfo =  {
        quantity: this.quantityToManufacture,
        stats: statsCopy
      };

      this.$emit("ordered", botInfo);
    },
    orderCountQ() {
      const Ud = this.incomingOrderAvarage,
        Ch = STOCK_COSTS,
        Co = 2;

      const Q = Math.sqrt((2 * Ud * Co) / Ch);

      return Math.floor(Q);
    },
    orderAgainLevelCalcROP() {
      const Ud = this.incomingOrderAvarage,
        LT = 3,
        z = 1.65;

      const Od = this.standardDeviation(this.stats.incomingOrders);

      const ROP = Ud * LT + z * Od * Math.sqrt(LT);

      return Math.floor(ROP);
    },
    standardDeviation(arr, usePopulation = false) {
      const mean = [...arr].reduce((acc, val) => acc + val, 0) / arr.length;
      console.log(mean);
      return Math.sqrt(
        arr
          .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
          .reduce((acc, val) => acc + val, 0) /
          (arr.length - (usePopulation ? 0 : 1))
      );
    }
  }
};
</script>
