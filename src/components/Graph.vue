<template>
  <div>
    <canvas :id="graphId"></canvas>
  </div>
</template>

<script>
import Chart from "chart.js/auto";
import _ from "lodash";

export default {
  name: "Graph",
  props: {
    chartData: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    graph: null
  }),
  watch: {
    chartData: {
      deep: true,
      handler(newData) {
        this.drawGraph(newData);
      }
    }
  },
  computed: {
    graphId() {
      return `order-chart-${_.uniqueId()}`;
    }
  },
  mounted() {
    this.drawGraph();
  },
  methods: {
    async drawGraph(copyData = []) {
      const data = JSON.parse(JSON.stringify(copyData));
      const ctx = document.getElementById(this.graphId);

      if (this.graph) {
        this.graph.destroy();
      }

      if (!data?.incomingOrders?.length) {
        return;
      }

      const labels = data?.incomingOrders?.map((d, i) => ++i);

      this.graph = await new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Ienākošie pasūtijumi",
              data: data.incomingOrders,
              borderColor: "rgba(54,73,93,.5)",
              borderWidth: 3
            },
            {
              label: "Pasūtīts",
              data: data.ordered,
              borderColor: "rgba(71, 183,132,.5",
              borderWidth: 3,
              type: "bar"
            },
            {
              label: "Krājumi",
              data: data.stock,
              borderColor: "rgba(255, 165, 0,.5)",
              borderWidth: 3
            },
            {
              label: "Atpakaļsūtijumi",
              data: data.backlog,
              borderColor: "rgba(255, 99, 71,.5)",
              borderWidth: 3
            },
            {
              label: "Ienākošā piegāde",
              data: data.incomingChainDelivery,
              borderColor: "rgba(100, 150, 200, .5)",
              borderWidth: 3,
              type: "bar"
            }
          ]
        },
        options: {
          responsive: true,
          fill: false,
          scales: {
            y: {
              suggestedMin: -5
            }
          }
        }
      });
    }
  }
};
</script>
