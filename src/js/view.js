export class TalentCalculatorView {
    // Initialize view with DOM elements and keyboard navigation
    constructor() {
        this.initializeElements();
        this.initializeKeyboardNavigation();
    }

    // Find and store references to key DOM elements
    initializeElements() {
        this.pointsSpentElement = document.getElementById('pointsSpent');
        this.talentElements = Array.from(document.querySelectorAll('.talent'));
        this.setupErrorContainer();
    }

    // Create error message container
    setupErrorContainer() {
        this.errorContainer = document.createElement('div');
        this.errorContainer.className = 'error-message';
        document.querySelector('.container').appendChild(this.errorContainer);
    }

    // Handle left-click to add talent point
    handleLeftClick(talent, handler) {
        const { pathNum, index } = this.getTalentInfo(talent);
        
        if (talent.disabled) {
            this.showError('You must select talents in order');
            return;
        }
        
        if (talent.classList.contains('selected')) {
            this.showError('Use right-click to remove talents');
            return;
        }

        handler(pathNum, index, 'add');
    }

    // Handle right-click to remove talent point
    handleRightClick(talent, handler, event) {
        event.preventDefault();
        const { pathNum, index } = this.getTalentInfo(talent);
        
        if (!talent.classList.contains('selected')) {
            this.showError('This talent is not selected');
            return;
        }

        handler(pathNum, index, 'remove');
    }

    // Manage keyboard interactions for talents
    handleKeyNavigation(talent, handler, event) {
        const { pathNum, index } = this.getTalentInfo(talent);
        
        const keyActions = {
            'Enter': () => this.handleEnterKey(talent, handler, pathNum, index),
            ' ': () => this.handleEnterKey(talent, handler, pathNum, index),
            'Delete': () => this.handleDeleteKey(talent, handler, pathNum, index),
            'Backspace': () => this.handleDeleteKey(talent, handler, pathNum, index),
            'ArrowRight': () => this.focusAdjacentTalent(talent, 'next'),
            'ArrowLeft': () => this.focusAdjacentTalent(talent, 'prev'),
            'ArrowUp': () => this.focusOtherPathTalent(pathNum, index),
            'ArrowDown': () => this.focusOtherPathTalent(pathNum, index)
        };

        if (keyActions[event.key]) {
            event.preventDefault();
            keyActions[event.key]();
        }
    }

    // Get path and index for a talent
    getTalentInfo(talent) {
        return {
            pathNum: parseInt(talent.closest('.talents').dataset.path),
            index: parseInt(talent.dataset.index)
        };
    }

    // Move focus to adjacent talent
    focusAdjacentTalent(talent, direction) {
        const adjacentTalent = direction === 'next' ? 
            talent.nextElementSibling : 
            talent.previousElementSibling;
        if (adjacentTalent) adjacentTalent.focus();
    }

    // Move focus to talent in other path
    focusOtherPathTalent(currentPath, index) {
        const otherPathNum = currentPath === 1 ? 2 : 1;
        const otherPath = document.querySelector(`[data-path="${otherPathNum}"]`);
        const sameTalentOtherPath = otherPath.querySelector(`[data-index="${index}"]`);
        if (sameTalentOtherPath) sameTalentOtherPath.focus();
    }

    // Handle talent selection via Enter key
    handleEnterKey(talent, handler, pathNum, index) {
        if (!talent.disabled && !talent.classList.contains('selected')) {
            handler(pathNum, index, 'add');
        }
    }

    // Handle talent deselection via Delete/Backspace key
    handleDeleteKey(talent, handler, pathNum, index) {
        if (talent.classList.contains('selected')) {
            handler(pathNum, index, 'remove');
        }
    }

    // Show temporary error message
    showError(message, duration = 3000) {
        this.errorContainer.textContent = message;
        this.errorContainer.classList.add('show');
        setTimeout(() => this.errorContainer.classList.remove('show'), duration);
    }

    // Set up keyboard accessibility for talents
    initializeKeyboardNavigation() {
        this.talentElements.forEach(talent => {
            talent.setAttribute('role', 'button');
            talent.setAttribute('tabindex', '0');
            talent.setAttribute('aria-label', `${talent.className.split(' ')[1]} talent`);
        });
    }

    // Attach event listeners to talents
    bindTalentClick(handler) {
        this.talentElements.forEach(talent => {
            talent.addEventListener('click', (e) => this.handleLeftClick(talent, handler));
            talent.addEventListener('contextmenu', (e) => this.handleRightClick(talent, handler, e));
            talent.addEventListener('keydown', (e) => this.handleKeyNavigation(talent, handler, e));
        });
    }

    // Update view based on current state
    update(state) {
        this.updatePointsDisplay(state);
        this.updateTalents(state);
    }

    // Update points spent display
    updatePointsDisplay(state) {
        this.pointsSpentElement.textContent = `${state.totalPoints}/${state.maxPoints}`;
    }

    // Update talents visual state
    updateTalents(state) {
        this.talentElements.forEach(talent => {
            const { pathNum, index } = this.getTalentInfo(talent);
            const pathPoints = pathNum === 1 ? state.path1Points : state.path2Points;
            
            const isSelected = pathPoints[index];
            const isDisabled = this.calculateDisabledState(state, pathPoints, index);
            
            this.updateTalentState(talent, isSelected, isDisabled, state);
        });
    }

    // Determine if talent should be disabled
    calculateDisabledState(state, pathPoints, index) {
        return (state.totalPoints >= state.maxPoints && !pathPoints[index]) ||
               (index > 0 && !pathPoints[index - 1]);
    }

    // Update individual talent state
    updateTalentState(talent, isSelected, isDisabled, state) {
        talent.classList.toggle('selected', isSelected);
        talent.disabled = isDisabled;
        talent.classList.toggle('max-points-disabled', 
            state.totalPoints >= state.maxPoints && !isSelected);
        
        talent.setAttribute('aria-selected', isSelected);
        talent.setAttribute('aria-disabled', isDisabled);
    }
}