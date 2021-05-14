<template>
  <div>
    <router-link
      v-if="!parsedGameSettings"
      :to="{ name: 'home' }"
      class="btn btn-outline-danger"
    >
      Uz sākumlapu
    </router-link>
    <template v-else>
      <div class="d-flex">
        <router-link :to="{ name: 'home' }" class="btn btn-outline-danger mr-5">
          Beigt spēli
        </router-link>
        <div class="custom-control custom-switch">
          <input
            type="checkbox"
            class="custom-control-input"
            v-model="showOtherPlayers"
            id="otherPlayerVisabilitySwitcher"
          />
          <label
            class="custom-control-label"
            for="otherPlayerVisabilitySwitcher"
          >
            Rādīt citu spēlētāju spēles stāvokļus
          </label>
        </div>
      </div>
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
            <img src="@/assets/warehouse.png" class="ml-auto" height="60" />
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
              v-model.number="quantityToOrder"
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
      <p
        v-if="currentRound === parseInt(parsedGameSettings.roundCount - 1)"
        class="text-danger lead"
      >
        Pēdējā nedēļa
      </p>
      <button
        v-if="currentRound !== parseInt(parsedGameSettings.roundCount)"
        type="button"
        class="btn btn-primary btn-lg btn-block mb-5"
        :class="{ disabled: !isOrderButtonEnabled }"
        :disabled="
          !isOrderButtonEnabled ||
            currentRound === parseInt(parsedGameSettings.roundCount)
        "
        @click="order()"
      >
        Pasūtīt
      </button>
      <router-link
        v-else
        :to="{
          name: 'results',
          params: {
            gameResults: gameResults(),
            roundCount: parsedGameSettings.roundCount
          }
        }"
        class="btn btn-outline-success w-100 mb-5"
      >
        Apskatīt rezultātus
      </router-link>

      <h2 class="text-center mb-4">Spēlētāja stāvokļu grafiks</h2>
      <graph v-show="currentRound > 0" :chart-data="stats" />
      <div v-show="showOtherPlayers" class="row">
        <div class="col-12 col-md-4">
          <p class="lead">
            Mazumtirgotājs
          </p>
          <BotPlayer
            :incomingOrder="customerOrdered"
            :round="currentRound"
            :incomingDelivery="retailerIncomingDelivery"
            @ordered="retailerOrdered"
            @deliver="retailerDeliver"
          />
        </div>
        <div class="col-12 col-md-4">
          <p class="lead">
            Izplatītājs
          </p>
          <BotPlayer
            :incomingOrder="wholesaler.quantity"
            :round="currentRound"
            :incomingDelivery="distributorIncomingDelivery"
            @ordered="distributorOrdered"
            @deliver="distributorDeliver"
          />
        </div>
        <div class="col-12 col-md-4">
          <p class="lead">
            Ražotājs
          </p>
          <BotPlayer
            :incomingOrder="distributor.quantity"
            :round="currentRound"
            :incomingDelivery="manufacturerIncomingDelivery"
            @ordered="manufacturerOrdered"
            @deliver="manufacturerDeliver"
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
    BotPlayer
  },
  mixins: [processOrder],
  props: {
    gameSettings: {
      requried: true
    },
    incomingOrder: {
      requried: true,
      type: Number,
      default: 0
    }
  },
  data: () => ({
    isOrderButtonEnabled: true,
    currentRound: 0,
    manufacturer: {
      quantity: 0,
      stats: []
    },
    distributor: {
      quantity: 0,
      stats: []
    },
    wholesaler: {
      quantity: 0,
      stats: []
    },
    retailer: {
      quantity: 0,
      stats: []
    },
    manufacturerIncomingDelivery: 0,
    distributorIncomingDelivery: 0,
    wholesalerIncomingDelivery: 0,
    retailerIncomingDelivery: 0,
    customerOrdered: 0,
    showOtherPlayers: true,
    incomingOrderPatternArray: [],
    quantityToOrder: 0
  }),
  computed: {
    parsedGameSettings() {
      return JSON.parse(this.gameSettings) ?? null;
    }
  },
  mounted() {
    this.incomingOrderPatternArray = this.generateStandartIncomingOrderQty();
  },
  methods: {
    order() {
      this.isOrderButtonEnabled = false;
      this.wholesaler.quantity = this.quantityToOrder;
      this.incomingDelivery = this.quantityToOrder;

      this.incomingOrderQty = this.retailer.quantity;
      this.incomingChainDelivery = this.wholesalerIncomingDelivery;
      this.customerOrdered = this.getCustomerIncomingOrderQty();
      this.moveIncomingDelivery();
      this.deliverAndProcessIncomingOrder();
      this.addToStats();
      setTimeout(() => {
        this.isOrderButtonEnabled = true;
      }, 2000);
      this.wholesaler.stats = this.stats;
      this.currentRound += 1;
    },
    getCustomerIncomingOrderQty() {
      return this.incomingOrderPatternArray[this.currentRound];
    },
    generateStandartIncomingOrderQty() {
      const min = 4,
        max = 8;

      const prepparedArray = [];
      for (let i = 0; i < this.parsedGameSettings.roundCount; i++) {
        if (i < this.parsedGameSettings.roundCount / 3) {
          prepparedArray.push(min);
        } else {
          prepparedArray.push(max);
        }
      }
      return prepparedArray;
    },
    manufacturerOrdered(data) {
      this.manufacturer = Object.assign({}, data);
      this.manufacturerIncomingDelivery = this.manufacturer.quantity;
    },
    manufacturerDeliver(data) {
      this.distributorIncomingDelivery = data;
    },
    distributorOrdered(data) {
      this.distributor = Object.assign({}, data);
    },
    distributorDeliver(data) {
      this.wholesalerIncomingDelivery = data;
    },
    retailerOrdered(data) {
      console.log(data);
      this.retailer = Object.assign({}, data);
    },
    retailerDeliver(data) {
      this.retailerIncomingDelivery = data;
    },
    gameResults() {
      return JSON.stringify({
        retailer: {
          title: "Mazumtirgotājs",
          stats: this.retailer.stats
        },
        wholesaler: {
          title: "Vairumtirgotājs",
          stats: this.stats
        },
        distributor: {
          title: "Izplatītājs",
          stats: this.distributor.stats
        },
        manufacturer: {
          title: "Ražotājs",
          stats: this.manufacturer.stats
        }
      });
    }
  }
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
