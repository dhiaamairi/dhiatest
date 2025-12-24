/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: onlinestores
 * Interface for OnlineStores
 */
export interface OnlineStores {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  storeName?: string;
  /** @wixFieldType url */
  websiteUrl?: string;
  /** @wixFieldType text */
  description?: string;
  /** @wixFieldType image */
  storeLogo?: string;
  /** @wixFieldType text */
  category?: string;
  /** @wixFieldType text */
  countryOfOrigin?: string;
  /** @wixFieldType boolean */
  internationalShipping?: boolean;
}
