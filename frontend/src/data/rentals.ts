export type RentalItem = {
  id: number;
  name: string;
  description: string;
  image: string;
};

export const rentalItems = [
  {
    id: 1,
    name: "Flower Pedestal",
    description:
      "Elegant white pedestal perfect for ceremony aisles and altar arrangements.",
    image: "/images/flowerpedestal.jpeg",
  },
  {
    id: 2,
    name: "Taper Candles",
    description: "Classic taper candles available in multiple colors.",
    image: "/images/candles.jpeg",
  },
  {
    id: 3,
    name: "Table Linens",
    description:
      "Neutral-toned linens that complement a wide range of tablescapes.",
    image: "/images/linens.jpg",
  },
];
