export class TalentCalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // Bind view event handlers
        this.view.bindTalentClick(this.handleTalentClick.bind(this));

        // Subscribe to model updates
        this.model.subscribe(this.handleModelUpdate.bind(this));

        // Initial render
        this.handleModelUpdate(this.model.getState());
    }

    handleTalentClick(pathNum, index) {
        this.model.togglePoint(pathNum, index);
    }

    handleModelUpdate(state) {
        this.view.update(state);
    }
}