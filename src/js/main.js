import { TalentCalculatorModel } from './model.js';
import { TalentCalculatorView } from './view.js';
import { TalentCalculatorController } from './controller.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new TalentCalculatorModel();
    const view = new TalentCalculatorView();
    new TalentCalculatorController(model, view);
});