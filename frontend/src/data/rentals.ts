export type RentalItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  unitLabel: string;
  maxQty: number;
  metadata?: string;
  variants?: {
    label: string;
    maxQty: number;
  }[];
};

export const rentalItems: RentalItem[] = [
  {
    id: 1,
    name: "Flower Pedestals",
    price: 50,
    unitLabel: "per pedestal",
    maxQty: 4,
    metadata: "2 medium (2’6”) and 2 tall (3’)",
    description:
      "Elegant white pedestals perfect for ceremony aisles and altar arrangements.",
    image: "/images/RentalImages/flowerPedestals.JPG",
  },
  {
    id: 2,
    name: "Glass Bud Vases",
    price: 2,
    unitLabel: "per vase",
    maxQty: 64,
    description:
      "Clear glass bud vases perfect for tables, bars, and accent styling.",
    image: "/images/RentalImages/budVases.jpg",
  },
  {
    id: 3,
    name: "Picture Frames (4” x 6”)",
    price: 2,
    unitLabel: "per frame",
    maxQty: 33,
    description:
      "Elegant frames for signage, table numbers, or memory displays.",
    image: "/images/RentalImages/pictureFrames.jpg",
    variants: [
      { label: "White Frames", maxQty: 9 },
      { label: "Gold Geometric Frames", maxQty: 12 },
      { label: "Feather Gold Frames", maxQty: 12 },
    ],
  },
  {
    id: 4,
    name: "Yellow Candlesticks",
    price: 2,
    unitLabel: "per candle",
    maxQty: 24,
    description: "Soft yellow taper candles for warm lighting.",
    image: "/images/RentalImages/yellowCandle.jpg",
  },
  {
    id: 5,
    name: "Peach Candlesticks",
    price: 2,
    unitLabel: "per candle",
    maxQty: 24,
    description: "Peach-toned candles to add warmth and color.",
    image: "/images/RentalImages/peachCandle.jpg",
  },
  {
    id: 6,
    name: "White Candlesticks",
    price: 2,
    unitLabel: "per candle",
    maxQty: 24,
    description: "Classic white tapers for timeless styling.",
    image: "/images/RentalImages/whiteCandle.jpg",
  },
  {
    id: 7,
    name: "Candle Holders",
    price: 2,
    unitLabel: "per holder",
    maxQty: 24,
    description: "Simple holders compatible with standard taper candles.",
    image: "/images/RentalImages/candleHolder.jpg",
  },
  {
    id: 8,
    name: "Disco Lights",
    price: 15,
    unitLabel: "per light",
    maxQty: 2,
    description:
      "Fun disco lights to elevate dance floors and late-night celebrations.",
    image: "/images/RentalImages/discoLights.jpg",
  },
];
