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
    image: "/images/RentalImages/flowerPedestals.JPG",
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
  {
    id: 4,
    name: "Glass Bud Vases",
    price: "$2 per vase",
    description:
      "Clear glass bud vases perfect for tables, bars, and accent styling.",
    image: "/images/RentalImages/budVases.jpg",
  },
  {
    id: 5,
    name: "Gold & White Picture Frames",
    price: "$2 per frame",
    description:
      "Elegant gold and white frames for signage, tables, or memory displays.",
    image: "/images/RentalImages/pictureFrames.jpg",
  },
  {
    id: 6,
    name: "Yellow Candlesticks",
    price: "$2 per candle",
    description: "Soft yellow taper candles for warm, romantic lighting.",
    image: "/images/RentalImages/yellowCandle.jpg",
  },
  {
    id: 7,
    name: "Peach Candlesticks",
    price: "$2 per candle",
    description: "Peach-toned candles to add warmth and color to tablescapes.",
    image: "/images/RentalImages/peachCandle.jpg",
  },
  {
    id: 8,
    name: "White Candlesticks",
    price: "$2 per candle",
    description: "Classic white tapers for timeless, neutral styling.",
    image: "/images/RentalImages/whiteCandle.jpg",
  },
  {
    id: 9,
    name: "Candle Holders",
    price: "$2 per holder",
    description:
      "Simple candle holders compatible with standard taper candles.",
    image: "/images/RentalImages/candleHolder.jpg",
  },
  {
    id: 10,
    name: "Disco Lights",
    price: "$15 per light",
    description:
      "Fun disco lights to elevate dance floors and late-night celebrations.",
    image: "/images/RentalImages/discoLights.jpg",
  },
];
