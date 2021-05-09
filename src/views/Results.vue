<template>
  <div>
    <router-link
      :to="{ name: 'home' }"
      class="btn btn-outline-danger mb-5"
    >
      Beigt rezultātu apskatu
    </router-link>
    <h2>Rezultāti:</h2>
    <p class="my-3">Kopējās izmaksas: {{ totalCosts }}</p>
    <div class="row mb-4">
      <div
        v-for="(chain, index) in parsedGamereResults"
        :key="index"
        class="col-12 col-md-6 col-lg-3"
      >
        <h5>{{ chain.title }}</h5>
        <p>Kopējās izmaksas: {{ chain.stats.costs[roundCount - 1] }}</p>
        <p>Mean: {{ mean(chain.stats.incomingOrders) }}</p>
      </div>
    </div>
    <div class="row">
      <div class="col-12 col-md-6">
        <h5>Krājumi:</h5>
        <result-graph :chart-data="parsedGamereResults" statType="stock" />
      </div>
      <div class="col-12 col-md-6">
        <h5>Izmaksas:</h5>
        <result-graph :chart-data="parsedGamereResults" statType="costs" />
      </div>
      <div class="col-12 col-md-6">
        <h5>Ienākošie pasūtijumi:</h5>
        <result-graph
          :chart-data="parsedGamereResults"
          statType="incomingOrders"
        />
      </div>
      <div class="col-12 col-md-6">
        <h5>Pasūtīts:</h5>
        <result-graph :chart-data="parsedGamereResults" statType="ordered" />
      </div>
    </div>
  </div>
</template>

<script>
import ResultGraph from "@/components/ResultGraph";
export default {
  name: "Results",
  props: {
    gameResults: {
      requried: true
    },
    roundCount: {
      required: true
    }
  },
  components: {
    ResultGraph
  },
  data: () => ({
    totalCosts: 0,
    chartData: []
  }),
  computed: {
    parsedGamereResults() {
      return JSON.parse(this.gameResults) ?? [];
    }
  },
  mounted() {
    this.totalCostsCalc();
    this.chartData = Object.assign({}, this.parsedGamereResults);
  },
  methods: {
    /**
     * @param {Array} orders
     */
    mean(orders) {
      return Math.sqrt(orders.reduce((total, num) => total + num));
    },
    totalCostsCalc() {
      if (!this.parsedGamereResults?.retailer?.stats?.costs) {
        return;
      }
      console.log(this.parsedGamereResults);

      this.totalCosts = 0;
      for (const chain in this.parsedGamereResults) {
        this.totalCosts += this.parsedGamereResults[chain].stats.costs[
          this.roundCount - 1
        ];
      }
    }
  }
};
</script>

<style></style>
