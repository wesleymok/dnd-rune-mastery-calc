export class TalentCalculatorModel {
    // Initialize the talent calculator with empty paths and configuration
    constructor() {
        // Arrays to track selected talents in each path
        this.path1Points = Array(4).fill(false);
        this.path2Points = Array(4).fill(false);
        
        // Maximum number of points that can be allocated
        this.maxPoints = 6;
        
        // Set of subscriber callbacks to notify on state changes
        this.subscribers = new Set();
    }

    // Add a callback to be notified of state changes
    subscribe(callback) {
        this.subscribers.add(callback);
    }

    // Remove a previously added callback
    unsubscribe(callback) {
        this.subscribers.delete(callback);
    }

    // Notify all subscribers with the current state
    notify() {
        this.subscribers.forEach(callback => callback(this.getState()));
    }

    // Get a snapshot of the current model state
    getState() {
        return {
            path1Points: [...this.path1Points],
            path2Points: [...this.path2Points],
            totalPoints: this.getTotalPoints(),
            maxPoints: this.maxPoints
        };
    }

    // Calculate the total number of allocated points across both paths
    getTotalPoints() {
        return [...this.path1Points, ...this.path2Points].filter(Boolean).length;
    }

    // Retrieve the points array for a specific path
    getPathPoints(pathNum) {
        return pathNum === 1 ? this.path1Points : this.path2Points;
    }

    // Validate and set a point in a specific path
    setPathPoint(pathNum, index, value) {
        const pathPoints = this.getPathPoints(pathNum);
        
        if (value) {
            // Rules for adding a point
            // Prevent adding points if max points reached
            if (this.getTotalPoints() >= this.maxPoints) return false;
            
            // Enforce sequential point selection
            // Cannot select a point if previous points are not selected
            for (let i = 0; i < index; i++) {
                if (!pathPoints[i]) return false;
            }
        } else {
            // Rules for removing a point
            // Cannot remove a point if later points are selected
            for (let i = index + 1; i < pathPoints.length; i++) {
                if (pathPoints[i]) return false;
            }
        }

        // Update the point state and notify subscribers
        pathPoints[index] = value;
        this.notify();
        return true;
    }

    // Toggle a point's selected state
    togglePoint(pathNum, index) {
        const pathPoints = this.getPathPoints(pathNum);
        return this.setPathPoint(pathNum, index, !pathPoints[index]);
    }
}