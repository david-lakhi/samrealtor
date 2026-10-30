export interface Property {
  id: string;
  title: string;
  location: string;
  city: string;
  propertyType: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: string;
  image?: string;
  video?: string;
  images?: string[];
  videos?: string[];
  description: string;
  features: string[];
  createdAt: string;
}

export const formatPrice = (price: number) =>
  price > 0 ? `₹${new Intl.NumberFormat('en-IN').format(price)}` : 'Price on request';

export const getPropertyImages = (property: Property) =>
  property.images?.length ? property.images : property.image ? [property.image] : [];

export const getPropertyVideos = (property: Property) =>
  property.videos?.length ? property.videos : property.video ? [property.video] : [];
