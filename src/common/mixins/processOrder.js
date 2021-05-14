export const STOCK_COSTS = 0.5;
export const BACKLOG_COSTS = 1;

export const processOrder = {
    data: () => ({
        incomingOrderQty: null,
        quantityToManufacture: null,
        firstManufactureStep: null,
        secondManufactureStep: null,
        arrivingManufactureStep: null,
        stock: 10,
        backlogOrders: 0,
        costs: 0,
        stats: {
            incomingOrders: [],
            ordered: [],
            stock: [],
            backlog: [],
            costs: [],
        },
        incomingChainDelivery: 0,
    }),
    methods: {
        moveIncomingDelivery() {
            if (this.secondManufactureStep !== null) {
                this.arrivingManufactureStep = this.secondManufactureStep;
            }

            if (this.firstManufactureStep !== null) {
                this.secondManufactureStep = this.firstManufactureStep;
            }
            this.firstManufactureStep = this.incomingChainDelivery;
        },
        deliverAndProcessIncomingOrder() {
            let deliver = 0;
            // Processing ordered items to stock
            this.stock += this.arrivingManufactureStep
                ? this.arrivingManufactureStep
                : 0;

            if (this.arrivingManufactureStep) {
                // this.$refs.stockAdded.classList.add("fade-element");
            }

            // Processing order qty.
            // 1. Check backlog, if there are orders then process
            if (this.backlogOrders > 0) {
                const availableOrderDifference =
                    this.stock - this.backlogOrders;

                if (availableOrderDifference >= 0) {
                    deliver = this.backlogOrders;
                    this.backlogOrders = 0;
                } else {
                    deliver = this.stock;
                    this.backlogOrders -= this.stock;
                }

                this.stock = availableOrderDifference;
            }

            // 2. After processing backlog, if there where not enough items to process orders,
            // then incoming and difference add to backlogOrders
            if (this.stock <= 0) {
                this.backlogOrders += this.incomingOrderQty;
                this.stock = 0;
            } else if (this.stock > 0) {
                //3. If there were enough items, then process incoming
                this.stock -= this.incomingOrderQty;
                deliver += this.incomingOrderQty;
                if (this.stock <= 0) {
                    this.backlogOrders += this.stock * -1;
                    deliver -= this.backlogOrders;
                    this.stock = 0;
                }
            }

            this.$emit('deliver', deliver);

            this.calculateCosts();
        },
        calculateCosts() {
            this.costs += this.stock * STOCK_COSTS + this.backlogOrders * BACKLOG_COSTS;
        },
        addToStats() {
            this.stats.incomingOrders.push(this.incomingOrderQty);
            this.stats.ordered.push(this.incomingDelivery);
            this.stats.stock.push(this.stock);
            this.stats.backlog.push(this.backlogOrders);
            this.stats.costs.push(this.costs);
        },
    }
}