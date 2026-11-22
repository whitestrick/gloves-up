// The drill library. This is fixed reference data, so it lives in a plain file.
// Each drill has an id (unique), a name, a category and a short description.
// The routine builder (#12) will import this same list to let users pick drills.
export const drills = [
  { id: 'jab', name: 'Jab', category: 'Punches', description: 'Straight punch with the lead hand. Extend fast, rotate the fist, then snap it back to your guard.' },
  { id: 'cross', name: 'Cross', category: 'Punches', description: 'Straight punch with the rear hand. Pivot the back foot and turn your hips and shoulders into it.' },
  { id: 'lead-hook', name: 'Lead Hook', category: 'Punches', description: 'Short arcing punch to the side of the head. Keep the elbow level and pivot the lead foot.' },
  { id: 'uppercut', name: 'Uppercut', category: 'Punches', description: 'Rising punch aimed at the chin. Bend your knees slightly and drive up through your legs.' },
  { id: 'jab-cross', name: 'Jab-Cross Combo', category: 'Punches', description: 'The classic 1-2. Throw the jab, then the cross right behind it.' },
  { id: 'slip', name: 'Slip', category: 'Defense', description: 'Move your head just outside the line of a punch so it passes by. Keep your eyes forward.' },
  { id: 'bob-weave', name: 'Bob and Weave', category: 'Defense', description: 'Bend the knees and dip under a hook, moving in a U shape to come up on the other side.' },
  { id: 'high-guard', name: 'High Guard', category: 'Defense', description: 'Hands up next to your chin with elbows tight to protect your head and body.' },
  { id: 'stance-shuffle', name: 'Stance and Shuffle', category: 'Footwork', description: 'Move forward, back and side to side in your stance without crossing your feet.' },
  { id: 'pivot', name: 'Pivot', category: 'Footwork', description: 'Turn on the ball of your lead foot to change your angle and escape the line of attack.' },
  { id: 'shadow-boxing', name: 'Shadow Boxing', category: 'Conditioning', description: 'Throw combinations at an imaginary opponent. Focus on form, movement and breathing.' },
  { id: 'jump-rope', name: 'Jump Rope', category: 'Conditioning', description: 'Builds rhythm, light feet and endurance. A classic warm-up for boxers.' },
  { id: 'heavy-bag', name: 'Heavy Bag Rounds', category: 'Conditioning', description: 'Work combinations on the heavy bag to build power and stamina.' },
]
