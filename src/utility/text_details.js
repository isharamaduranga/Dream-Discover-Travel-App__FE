import { Assets } from "@src/assets/images"


export  const badgeColorsArr = {
  Adventure: "light-info",
  WildLife: "light-danger",
  WaterSport: "light-primary",
  Nature: "light-success",
  Camping: "light-danger",
  Ancient: "light-warning",
  Festive: "light-secondary"
}


export const categoriesSingle = [
  { value: 'Adventure', label: 'Adventure' },
  { value: 'WildLife', label: 'WildLife' },
  { value: 'WaterSport', label: 'WaterSport' },
  { value: 'Nature', label: 'Nature' },
  { value: 'Camping', label: 'Camping' },
  { value: 'Ancient', label: 'Ancient' },
  { value: 'Festive', label: 'Festive' }
]

export const ratingRanges = [
  { value: { min:4.0, max:5.0 }, label: '5 Star' },
  { value: { min:3.0, max:4.0 }, label: '4 Star' },
  { value: { min:2.0, max:3.0 }, label: '3 Star' },
  { value: { min:1.0, max:2.0 }, label: '2 Star' },
  { value: { min:0.0, max:1.0 }, label: '1 Star' }
]


export const categories = [
  {
    id:'adventure',
    title: 'Adventure',
    image: Assets.adventure,
    description: 'Embark on thrilling escapades and adrenaline-pumping experiences. From rugged terrains to exciting outdoor challenges, our adventure is tailored for those seeking the extraordinary.'
  },
  {
    id:'wild_life',
    title: 'Wild Life',
    image: Assets.wild_life,
    description: 'Immerse yourself in the wonders of Sri Lanka\'s biodiversity. Encounter exotic wildlife, explore lush sanctuaries, and witness nature\'s creatures in their natural habitats.'
  },
  {
    id:'water_sport',
    title: 'Water Sport',
    image: Assets.water_sport,
    description: 'Dive into the vibrant world beneath the waves or ride the surf along stunning coastlines. Our water sports category beckons water enthusiasts with a variety of aquatic experiences.'
  },
  {
    id:'nature',
    title: 'Nature',
    image: Assets.nature,
    description: 'Discover the serenity of Sri Lanka\'s natural beauty. From breathtaking landscapes to tranquil gardens, our nature category invites you to unwind in the midst of picturesque surroundings. '
  },
  {
    id:'camping',
    title: 'Camping',
    image: Assets.camping,
    description: 'Pitch your tent under the starry skies and connect with nature on a deeper level. Our camping category offers scenic spots and a chance to experience the great outdoors activities. '
  },
  {
    id:'ancient',
    title: 'Ancient',
    image: Assets.ancient,
    description: 'Step back in time as you explore the rich historical and cultural heritage of Sri Lanka. The ancient category guides you through temples, ruins, and monuments steeped in history.'
  },
  {
    id:'festive',
    title: 'Festive',
    image: Assets.festive,
    description: 'Celebrate the vibrant spirit of Sri Lanka through its festivals. Join the festivities, witness traditional ceremonies, and experience the cultural richness of the island.'
  }
]

