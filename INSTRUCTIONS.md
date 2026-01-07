
# Fix for React Key Warning in session-prep.tsx

## Root Cause
Line 139: `timeline.map((item) =>` is missing unique keys on the mapped elements.

## Solution
Add unique `id` fields to timeline array items and use them as keys:

```tsx
const timeline = [
  {
    id: 'timeline-7days',
    time: '7 Days Before',
    title: 'Grooming & Prep',
    // ... rest of item
  },
  {
    id: 'timeline-48hrs',
    time: '48 Hours Before',
    title: 'Final Touches',
    // ... rest of item
  },
  // ... more items with unique ids
];

// In render:
{timeline.map((item) => (
  <View key={item.id} style={styles.timelineItem}>
    {/* content */}
  </View>
))}
```

Apply the same pattern to any nested `.map()` calls (e.g., checklist items).
