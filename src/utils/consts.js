export const extraAttr = {
    code: "", name: "", value: "",
    type: "string", optional: true, unit: null,
    group: null, explanation: null
};
// Navigation menu items on Create product page
export const createProductMenuItems = ["Product attributes", "Variation Theme",
    "Product Variations", "Images", "Keywords",
    "Submit"];
// Navigation menu items on Update product page
export const updateProductMenuItems = ["Product attributes", "Product Variations",
    "Images", "Keywords", "Submit"];

export const eventMenuItems = ["Event Data", "Product discounts", "Product Search"]
export const productImages = { main: null, secondaryImages: null, sourceProductId: null };
export const baseAttrs = {
    name: "",
    images: productImages,
    price: 0, discount_rate: null,
    tax_rate: 0, stock: 0,
    max_order_qty: 10,
    sku: "",
    external_id: null
}; // Base product attributes

export const attrSeparators = [" | ", ", ", " / "]; // Used to separate attributes in the product name