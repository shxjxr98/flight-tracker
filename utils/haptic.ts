'use client';

/**
 * Utility function to trigger haptic feedback on mobile devices
 * @param type - Type of haptic feedback: 'light', 'medium', 'heavy', 'success', 'warning', 'error'
 */
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' = 'light') {
    // Check if the Vibration API is supported
    if (!navigator.vibrate) {
        return;
    }

    // Define vibration patterns for different feedback types
    const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
        success: [10, 50, 10],
        warning: [20, 100, 20],
        error: [50, 100, 50, 100, 50],
    };

    // Trigger the vibration
    navigator.vibrate(patterns[type]);
}

/**
 * Hook to add haptic feedback to button clicks
 */
export function useHaptic() {
    const handleClick = (callback?: () => void, hapticType: Parameters<typeof triggerHaptic>[0] = 'light') => {
        return () => {
            triggerHaptic(hapticType);
            callback?.();
        };
    };

    return { handleClick, triggerHaptic };
}
