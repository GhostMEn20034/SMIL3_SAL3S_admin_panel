export const extraAttr = { code: "", name: "", value: "", type: "string", optional: true, unit: null, group: null };
export const productMenuNavigationItems = ["Product attributes", "Variation Theme", "Product Variations", "Images", "Submit"];
export const productImages = {main: null, secondaryImages: null};
export const baseAttrs = {name: "",
                          images: productImages,
                          price: 0, discount_rate: null, 
                          tax_rate: 0, stock: 0,
                          max_order_qty: 10, 
                          sku: "", 
                          external_id: null}; // Base product attributes

export const attrSeparators = [" | ", ", ", " / "]; // Used to separate attributes in the product name