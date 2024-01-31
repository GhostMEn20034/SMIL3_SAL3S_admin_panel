import { useState, useEffect } from "react";
import { Box, Typography, Pagination, Button } from "@mui/material";
import { useNavigate, createSearchParams, useLocation, Link } from "react-router-dom";

import useAxios from "../../utils/useAxios";
import ProductList from "../../components/Product/ProductList";
import DeleteManyProductsDialog from "../../components/Product/DeleteManyProductsDialog";


export default function ProductPage() {
    const [pageCount, setPageCount] = useState(1);
    const [products, setProducts] = useState([]);
    const [checked, setChecked] = useState([]);
    const [checkedLength, setCheckedLength] = useState(0); // How many products with checked flag set to true
    const [openedDialog, setOpenedDialog] = useState(null); // What dialog is opened now?

    const api = useAxios('products');

    const hasCheckedItems = checkedLength < 1;

    const location = useLocation();

    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);

    let page = Number(params.get("page")) || 1;

    const handlePageChange = (event, value) => {
        page = value;
        let params = {
            page: page
        }
        navigate({ pathname: "/products", search: createSearchParams(params).toString() });
    };

    const handleChangeCheckedLength = (checkedArray) => {
        // Count checked products (including variations)
        let checkedCount = checkedArray.reduce((count, product) => {
            count += product.checked ? 1 : 0;
            if (product.variations) {
                count += product.variations.filter((variation) => variation.checked).length;
            }
            return count;
        }, 0);

        setCheckedLength(checkedCount);
    };

    // Changes array with checked products
    const handleChangeChecked = (index, variationIndex) => {
        /**
         * @param index - index of the product in the checked array.
         * @param variationIndex - index of the product variation in checked array (Optional).
         * 
         * */

        setChecked((prevValues) => {
            // Make a deep copy of checked array
            let checkedCopy = JSON.parse(JSON.stringify(prevValues));

            // Find a checked product by the index
            let checkedProduct = checkedCopy[index];

            // If the product was found
            if (checkedProduct) {
                // if there is no index of variations
                if (variationIndex === undefined || variationIndex === null) {
                    // Assign the opposite value for the "checked" property
                    checkedProduct.checked = !checkedProduct.checked;

                    // if there is an array with variations and array length is gt 0
                    if (checkedProduct.variations?.length > 0) {
                        // Assign the same value for the "checked" property in variations as in the parent
                        checkedProduct.variations = checkedProduct.variations.map(checkedVariation => {
                            checkedVariation.checked = checkedProduct.checked;
                            return checkedVariation;
                        });
                    }
                    handleChangeCheckedLength(checkedCopy);
                    return checkedCopy;
                }
                // Otherwise change value for the "checked" property in the variation
                if (!checkedProduct.checked) {
                    // Assign the opposite value for the "checked" property in the variation
                    checkedProduct.variations[variationIndex].checked =
                        !checkedProduct.variations[variationIndex].checked;
                }
                handleChangeCheckedLength(checkedCopy);
                return checkedCopy;
            }
            return prevValues;
        });

    };

    const getProducts = async () => {
        try {
            let response = await api.get("/admin/products/", {
                params: {
                    page: page
                }
            });
            let data = await response.data;
            // create an array that will help to define whether product or his children are checked
            const checkedData = data.products.map((product) => {
                let productData = {
                    _id: product._id, // get _id property
                    checked: false, // add a checked property to the object
                };

                // If there is an array with variations and his length is gt 0, 
                // then add variations property which will help to define whether product children are checked
                if (product.variations && product.variations.length > 0) {
                    productData.variations = product.variations.map((variation) => {
                        return {
                            _id: variation._id, // get _id property from variation obj
                            checked: false // add a checked property to the variation object
                        };
                    });
                }

                return productData;
            });

            setProducts(data.products);
            setChecked(checkedData);
            setPageCount(data.page_count);
        } catch (error) {
            console.log("Something went wrong");
        }
    };

    const handleSubmitDeletion = async () => {
        // If there are no checked products, then just close delete product dialog
        if (checkedLength === 0) {
            setOpenedDialog(null);
            return;
        }

        let productIdsToDelete = [];
        // Add all checked products to the productIdsToDelete array
        for (let value of checked) {
            if (value.checked) {
                productIdsToDelete.push(value._id);
              // if there are variations, then add all checked variations
            } else if (value.variations) {
                for (let variation of value.variations) {
                    if (variation.checked) {
                        productIdsToDelete.push(variation._id);
                    }
                }
            }
        };

        try {
            await api.delete(`/admin/products/`, {data: {
                product_ids: productIdsToDelete
            }});
            setCheckedLength(0);
            getProducts();
        } catch (e) {
            console.log(e.response.data);
        }
        setOpenedDialog(null);
    };


    useEffect(() => {
        getProducts();
    }, [page]);

    return (
        <>
            {openedDialog === "deleteProducts" && (
                <DeleteManyProductsDialog
                    open={openedDialog === "deleteProducts"}
                    setOpen={setOpenedDialog}
                    handleSubmit={handleSubmitDeletion}
                />
            )}
            <Box sx={{ mb: 2, mt: 2, ml: 3 }}>
                <Typography variant="h4">
                    Product List
                </Typography>
            </Box>
            <Box sx={{ ml: 3, mb: 3 }} display="flex" alignItems="center">
                <Link to={"/product-classify"} style={{ color: 'inherit', textDecoration: 'inherit' }}>
                    <Button variant="contained" size="small">
                        Add new product
                    </Button>
                </Link>
                <Button sx={{ ml: 2 }} variant="contained"
                    color="error" size="small"
                    disabled={hasCheckedItems}
                    onClick={() => setOpenedDialog("deleteProducts")}
                >
                    Delete Products
                </Button>
                {checkedLength > 0 && (
                    <Typography variant="body1" sx={{ ml: 2 }}>
                        Products Selected: {checkedLength}
                    </Typography>
                )}
            </Box>
            <Box sx={{ px: 3 }}>
                <ProductList products={products} checked={checked} handleChangeChecked={handleChangeChecked} />
            </Box>
            <Box sx={{ mt: 2, ml: 3, mb: 2 }}>
                <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
            </Box>
        </>
    );
}