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