export interface ProductVariant {
  name: string;
  price?: number;
}

/**
 * Robustly parses any variation format (JSON array of objects, array of strings,
 * JSON string, comma-separated string) into a structured ProductVariant list.
 */
export function parseProductVariants(rawVariants: any, basePrice: number = 0): ProductVariant[] {
  if (!rawVariants) return [];

  // Case 1: Already an array
  if (Array.isArray(rawVariants)) {
    return rawVariants.map((item: any) => {
      if (typeof item === 'object' && item !== null) {
        return {
          name: String(item.name || item.title || item.label || '').trim(),
          price: item.price !== undefined ? Number(item.price) : basePrice
        };
      }
      const str = String(item).trim();
      return parseSingleVariantString(str, basePrice);
    }).filter(v => v.name.length > 0);
  }

  // Case 2: String format
  if (typeof rawVariants === 'string') {
    const trimmed = rawVariants.trim();
    
    // Check if JSON
    if ((trimmed.startsWith('[') && trimmed.endsWith(']')) || (trimmed.startsWith('{') && trimmed.endsWith('}'))) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parseProductVariants(parsed, basePrice);
        } else if (typeof parsed === 'object' && parsed !== null) {
          return [{
            name: parsed.name || parsed.title || 'Default',
            price: parsed.price !== undefined ? Number(parsed.price) : basePrice
          }];
        }
      } catch (e) {
        // If JSON parse fails, fallback
      }
    }

    // Comma-separated or line-separated string (e.g. "250g, 500g" or "S, M, L, XL")
    return trimmed.split(/,|\n/).map(part => {
      return parseSingleVariantString(part.trim(), basePrice);
    }).filter(v => v.name.length > 0);
  }

  return [];
}

function parseSingleVariantString(str: string, basePrice: number): ProductVariant {
  // Check for "250g - ₹120" or "500g (₹450)" or "500g: 450"
  const priceMatch = str.match(/^(.*?)(?:[-:(]\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*\)?)?$/i);
  if (priceMatch && priceMatch[2]) {
    return {
      name: priceMatch[1].trim(),
      price: Number(priceMatch[2])
    };
  }
  return {
    name: str,
    price: basePrice
  };
}

/**
 * Helper to find price for a chosen variant
 */
export function getVariantPrice(variants: ProductVariant[], selectedVariantName: string | null, defaultPrice: number): number {
  if (!selectedVariantName || !variants.length) return defaultPrice;
  const match = variants.find(v => v.name.toLowerCase() === selectedVariantName.toLowerCase());
  return match && match.price !== undefined ? match.price : defaultPrice;
}
